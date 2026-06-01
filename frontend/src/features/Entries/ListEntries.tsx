import { useEffect, useState } from 'react'
import './ListEntries.css'
import Entry from './Entry' 
import { getEntries } from '../../services/financeService'
import type { EntryFilterState } from './EntryFilters'

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
  filters?: EntryFilterState
}

export default function ListEntries({ onEdit, filters }: Props) {
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

  const visibleEntries = entries.filter(entry => {
  if (!filters) return true

  const date = new Date(entry.date)

  const matchesMonth =
    filters.month === 'all' || date.getMonth() === filters.month

  const matchesYear =
    filters.year === 'all' || date.getFullYear() === filters.year

  const matchesCategory =
    filters.categoryId === 'all' || entry.category_id === filters.categoryId

  return matchesMonth && matchesYear && matchesCategory
})

  return (
    <div>
      {visibleEntries.length > 0? (
        <ul className="list-entries">
        {visibleEntries.map(entry => (
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
      ) : (
        <div className="empty-list">
          <p>Nenhum lançamento encontrado. Registre algo novo!</p>
        </div>
      )}
      
    </div>
    
  )
}