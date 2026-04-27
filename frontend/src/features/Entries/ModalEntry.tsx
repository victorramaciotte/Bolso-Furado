import { useEffect, useState } from 'react'
import './ModalEntry.css'
import { NumericFormat } from 'react-number-format'
import type { EntryData } from './ListEntries'
import { updateEntry, createEntry, deleteEntry, getCategories, createCategory } from '../../services/financeService'

interface Props {
  onClose: () => void
  onSuccess: () => void
  entry?: EntryData
}

export interface CategoryData {
  id: number
  name: string
}

export default function ModalEntry({ onClose, onSuccess, entry}: Props) {
  const [categories, setCategories] = useState<CategoryData[]>([])
  const editMode = !!entry
  const [form, setForm] = useState({
    name: entry?.name ?? '',
    value: entry?.value.toString() ?? '',
    type: entry?.type ?? '',
    date: entry?.date?.slice(0, 10) ?? '', 
    source: entry?.source ?? '',
    category_id: entry?.category_id ?? '',
    reason: entry?.reason ?? '',
    status: entry?.status ?? '',
    recurrence: entry?.recurrence,
    endDate: entry?.endDate?.slice(0, 10) ?? '',
    newCat: ''
  })

    useEffect(() => {
      getCategories()
        .then(data => {
          setCategories(data)
        })
    }, [])
  
  const [errors, setErrors] = useState({
  name: '',
  value: '',
  category_id: '',
  type: '',
})

  useEffect(() => {
  if (entry) {
    setForm({
      name: entry.name ?? '',
      value: entry.value.toString() ?? '',
      type: entry.type ?? '',
      date: entry.date?.slice(0, 10) ?? '',
      source: entry.source ?? '',
      category_id: entry.category_id ?? '',
      reason: entry.reason ?? '',
      status: entry.status ?? '',
      recurrence: entry?.recurrence ?? '',
      endDate: entry?.endDate?.slice(0, 10) ?? '',
      newCat: ''
    })
  }
}, [entry])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleDelete() {
   try {
    await deleteEntry(entry!.id)
    onSuccess()
    
  } catch (err) {
    console.error('Erro ao deletar:', err)
  }
}

 async function handleSubmit() {
  let categoryId = form.category_id
  let newErrors = {
  name: '',
  value: '',
  category_id: '',
  type: '',
}

  if (!form.name) {
    newErrors.name = 'O nome é obrigatório!'
  }

  if (!form.value) {
    newErrors.value = 'O valor é obrigatório!'
  }

  if (!form.category_id) {
  newErrors.category_id = 'A categoria é obrigatória!'
}

  if (!form.type) {
  newErrors.type = 'O tipo é obrigatório!'
}
  setErrors(newErrors)

  // Se tiver erro, NÃO envia
  if (newErrors.name || newErrors.value || newErrors.category_id || newErrors.type) return

  if (editMode) {
  await updateEntry(entry!.id, {
    ...form,
    category_id: Number(categoryId),
    value: parseFloat(form.value),
    endDate: form.recurrence && form.recurrence !== 'Nenhuma' ? form.endDate : ''
  })
} else {

  if(form.category_id === 'new') {
    const newCat = await createCategory(form.newCat)
    categoryId = newCat.id
  }

  await createEntry({
    ...form,
    category_id: Number(categoryId),
    value: parseFloat(form.value)
  })
}
  
  onSuccess()
  onClose()
}


  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e: { stopPropagation: () => any }) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="modal-title">Registrar Lançamento</h2>

        <label>Nome Lançamento <span className="required">*</span></label>
        <input
          name="name"
          placeholder="Ex: Academia, Conta de Água, Lanche"
          value={form.name}
          onChange={handleChange}
        />

{errors.name && <span className="error">{errors.name}</span>}

        <div className="modal-line">
          <div className="modal-group">
            <label>Valor <span className="required">*</span></label>
            <NumericFormat
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              decimalScale={2}
              fixedDecimalScale
              placeholder="R$ 0,00"
              value={form.value}
              onValueChange={(values) => {
                setForm({ ...form, value: values.value })
              }}
/>

{errors.value && <span className="error">{errors.value}</span>}
          </div>
          
          <div className="modal-group">
            <label>Tipo <span className="required">*</span></label>

            <div className="modal-radio">
              <label>
                <input
                  type="radio"
                  name="type"
                  value="entrada"
                  onChange={handleChange}
                /> Receita
              </label>
              
              <label>
                <input
                type="radio"
                name="type"
                value="saida"
                onChange={handleChange}
              /> Despesa
            </label>
          </div>

          {errors.type && (<span className="error">{errors.type}</span>
          )}
          </div>

        </div>

        <div className="modal-line">
          <div className="modal-group">
            <label>Data:</label>
            <input
  name="date"
  type="date"
  value={form.date}
  onChange={handleChange}
  required
/>
          </div>
          <div className="modal-group">
            <label>Origem:</label>
            <select name="source" value={form.source} onChange={handleChange}>
              <option value="" disabled>Selecione</option>
                {['Salário','Freelance','Investimento','Presente','Outros'].map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
            </select>
          </div>
        </div>

        <div className="modal-line">
          <div className="modal-group">
        <label>Categoria <span className="required">*</span></label>

        <select name="category_id" value={form.category_id} onChange={handleChange}>
            <option value="" disabled>Selecione</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}

            <option value="new">Nova Categoria</option>
        </select>

        {form.category_id && form.category_id == 'new' && (
              <div className="modal-group">
                <label>Nova Categoria:</label>
                <input name="newCat" value={form.newCat} onChange={handleChange}/>
              </div>
              )}

  {errors.category_id && (<span className="error">{errors.category_id}</span>
  )}
</div>
          <div className="modal-group">
            <label>Motivo:</label>
            <select name="reason" value={form.reason} onChange={handleChange}>
              <option value="" disabled>Selecione</option>
                {['Necessidade','Lazer','Investimento','Imprevisto','Desejo'].map(o => (
              <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>
              
        <div className="modal-line">
          <div className="modal-group">
            <label>Status:</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="" disabled>Selecione</option>
              {['Pago','Pendente','Agendado','Cancelado'].map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className="modal-group">
            <label>Recorrência:</label>
            <select name="recurrence" value={form.recurrence} onChange={handleChange}>
              <option value="" disabled>Selecione</option>
                {['Nenhuma', 'Diário','Semanal','Quinzenal','Mensal'].map(o => (
              <option key={o} value={o}>{o}</option>
              ))}
            </select>

            {form.recurrence && form.recurrence !== 'Nenhuma' && (
              <div className="modal-group">
                <label>Data Final da Recorrência:</label>
                <input
                  name="endDate"
                  type="date"
                  value={form.endDate ?? ''}
                  onChange={handleChange}
                />
              </div>
              )}
          </div>
        </div>

        <section className='action'>
            {editMode && (
            <section className='edit-btn'>
              <button className="modal-btn" onClick={(e) => { e.stopPropagation(); handleDelete(); }}>
                <i className="fi fi-br-trash"></i>
                Remover
              </button>
              <button className="modal-btn" onClick={onClose}>Cancelar</button> 
            </section>
            
          )}

          <button className="modal-btn" onClick={handleSubmit}>{editMode ? 'Salvar Alterações' : 'Registrar Lançamento'}</button>
        </section>

        
      </div>
    </div>
  )
}