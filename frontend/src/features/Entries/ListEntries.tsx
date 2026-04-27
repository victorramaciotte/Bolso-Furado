import { useEffect, useState } from 'react'
import './ListEntries.css'
import Entry from './Entry' 
import { getEntries } from '../../services/financeService'

export interface EntryData {
  id: number
  name: string
  value: number
  source?: string
  type: string
  reason?: string
  status: string
  recurrence?: string
  date: string
  endDate?: string
  category_id: number
  category: {
    id: number
    name: string
  }
}

export type CreateEntryData = Omit <EntryData, 'id' | 'category'>

interface Props {
  onEdit: (entry: EntryData) => void
}

export default function ListEntries({ onEdit }: Props) {
  const [entries, setEntries] = useState<EntryData[]>([])
  const [loading, setLoading] = useState(true)
  const [toggle, setToggle] = useState<number | null>(null)

  useEffect(() => {
    getEntries()
      .then(data => {
        setEntries(data)
        setLoading(false)
      })
  }, [])

  if (loading) return <p className="loading-list">Carregando...</p>

  return (
    <ul className="list-entries">
    {entries.map(entry => (
      <Entry
        key={entry.id}
        name={entry.name}
        value={entry.value}
        type={entry.type}
        source={entry.source}
        reason={entry.reason}
        status={entry.status}
        recurrence={entry.recurrence}
        date={entry.date}
        endDate={entry.endDate}
        category_id={entry.category_id}
        category={entry.category}
        toggle={toggle === entry.id}
        onEdit={() => onEdit(entry)}
        onToggle={() => setToggle(prev => prev === entry.id ? null : entry.id)}
      />
    ))}
  </ul>
  )
}