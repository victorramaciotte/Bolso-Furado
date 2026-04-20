import { useEffect, useState } from 'react'
import './ListEntries.css'
import Entry from './Entry' 
import { getEntries } from '../../services/entryService'

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
  category?: string
}

export type CreateEntryData = Omit <EntryData, 'id'>

interface Props {
  onEdit: (lanc: EntryData) => void
}

export default function ListEntries({ onEdit }: Props) {
  const [entries, setEntries] = useState<EntryData[]>([])
  const [loading, setLoading] = useState(true)
  const [toggle, setToggle] = useState<number | null>(null)

  useEffect(() => {
    getEntries()
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
      source={lanc.source}
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