
import './Entry.css'

interface EntryProps {
  name: string
  value: number
  type: string
  source?: string
  reason? :  string
  status: string
  recurrence?: string
  date: string
  endDate?: string
  category?: string
  toggle: boolean
  onEdit: () => void
  onToggle: () => void
}

function Entry({ name, value, type, source, reason, status, recurrence, date, endDate, category, toggle, onEdit, onToggle}: EntryProps) {
  const isIncome = type === 'entrada'

  return (
    <div className={`container ${toggle ? 'expanded' : ''}`} onClick={onToggle}>
        {toggle ? (
            <section>
                    <header>
                        <div className='icon-container'> 
                            <div className={`icon-wrapper ${isIncome ? 'icon-entrada' : 'icon-saida'}`}>
                                <i className={`fi fi-rs-${isIncome ? 'arrow-small-up' : 'arrow-small-down'}`}></i>
                            </div>
                        </div>
                        <div className='description'>{name}</div>
                        <div style={{display:'flex', justifyContent: 'flex-end', animation: 'fadeIn 0.9s ease-in-out'}}>
                            <span className="icon-wrapper" onClick={onEdit} style={{justifyContent: 'flex-end'}}>
                                <i className="fi fi-br-edit"></i>
                            </span>
                        </div>
                        
                    </header>
                    
                    <section  className='details'>
                        <p><b>Valor:</b> R$ {value.toFixed(2)} </p>
                        <p><b>Tipo:</b> {type}</p>
                        <p><b>Data:</b> {new Date(date).toLocaleDateString('pt-BR')}</p>
                        <p><b>Origem:</b> {source}</p>
                        <p><b>Categoria:</b> {category}</p>
                        {status? (<p><b>Status:</b> {status}</p>) : (null)}
                        {reason? (<p><b>Motivação:</b> {reason}</p>) : (null)}
                        {recurrence? (<p><b>Recorrência:</b> {recurrence}</p>) : (null)}
                        {endDate? (<p><b>Data Final da Recorrência:</b> {endDate}</p>) : (null)}
                    </section>
                    

                </section>
        ) : (
            <header>
                <div className='icon-container'> 
                    <div className={`icon-wrapper ${isIncome ? 'icon-entrada' : 'icon-saida'}`}>
                        <i className={`fi fi-rs-${isIncome ? 'arrow-small-up' : 'arrow-small-down'}`}></i>
                    </div>
                </div>
                <div className='description'>{name}</div>
                <div className={`value ${isIncome ? 'positivo' : 'negativo'}`} style={{animation: 'fadeIn 0.9s ease-in-out'}}>
                    {isIncome ? '+' : '-'} R$ {value.toFixed(2)}
                </div>
            </header>
            )
        }
        
      
    </div>
  )
}

export default Entry