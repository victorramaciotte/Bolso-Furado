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
      key={lanc.id}
      nome={lanc.nome}
      valor={lanc.valor}
      tipo={lanc.tipo}
    />
  ))}
</ul>
  )
}