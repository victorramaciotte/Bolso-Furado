import { useEffect, useState } from 'react'
import './ListEntries.css'
import Entry from './Entry' 

export interface EntryData {
  id: number
  name: string
  value: number
  origin?: string
  type: string
  reason?: string
  status: string
  recurrence: string
  date: string
  endDate?: string
  category?: string
}

interface Props {
  onEdit: (lanc: EntryData) => void
}

export default function ListEntries({ onEdit }: Props) {
  const [entries, setEntries] = useState<EntryData[]>([])
  const [loading, setLoading] = useState(true)
  const [toggle, setToggle] = useState<number | null>(null)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/entries`)
      .then(res => res.json())
      .then(date => {
        setEntries(date)
        setLoading(false)
      })
  }, [])

  if (loading) return <p className="loading-list">Carregando...</p>

  return (
    <ul className="list-entries">
  {entries.map(lanc => (
    <Entry
      key={lanc.id}
      name={lanc.name}
      value={lanc.value}
      type={lanc.type}
      origin={lanc.origin}
      reason={lanc.reason}
      status={lanc.status}
      recurrence={lanc.recurrence}
      date={lanc.date}
      endDate={lanc.endDate}
      category={lanc.category}
      toggle={toggle === lanc.id}
      onEdit={() => onEdit(lanc)}
      onToggle={() => setToggle(prev => prev === lanc.id ? null : lanc.id)}
    />
  ))}
</ul>
  )
}