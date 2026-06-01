import type { EntryData } from './ListEntries'

export type EntryFilters = {
  month: number | 'all'
  year: number | 'all'
  categoryId: number | 'all'
}

export function filterEntries(entries: EntryData[], filters: EntryFilters) {
  return entries.filter(entry => {
    const date = new Date(entry.date)

    const matchesMonth =
      filters.month === 'all' || date.getMonth() === filters.month

    const matchesYear =
      filters.year === 'all' || date.getFullYear() === filters.year

    const matchesCategory =
      filters.categoryId === 'all' || entry.category_id === filters.categoryId

    return matchesMonth && matchesYear && matchesCategory
  })
}

export function sortEntriesByDate(
  entries: EntryData[],
  direction: 'asc' | 'desc' = 'desc'
) {
  return [...entries].sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()

    return direction === 'desc' ? dateB - dateA : dateA - dateB
  })
}