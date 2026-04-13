import { useEffect, useState } from 'react'
import './ModalNovoLancamento.css'
import { NumericFormat } from 'react-number-format'
import type { LancamentoData } from './ListaLancamento'

interface Props {
  onClose: () => void
  onSucesso: () => void
  lancamento?: LancamentoData
}

export default function ModalNovoLancamento({ onClose, onSucesso, lancamento}: Props) {
  const modoEdicao = !!lancamento
  const [form, setForm] = useState({
    nome: lancamento?.nome ?? '',
    valor: lancamento?.valor.toString() ?? '',
    tipo: lancamento?.tipo ?? '',
    data: lancamento?.data?.slice(0, 10) ?? '', 
    origem: lancamento?.origem ?? '',
    categoria: lancamento?.categoria ?? '',
    motivacao: lancamento?.motivacao ?? '',
    status: lancamento?.status ?? '',
    recorrencia: lancamento?.recorrencia?.slice(0, 10) ?? '',
  })
  const [erros, setErros] = useState({
  nome: '',
  valor: '',
  categoria: '',
  tipo: '',
})

  useEffect(() => {
  if (lancamento) {
    setForm({
      nome: lancamento.nome ?? '',
      valor: lancamento.valor.toString() ?? '',
      tipo: lancamento.tipo ?? '',
      data: lancamento.data?.slice(0, 10) ?? '',
      origem: lancamento.origem ?? '',
      categoria: lancamento.categoria ?? '',
      motivacao: lancamento.motivacao ?? '',
      status: lancamento.status ?? '',
      recorrencia: lancamento.recorrencia?.slice(0, 10) ?? '',
    })
  }
}, [lancamento])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleDelete() {
   try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/lancamentos/${lancamento!.id}`, {
      method: 'DELETE',
    })
    if (res.ok) {
      onSucesso()
    } else {
      console.error('Erro ao deletar, status:', res.status)
    }
  } catch (err) {
    console.error('Erro ao deletar:', err)
  }
}

 async function handleSubmit() {
  let novosErros = {
  nome: '',
  valor: '',
  categoria: '',
  tipo: '',
}

  if (!form.nome) {
    novosErros.nome = 'O nome é obrigatório!'
  }

  if (!form.valor) {
    novosErros.valor = 'O valor é obrigatório!'
  }

  if (!form.categoria) {
  novosErros.categoria = 'A categoria é obrigatória!'
}

  if (!form.tipo) {
  novosErros.tipo = 'O Tipo é obrigatório!'
}
  setErros(novosErros)

  // Se tiver erro, NÃO envia
  if (novosErros.nome || novosErros.valor || novosErros.categoria || novosErros.tipo) return

  await fetch(`${import.meta.env.VITE_API_URL}/lancamentos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...form,
      valor: parseFloat(form.valor),
    }),
  })
  
  onSucesso()
  onClose()
}


  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e: { stopPropagation: () => any }) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="modal-titulo">Registrar Lançamento</h2>

        <label>Nome Lançamento <span className="obrigatorio">*</span></label>
        <input
  name="nome"
  placeholder="Ex: Academia"
  value={form.nome}
  onChange={handleChange}
/>

{erros.nome && <span className="erro">{erros.nome}</span>}

        <div className="modal-linha">
          <div className="modal-grupo">
            <label>Valor <span className="obrigatorio">*</span></label>
            <NumericFormat
  thousandSeparator="."
  decimalSeparator=","
  prefix="R$ "
  decimalScale={2}
  fixedDecimalScale
  placeholder="R$ 0,00"
  value={form.valor}
  onValueChange={(values) => {
    setForm({ ...form, valor: values.value })
  }}
/>

{erros.valor && <span className="erro">{erros.valor}</span>}
          </div>
          
          <div className="modal-grupo">
            <label>Tipo <span className="obrigatorio">*</span></label>

            <div className="modal-radio">
              <label>
                <input
                  type="radio"
                  name="tipo"
                  value="entrada"
                  onChange={handleChange}
                /> Receita
              </label>
              
              <label>
                <input
                type="radio"
                name="tipo"
                value="saida"
                onChange={handleChange}
              /> Despesa
            </label>
          </div>

          {erros.tipo && (<span className="erro">{erros.tipo}</span>
          )}
          </div>

        </div>

        <div className="modal-linha">
          <div className="modal-grupo">
            <label>Data:</label>
            <input
  name="data"
  type="date"
  value={form.data}
  onChange={handleChange}
  required
/>
          </div>
          <div className="modal-grupo">
            <label>Origem:</label>
            <select name="origem" value={form.origem} onChange={handleChange}>
              <option value="" disabled>Selecione</option>
                {['Salário','Freelance','Investimento','Presente','Outros'].map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
            </select>
          </div>
        </div>

        <div className="modal-linha">
          <div className="modal-grupo">
        <label>Categoria <span className="obrigatorio">*</span></label>

        <select name="categoria" value={form.categoria} onChange={handleChange}>
            <option value="" disabled>Selecione</option>
              {['Alimentação','Transporte','Moradia'].map(o => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>

  {erros.categoria && (<span className="erro">{erros.categoria}</span>
  )}
</div>
          <div className="modal-grupo">
            <label>Motivação:</label>
            <select name="motivacao" value={form.motivacao} onChange={handleChange}>
              <option value="" disabled>Selecione</option>
                {['Necessidade','Lazer','Investimento','Imprevisto','Desejo'].map(o => (
              <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>
              
        <div className="modal-linha">
          <div className="modal-grupo">
            <label>Status:</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="" disabled>Selecione</option>
              {['Pago','Pendente','Agendado','Cancelado'].map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className="modal-grupo">
            <label>Recorrência:</label>
            <input name="recorrencia" type="date" value={form.recorrencia} onChange={handleChange} />
          </div>
        </div>

        <section className='action'>
            {modoEdicao && (
            <section className='edit-btn'>
              <button className="modal-btn" onClick={(e) => { e.stopPropagation(); handleDelete(); }}>
                <i className="fi fi-br-trash"></i>
                Remover
              </button>
              <button className="modal-btn" onClick={onClose}>Cancelar</button> 
            </section>
            
          )}

          <button className="modal-btn" onClick={handleSubmit}>{modoEdicao ? 'Salvar Alterações' : 'Registrar Lançamento'}</button>
        </section>

        
      </div>
    </div>
  )
}