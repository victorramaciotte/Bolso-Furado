import type { EntryData } from '../Entries/ListEntries'

export type ReportPeriod = {
  mode: 'week' | 'month' | 'year' | 'custom'
  startDate: Date
  endDate: Date
}

export function calcExpenses(entries: EntryData[]) {
  return entries
    .filter(entry => entry.type === 'expense')
    .reduce((total, entry) => total + entry.value, 0)
}

export function calcIncome(entries: EntryData[]) {
  return entries
    .filter(entry => entry.type === 'income')
    .reduce((total, entry) => total + entry.value, 0)
}

export function sumByCategory(entries: EntryData[], type: string) {
  const totals = new Map<string, number>()

  entries
    .filter(entry => entry.type === type)
    .forEach(entry => {
      const categoryName = entry.category?.name ?? 'Sem categoria'
      const current = totals.get(categoryName) ?? 0
      totals.set(categoryName, current + entry.value)
    })

  return Array.from(totals.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)
}

export function previewExpenses(entries: EntryData[]) {
  return entries
    .filter(entry => entry.type === 'expense' && entry.recurrence)
    .reduce((total, entry) => total + entry.value, 0)
}