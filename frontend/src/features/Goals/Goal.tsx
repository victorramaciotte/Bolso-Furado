
import './Goal.css'

interface GoalProps {
  name: string
  target_amount: number
  current_amount?: number
  initial_amount?: number
  deadline?: Date
  toggle: boolean
  onEdit: () => void
  onToggle: () => void
}

function Goal({ name, initial_amount, target_amount, current_amount, deadline, toggle, onEdit, onToggle}: GoalProps) {
  
    const goalProgress = (current_amount!/target_amount)*100

    function progressColor (value: number) {
        if (value <= 30) return 'var(--danger)'
        if (value >= 80) return 'var(--success)'
        return 'var(--primary)'
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
                    

                </section>
        ) : (
            <>
                <div className='goal-header'>
                    <div className='description'>{name}</div>
                    <div style={{display:'flex', justifyContent: 'flex-end'}}>
                        <span className="icon-wrapper" onClick={(e) => { e.stopPropagation(); onEdit(); }} style={{justifyContent: 'flex-end'}}>
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