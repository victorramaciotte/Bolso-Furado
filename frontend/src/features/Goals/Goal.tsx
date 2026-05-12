
import { useState } from 'react'
import './Goal.css'
import { NumericFormat } from 'react-number-format'
import { updateGoal } from '../../services/goalService'

interface GoalProps {
    id: number
    name: string
    target_amount: number
    current_amount?: number
    initial_amount?: number
    deadline?: Date
    toggle: boolean
    onEdit: () => void
    onToggle: () => void
    onUpdate: () => void
}

function Goal({ id, name, initial_amount, target_amount, current_amount, deadline, toggle, onEdit, onToggle, onUpdate}: GoalProps) {
  
    const goalProgress = (current_amount!/target_amount)*100
    const [showUpdateAmount, setShowUpdateAmount] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [amount, setAmount] = useState('')
    const [decrease, setDecrease] = useState(false);

    function progressColor (value: number) {
        if (value <= 30) return 'var(--danger)'
        if (value >= 80) return 'var(--success)'
        return 'var(--primary)'
    }

    async function updateAmount () {
        const base = current_amount ?? 0
        const newAmount = decrease 
            ? base - parseFloat(amount)
            : base + parseFloat(amount)

        await updateGoal(id, { 
            name, 
            target_amount, 
            current_amount: newAmount, 
            initial_amount 
        })

        setShowUpdateAmount(false) 
        setAmount('')               
        setDecrease(false)
        onUpdate()
    }

    function decreaseAmount () {
        setShowUpdateAmount(true)
        setDecrease(true)
    }

  return (
    <div className={`container ${toggle ? 'expanded' : ''}`} onClick={onToggle}>
        {toggle ? (
            <section>
                    <div className='goal-header'>
                        <div className='description'>{name}</div>
                        <div style={{display:'flex', justifyContent: 'flex-end'}}>
                        <span className="icon-wrapper" onClick={(e) => { e.stopPropagation(); onEdit(); }} style={{justifyContent: 'flex-end'}}>
                            <i className="fi fi-br-edit"></i>
                        </span>
                    </div>
                        
                    </div>
                    
                    <section  className='details'>
                        <span style={{display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)'}}>
                            <p><b>Objetivo:</b> {target_amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} </p>
                            {deadline? (<p><b>Até:</b> {new Date(deadline).toLocaleDateString('pt-BR')}</p>) : (null)}
                        </span>

                        <span className='progress-info'>
                            <p className='label'>Progresso:</p>
                            <p className='perc'>{goalProgress}%</p>
                            <div className='progress-bar'>
                                <div className='progress' style={{width:`${goalProgress}%`, backgroundColor: progressColor(goalProgress)}}></div>
                            </div>
                        </span>
                        
                        
                        <p className='progress-msg'>Falta {(target_amount - current_amount!).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} para você atingir sua meta!</p>
                    </section>
                    
                    <span className='amount-action'>
                        <button className='primary-btn' onClick={(e) => { e.stopPropagation(); setShowUpdateAmount(true) }}>Adicionar Valor</button>
                        <button className='muted-btn' onClick={(e) => { e.stopPropagation(); decreaseAmount() }}>Resgatar Valor</button>
                    </span>

                    {showUpdateAmount && (
                    <div className="modal-overlay" onClick={() => setShowUpdateAmount(false)}>
                        <div className="confirm-modal-box" onClick={e => e.stopPropagation()}>
                            {decrease ? (
                                <p>Digite o valor que você quer retirar das economias para esta meta.</p>
                            ) : (
                                <p>Digite o valor que você quer guardar para esta meta.</p>
                            )}
                            
                            <NumericFormat
                                                        thousandSeparator="."
                                                        decimalSeparator=","
                                                        prefix="R$ "
                                                        decimalScale={2}
                                                        fixedDecimalScale
                                                        placeholder="R$ 0,00"
                                                        value={amount}
                                                        onValueChange={(values) => setAmount(values.value)}
                                            />
                            <button className='muted-btn' onClick={() => setShowUpdateAmount(false)}>Cancelar</button>
                            <button className= {decrease ? 'red-btn' : 'primary-btn'} onClick={() => decrease ? setShowConfirm(true) : updateAmount()}>Confirmar</button>
                        </div>
                        {showConfirm && (
                            <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
                                <div className="confirm-modal-box" onClick={e => e.stopPropagation()}>
                                    <p>Tem certeza que deseja retirar <b>{parseFloat(amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</b> desta meta?</p>
                                    <button className='muted-btn' onClick={() => setShowConfirm(false)}>Cancelar</button>
                                    <button className='red-btn' onClick={() => { setShowConfirm(false); updateAmount() }}>Confirmar retirada</button>
                                </div>
                            </div>
                        )}
                    </div>
        )}

                </section>
        ) : (
            <>
                <div className='goal-header'>
                    <div className='description'>{name}</div>
                    <div style={{display:'flex', justifyContent: 'flex-end'}}>
                        <span className="icon-wrapper" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                            <i className="fi fi-br-edit"></i>
                        </span>
                    </div>
                </div>

                <span className='current-amount'>
                    <p className='currency'>R$</p>
                    <p> {current_amount?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </span>

                <div className= 'target' style={{animation: 'fadeIn 0.9s ease-in-out'}}>
                        Objetivo: {target_amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
            </>
            
            )
        }
        
      
    </div>
  )
}

export default Goal