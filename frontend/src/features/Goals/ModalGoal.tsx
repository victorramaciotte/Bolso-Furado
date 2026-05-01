import { useEffect, useState } from "react"
import type { GoalData } from "./ListGoals"
import { createGoal, deleteGoal, updateGoal } from "../../services/goalService"
import { NumericFormat } from "react-number-format"
import './ModalGoal.css'

interface Props {
  onClose: () => void
  onSuccess: () => void
  goal?: GoalData
}

function ModalGoal({ onClose, onSuccess, goal}: Props) {
    const editMode = !!goal
      const [form, setForm] = useState({
        name: goal?.name ?? '',
        target_amount: goal?.target_amount.toString() ?? '',
        current_amount: goal?.current_amount?.toString() ?? '',
        initial_amount: goal?.initial_amount?.toString()  ?? '', 
        deadline: goal?.deadline ? new Date(goal.deadline).toISOString().slice(0, 10) : ''
      })
    
      
      const [errors, setErrors] = useState({
      name: '',
      target_amount: '',
    })
    
      useEffect(() => {
      if (goal) {
        setForm({
            name: goal?.name ?? '',
            target_amount: goal?.target_amount.toString() ?? '',
            current_amount: goal?.current_amount?.toString() ?? '',
            initial_amount: goal?.initial_amount?.toString()  ?? '', 
            deadline: goal?.deadline ? new Date(goal.deadline).toISOString().slice(0, 10) : ''
        })
      }
    }, [goal])
    
      function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setForm({ ...form, [e.target.name]: e.target.value })
      }
    
      async function handleDelete() {
       try {
        await deleteGoal(goal!.id)
        onSuccess()
        
      } catch (err) {
        console.error('Erro ao deletar:', err)
      }
    }
    
     async function handleSubmit() {
      let newErrors = {
      name: '',
      target_amount: '',
    }
    
      if (!form.name) {
        newErrors.name = 'O Nome é obrigatório!'
      }
    
      if (!form.target_amount) {
        newErrors.target_amount = 'O Objetivo é obrigatório!'
      }
    
      setErrors(newErrors)
    
      // Se tiver erro, NÃO envia
      if (newErrors.name || newErrors.target_amount) return
    
      if (editMode) {
      await updateGoal(goal!.id, {
        ...form,
        target_amount: parseFloat(form.target_amount),
        current_amount: form.current_amount ? parseFloat(form.current_amount) : 0,
        initial_amount: form.initial_amount ? parseFloat(form.initial_amount) : 0,
        deadline: form.deadline ? new Date(form.deadline) : undefined,
      })
    } else {
    
    
      await createGoal({
        ...form,
        target_amount: parseFloat(form.target_amount),
        current_amount: form.initial_amount ? parseFloat(form.initial_amount) : 0,
        initial_amount: form.initial_amount ? parseFloat(form.initial_amount) : 0,
        deadline: form.deadline ? new Date(form.deadline) : undefined,
        })
    }
      
      onSuccess()
      onClose()
    }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e: { stopPropagation: () => any }) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <form onSubmit={handleSubmit}>
            <label>
                Nome da Meta: <span className="required">*</span>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Ex.: Viagem, Celular novo, Casa"/>
            </label>
            <label>
                Objetivo: <span className="required">*</span>
                <NumericFormat
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="R$ "
                            decimalScale={2}
                            fixedDecimalScale
                            placeholder="R$ 0,00"
                            value={form.target_amount}
                            onValueChange={(values) => {
                                setForm({ ...form, target_amount: values.value })
                            }}
                />
            </label>
            <label>
                Valor Inicial: 
                <NumericFormat
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="R$ "
                            decimalScale={2}
                            fixedDecimalScale
                            placeholder="R$ 0,00"
                            value={form.initial_amount}
                            onValueChange={(values) => {
                                setForm({ ...form, initial_amount: values.value })
                            }}
                />
            </label>
            <label>
                Prazo:
                <input type="date" name="deadline" value={form.deadline} onChange={handleChange}/>
            </label>
        </form>

            <section className='goal-action'>
                <button className="goal-modal-btn btn-muted" onClick={onClose}>Cancelar</button> 

                {editMode && (
                <section className='edit-btn'>
                    <button className="goal-modal-btn btn-delete" onClick={(e) => { e.stopPropagation(); handleDelete(); }}>
                        <i className="fi fi-br-trash"></i>
                        Remover
                    </button>
                </section>
                
            )}

                <button className="goal-modal-btn btn-save" onClick={handleSubmit}>{editMode ? 'Salvar Alterações' : 'Criar Meta'}</button>
            </section>
        </div>
    </div>
  )
}

export default ModalGoal