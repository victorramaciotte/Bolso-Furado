
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
  category_id: number
  category: {
    id: number
    name: string
  }
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
                    <div className='entry-header'>
                        <div className='entry-icon-container'> 
                            <div className={`entry-icon-wrapper ${isIncome ? 'icon-entrada' : 'icon-saida'}`}>
                                <i className={`fi fi-rs-${isIncome ? 'arrow-small-up' : 'arrow-small-down'}`}></i>
                            </div>
                        </div>
                        <div className='entry-description'>{name}</div>
                        <div style={{display:'flex', justifyContent: 'flex-end', animation: 'fadeIn 0.9s ease-in-out'}}>
                            <span className="entry-icon-wrapper" onClick={onEdit}>
                                <i className="fi fi-br-edit"></i>
                            </span>
                        </div>
                        
                    </div>
                    
                    <section  className='entry-details'>
                        <p><b>Valor:</b> {value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} </p>
                        <p><b>Tipo:</b> {type}</p>
                        <p><b>Data:</b> {new Date(date).toLocaleDateString('pt-BR')}</p>
                        <p><b>Origem:</b> {source}</p>
                        <p><b>Categoria:</b> {category.name}</p>
                        {status? (<p><b>Status:</b> {status}</p>) : (null)}
                        {reason? (<p><b>Motivação:</b> {reason}</p>) : (null)}
                        {recurrence? (<p><b>Recorrência:</b> {recurrence}</p>) : (null)}
                        {endDate? (<p><b>Data Final da Recorrência:</b> {new Date(endDate).toLocaleDateString('pt-BR')}</p>) : (null)}
                    </section>
                    

                </section>
        ) : (
            <div className='entry-header'>
                <div className='entry-icon-container'> 
                    <div className={`entry-icon-wrapper ${isIncome ? 'icon-entrada' : 'icon-saida'}`}>
                        <i className={`fi fi-rs-${isIncome ? 'arrow-small-up' : 'arrow-small-down'}`}></i>
                    </div>
                </div>
                <div className='entry-description'>{name}</div>
                <div className={`value ${isIncome ? 'positivo' : 'negativo'}`} style={{animation: 'fadeIn 0.9s ease-in-out'}}>
                    {isIncome ? '+' : '-'} {value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
            </div>
            )
        }
        
      
    </div>
  )
}

export default Entry