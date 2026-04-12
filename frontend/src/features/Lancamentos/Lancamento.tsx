
import './Lancamento.css'

interface LancamentoProps {
  nome: string
  valor: number
  tipo: string
  origem?: string
  motivacao? :  string
  status: string
  recorrencia: string
  data: string
  dataFR?: string
  categoria?: string
  toggle: boolean
  onToggle: () => void
}

function Lancamento({ nome, valor, tipo, origem, motivacao, status, recorrencia, data, dataFR, categoria, toggle, onToggle}: LancamentoProps) {
  const isEntrada = tipo === 'entrada'

  return (
    <div className='container' onClick={onToggle} style={{height: toggle ? "fit-content" : "5rem"}}>
        {toggle ? (
            <section className='details'>
                    <section className='top'>
                        <h3>{nome}</h3>
                        <span className="icon-wrapper">
                            <i className="fi fi-br-edit"></i>
                        </span>
                    </section>
                    
                    <p><b>Valor:</b> R$ {valor.toFixed(2)} </p>
                    <p><b>Tipo:</b> {tipo}</p>
                    <p><b>Data:</b> {data}</p>
                    <p><b>Origem:</b> {origem}</p>
                    <p><b>Categoria:</b> {categoria}</p>
                    {status? (<p><b>Status:</b> {status}</p>) : (null)}
                    {motivacao? (<p><b>Motivação:</b> {motivacao}</p>) : (null)}
                    {recorrencia? (<p><b>Recorrência:</b> {recorrencia}</p>) : (null)}
                    {dataFR? (<p><b>Data Final da Recorrência:</b> {dataFR}</p>) : (null)}
                    

                </section>
        ) : (
            <div className='header'>
                <div className='icon-container'> 
                    <div className={`icon-wrapper ${isEntrada ? 'icon-entrada' : 'icon-saida'}`}>
                        <i className={`fi fi-rs-${isEntrada ? 'arrow-small-up' : 'arrow-small-down'}`}></i>
                    </div>
                </div>
                <div className='description'>{nome}</div>
                <div className={`value ${isEntrada ? 'positivo' : 'negativo'}`}>
                    {isEntrada ? '+' : '-'} R$ {valor.toFixed(2)}
                </div>
            </div>
            )
        }
        
      
    </div>
  )
}

export default Lancamento