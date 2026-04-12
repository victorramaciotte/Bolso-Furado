import { useEffect, useState } from 'react'
import './ListaLancamento.css'
import Lancamento from '../Lancamentos/Lancamento' 

interface LancamentoData {
  id: number
  nome: string
  valor: number
  origem?: string
  tipo: string
  motivacao?: string
  status: string
  recorrencia: string
  data: string
  dataFR?: string
  categoria?: string
}

export default function ListaLancamentos() {
  const [lancamentos, setLancamentos] = useState<LancamentoData[]>([])
  const [loading, setLoading] = useState(true)
  const [toggle, setToggle] = useState<number | null>(null)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/lancamentos`)
      .then(res => res.json())
      .then(data => {
        setLancamentos(data)
        setLoading(false)
      })
  }, [])

  if (loading) return <p className="lista-loading">Carregando...</p>

  return (
    <ul className="lista-lancamentos">
  {lancamentos.map(lanc => (
    <Lancamento
      nome={lanc.nome}
      valor={lanc.valor}
      tipo={lanc.tipo}
      origem={lanc.origem}
      motivacao={lanc.motivacao}
      status={lanc.status}
      recorrencia={lanc.recorrencia}
      data={lanc.data}
      dataFR={lanc.dataFR}
      categoria={lanc.categoria}
      toggle={toggle === lanc.id}
      onToggle={() => setToggle(prev => prev === lanc.id ? null : lanc.id)}
    />
  ))}
</ul>
  )
}