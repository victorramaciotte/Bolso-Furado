
import { useEffect, useRef, useState } from 'react'
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

type Achievement = {
    threshold: 50 | 100
    title: string
    message: string
}

const ACHIEVEMENTS: Achievement[] = [
    {
        threshold: 50,
        title: 'Meio caminho andado!',
        message: 'Você chegou a 50% da sua meta.'
    },
    {
        threshold: 100,
        title: 'Meta concluída!',
        message: 'Você completou o valor planejado.'
    }
]

function Goal({ id, name, initial_amount, target_amount, current_amount, deadline, toggle, onEdit, onToggle, onUpdate}: GoalProps) {
  
    const goalProgress = ((current_amount ?? 0) / target_amount) * 100
    const visibleGoalProgress = Math.min(goalProgress, 100)
    const [showUpdateAmount, setShowUpdateAmount] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [amount, setAmount] = useState('')
    const [decrease, setDecrease] = useState(false);

    const [achievement, setAchievement] = useState<Achievement | null>(null)
    const achievementTimeout = useRef<number | null>(null)

    useEffect(() => {
        return () => {
            if (achievementTimeout.current) {
                window.clearTimeout(achievementTimeout.current)
            }
        }
    }, [])

    function achievementKey(threshold: number) {
        return `goal-achievement-${id}-${threshold}`
    }

    function showAchievement(newAchievement: Achievement) {
        if (achievementTimeout.current) {
            window.clearTimeout(achievementTimeout.current)
        }

        setAchievement(newAchievement)

        achievementTimeout.current = window.setTimeout(() => {
            setAchievement(null)
        }, 9000)
    }

    function unlockAchievements(previousProgress: number, nextProgress: number) {
        const unlocked = ACHIEVEMENTS.filter(item => {
            const alreadyShown = localStorage.getItem(achievementKey(item.threshold)) === 'true'
            return !alreadyShown && previousProgress < item.threshold && nextProgress >= item.threshold
        })

        unlocked.forEach(item => {
            localStorage.setItem(achievementKey(item.threshold), 'true')
        })

        if (unlocked.length > 0) {
            showAchievement(unlocked[unlocked.length - 1])
        }
    }

    function progressColor (value: number) {
        if (value <= 30) return 'var(--danger)'
        if (value >= 80) return 'var(--success)'
        return 'var(--primary)'
    }

    async function updateAmount () {
        const parsedAmount = parseFloat(amount)
        if (!parsedAmount || parsedAmount <= 0) return

        const base = current_amount ?? 0
        const newAmount = decrease 
            ? base - parsedAmount
            : base + parsedAmount

        const previousProgress = (base / target_amount) * 100
        const nextProgress = (newAmount / target_amount) * 100

        await updateGoal(id, { 
            name, 
            target_amount, 
            current_amount: newAmount, 
            initial_amount 
        })

        if (!decrease) {
            unlockAchievements(previousProgress, nextProgress)
        }

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
                        <span className="icon-wrapper" onClick={(e) => { e.stopPropagation(); onEdit(); }} >
                            <i className="fi fi-br-edit"></i>
                        </span>
                    </div>
                        
                    </div>
                    
                    <section  className='details'>
                        <span className="goal-info">
                            <p><b>Objetivo:</b> {target_amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} </p>
                            {deadline? (<p><b>Até:</b> {new Date(deadline).toLocaleDateString('pt-BR')}</p>) : (null)}
                        </span>

                        <span className='progress-info'>
                            <p className='label'>Progresso:</p>
                            <p className='perc'>{goalProgress.toFixed(0)}%</p>
                            <div className='progress-bar'>
                                <div
                                    className='progress'
                                    style={{
                                        width: `${visibleGoalProgress}%`,
                                        backgroundColor: progressColor(goalProgress)
                                    }}
                                ></div>
                            </div>
                        </span>
                        
                        
                        <p className='progress-msg'>
                            {goalProgress >= 100
                                ? 'Você atingiu sua meta!'
                                : `Falta ${(target_amount - (current_amount ?? 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} para você atingir sua meta!`
                            }
                        </p>
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
        
        {achievement && (
            <div
                className='achievement-toast'
                role='status'
                aria-live='polite'
                onClick={e => e.stopPropagation()}
            >
                <span className='achievement-icon'>
                    <i className='fi fi-sr-trophy'></i>
                </span>

                <span>
                    <strong>{achievement.title}</strong>
                    <p>{achievement.message} "{name}" está mais perto do seu objetivo.</p>
                </span>
            </div>
        )}
      
    </div>
  )
}

export default Goal