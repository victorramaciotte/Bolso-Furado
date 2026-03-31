import './Lancamento.css'

interface LancamentoProps {
  nome: string
  valor: number
  tipo: string
}

function Lancamento({ nome, valor, tipo}: LancamentoProps) {
  const isEntrada = tipo === 'entrada'

  return (
    <div className='container'>
      <div className='icon-container'>
        <div className={`icon ${isEntrada ? 'icon-entrada' : 'icon-saida'}`}>
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

export default Lancamento