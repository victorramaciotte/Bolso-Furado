import type { AccountSummary } from '../../services/accountService'
import type { EntryData } from '../Entries/ListEntries'

export type BudgetAlertLevel = 'warning' | 'danger' | 'exceeded'

export type BudgetAlert = {
  id: string
  title: string
  message: string
  level: BudgetAlertLevel
  percentage: number
  spent: number
  limit: number
  categoryId?: number
  categoryName?: string
}

export type RecurringExpense = {
  id: string
  name: string
  categoryId: number
  categoryName: string
  occurrences: number
  months: string[]
  averageValue: number
  declaredRecurrence?: string
}

function isExpense(entry: EntryData) {
  return entry.type === 'expense'
}

function isSameMonth(dateValue: string, referenceDate = new Date()) {
  const date = new Date(dateValue)

  return (
    date.getMonth() === referenceDate.getMonth() &&
    date.getFullYear() === referenceDate.getFullYear()
  )
}

function getAlertLevel(percentage: number): BudgetAlertLevel | null {
  if (percentage >= 100) return 'exceeded'
  if (percentage >= 90) return 'danger'
  if (percentage >= 75) return 'warning'

  return null
}

function formatPercentage(value: number) {
  return Math.round(value)
}

export function getCurrentMonthExpenses(entries: EntryData[], referenceDate = new Date()) {
  return entries.filter(entry => isExpense(entry) && isSameMonth(entry.date, referenceDate))
}

export function calculateBudgetAlerts(
  entries: EntryData[],
  accountSummary: AccountSummary,
  referenceDate = new Date()
): BudgetAlert[] {
  const currentMonthExpenses = getCurrentMonthExpenses(entries, referenceDate)
  const alerts: BudgetAlert[] = []

  if (accountSummary.budgetAmount > 0) {
    const spent = currentMonthExpenses.reduce((sum, entry) => sum + entry.value, 0)
    const percentage = (spent / accountSummary.budgetAmount) * 100
    const level = getAlertLevel(percentage)

    if (level) {
      alerts.push({
        id: 'general-budget',
        title: level === 'exceeded' ? 'Orçamento geral excedido' : 'Orçamento geral em atenção',
        message:
          level === 'exceeded'
            ? `Você já passou do orçamento mensal geral.`
            : `Você já usou ${formatPercentage(percentage)}% do orçamento mensal geral.`,
        level,
        percentage,
        spent,
        limit: accountSummary.budgetAmount
      })
    }
  }

  accountSummary.categoryLimits.forEach(limit => {
    if (limit.amount <= 0) return

    const spent = currentMonthExpenses
      .filter(entry => entry.category_id === limit.categoryId)
      .reduce((sum, entry) => sum + entry.value, 0)

    const percentage = (spent / limit.amount) * 100
    const level = getAlertLevel(percentage)

    if (level) {
      alerts.push({
        id: `category-budget-${limit.categoryId}`,
        title:
          level === 'exceeded'
            ? `Limite de ${limit.categoryName} excedido`
            : `Limite de ${limit.categoryName} em atenção`,
        message:
          level === 'exceeded'
            ? `Os gastos dessa categoria passaram do limite mensal.`
            : `Você já usou ${formatPercentage(percentage)}% do limite mensal dessa categoria.`,
        level,
        percentage,
        spent,
        limit: limit.amount,
        categoryId: limit.categoryId,
        categoryName: limit.categoryName
      })
    }
  })

  return alerts
}

function normalizeEntryName(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\b(assinatura|pagamento|mensalidade|conta|fatura)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function getMonthKey(dateValue: string) {
  const date = new Date(dateValue)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function hasDeclaredRecurrence(entry: EntryData) {
  return Boolean(entry.recurrence && entry.recurrence !== 'Nenhuma')
}

export function detectRecurringExpenses(entries: EntryData[]): RecurringExpense[] {
  const expenses = entries.filter(isExpense)
  const grouped = new Map<string, EntryData[]>()

  expenses.forEach(entry => {
    const normalizedName = normalizeEntryName(entry.name)
    if (!normalizedName) return

    const key = `${normalizedName}-${entry.category_id}`
    const current = grouped.get(key) ?? []

    grouped.set(key, [...current, entry])
  })

  return Array.from(grouped.values())
    .map(group => {
      const first = group[0]
      const months = Array.from(new Set(group.map(entry => getMonthKey(entry.date)))).sort()
      const declared = group.find(hasDeclaredRecurrence)
      const averageValue =
        group.reduce((sum, entry) => sum + entry.value, 0) / group.length

      return {
        id: `${normalizeEntryName(first.name)}-${first.category_id}`,
        name: first.name,
        categoryId: first.category_id,
        categoryName: first.category?.name ?? 'Sem categoria',
        occurrences: group.length,
        months,
        averageValue,
        declaredRecurrence: declared?.recurrence
      }
    })
    .filter(item => {
      const appearsInThreeMonths = item.months.length >= 3
      const declaredByUser = Boolean(item.declaredRecurrence)

      return declaredByUser || appearsInThreeMonths
    })
    .sort((a, b) => b.months.length - a.months.length)
}