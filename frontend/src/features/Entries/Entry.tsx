
import './Entry.css'

interface EntryProps {
  name: string
  value: number
  type: string
  origin?: string
  reason? :  string
  status: string
  recurrence: string
  date: string
  endDate?: string
  category?: string
  toggle: boolean
  onEdit: () => void
  onToggle: () => void
}

function Entry({ name, value, type, origin, reason, status, recurrence, date, endDate, category, toggle, onEdit, onToggle}: EntryProps) {
  const isIncome = type === 'entrada'

  return (
    <div className='container' onClick={onToggle} style={{height: toggle ? "fit-content" : "5rem"}}>
        {toggle ? (
            <section className='details'>
                    <section className='top'>
                        <h3>{name}</h3>
                        <span className="icon-wrapper" onClick={onEdit}>
                            <i className="fi fi-br-edit"></i>
                        </span>
                    </section>
                    
                    <p><b>Valor:</b> R$ {value.toFixed(2)} </p>
                    <p><b>Tipo:</b> {type}</p>
                    <p><b>Data:</b> {new Date(date).toLocaleDateString('pt-BR')}</p>
                    <p><b>Origem:</b> {origin}</p>
                    <p><b>Categoria:</b> {category}</p>
                    {status? (<p><b>Status:</b> {status}</p>) : (null)}
                    {reason? (<p><b>Motivação:</b> {reason}</p>) : (null)}
                    {recurrence? (<p><b>Recorrência:</b> {recurrence}</p>) : (null)}
                    {endDate? (<p><b>Data Final da Recorrência:</b> {endDate}</p>) : (null)}
                    

                </section>
        ) : (
            <div className='header'>
                <div className='icon-container'> 
                    <div className={`icon-wrapper ${isIncome ? 'icon-entrada' : 'icon-saida'}`}>
                        <i className={`fi fi-rs-${isIncome ? 'arrow-small-up' : 'arrow-small-down'}`}></i>
                    </div>
                </div>
                <div className='description'>{name}</div>
                <div className={`value ${isIncome ? 'positivo' : 'negativo'}`}>
                    {isIncome ? '+' : '-'} R$ {value.toFixed(2)}
                </div>
            </div>
            )
        }
        
      
    </div>
  )
}

export default Entry