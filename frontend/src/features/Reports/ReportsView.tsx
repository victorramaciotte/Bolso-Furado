import { useEffect, useState } from 'react'
import { getEntries, getCategories } from '../../services/financeService'
import { getAccountSummary, type AccountSummary } from '../../services/accountService'
import type { EntryData } from '../Entries/ListEntries'
import EntryFilters, { type EntryFilterState, type CategoryOption } from '../Entries/EntryFilters'
import { filterEntries } from '../Entries/entriesFilters'
import { calcExpenses, calcIncome, sumByCategory } from './ReportsCalc'
import './Reports.css'

type ChartMode = 'categories' | 'monthly'

type MonthlyExpense = {
  label: string
  total: number
}

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

function formatAxisValue(value: number) {
  if (value >= 1000) return `R$ ${(value / 1000).toFixed(0)}k`
  return `R$ ${value.toFixed(0)}`
}

function getMonthLabel(date: Date) {
  return date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')
}

function getLastSixMonthsExpenses(entries: EntryData[]) {
  const today = new Date()

  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() - 5 + index, 1)

    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: getMonthLabel(date),
      total: 0
    }
  })

  entries
    .filter(entry => entry.type === 'expense')
    .forEach(entry => {
      const date = new Date(entry.date)
      const key = `${date.getFullYear()}-${date.getMonth()}`
      const month = months.find(item => item.key === key)

      if (month) {
        month.total += entry.value
      }
    })

  return months.map(({ label, total }) => ({ label, total }))
}

export default function ReportsView() {
  const [entries, setEntries] = useState<EntryData[]>([])
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [accountSummary, setAccountSummary] = useState<AccountSummary | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [expanded, setExpanded] = useState<'income' | 'expense' | null>('expense')
  const [chartMode, setChartMode] = useState<ChartMode>('categories')

  const [filters, setFilters] = useState<EntryFilterState>({
    month: 'all',
    year: 'all',
    categoryId: 'all'
  })

  const [draftFilters, setDraftFilters] = useState(filters)

  useEffect(() => {
    getEntries().then(setEntries)
    getCategories().then(setCategories)
    getAccountSummary().then(setAccountSummary)
  }, [])

  function applyFilters() {
    setFilters(draftFilters)
    setShowFilters(false)
  }

  const filteredEntries = filterEntries(entries, filters)
  const totalExpenses = calcExpenses(filteredEntries)
  const totalIncome = calcIncome(filteredEntries)
  const expensesByCategory = sumByCategory(filteredEntries, 'expense')
  const incomeByCategory = sumByCategory(filteredEntries, 'income')
  const monthlyExpenses = getLastSixMonthsExpenses(entries)

  const maxCategoryExpense = Math.max(...expensesByCategory.map(item => item.total), 1)
  const budgetAmount = accountSummary?.budgetAmount ?? 0
  const maxMonthlyExpense = Math.max(...monthlyExpenses.map(item => item.total), budgetAmount, 1)

  const chartMax = chartMode === 'categories' ? maxCategoryExpense : maxMonthlyExpense

  const axisValues = [
    chartMax,
    chartMax * 0.75,
    chartMax * 0.5,
    chartMax * 0.25,
    0
  ]

  const budgetLineBottom = budgetAmount > 0
    ? Math.min((budgetAmount / chartMax) * 100, 100)
    : 0

  return (
    <section className="reports-view">
      <header className="reports-toolbar">
        <div className="reports-mode-toggle">
          <button
            className={chartMode === 'categories' ? 'active' : ''}
            onClick={() => setChartMode('categories')}
          >
            <i className="fi fi-br-bars-staggered"></i>
            Categorias
          </button>

          <button
            className={chartMode === 'monthly' ? 'active' : ''}
            onClick={() => setChartMode('monthly')}
          >
            <i className="fi fi-br-calendar"></i>
            Mensal
          </button>
        </div>

        <button
          className="reports-filter-btn"
          onClick={() => {
            setDraftFilters(filters)
            setShowFilters(true)
          }}
        >
          <i className="fi fi-br-settings-sliders"></i>
          Filtros
        </button>
      </header>

      <div className="report-card">
        <div className="report-card-header">
          <span>{chartMode === 'categories' ? 'Gastos por categoria' : 'Gastos mensais'}</span>
          <strong>{formatCurrency(chartMode === 'categories' ? totalExpenses : budgetAmount)}</strong>
        </div>

        {chartMode === 'categories' && expensesByCategory.length === 0 ? (
          <p className="empty-report">Nenhuma saída nesse período.</p>
        ) : (
          <div className="vertical-chart">
            <div className="chart-axis">
              {axisValues.map(value => (
                <span key={value}>{formatAxisValue(value)}</span>
              ))}
            </div>

            <div className="chart-plot">
              <div className="chart-grid-lines">
                {axisValues.map(value => (
                  <span key={value}></span>
                ))}
              </div>

              {chartMode === 'monthly' && budgetAmount > 0 && (
                <div className="budget-line" style={{ bottom: `${budgetLineBottom}%` }}>
                  <span>Orçamento</span>
                </div>
              )}

              <div className="chart-bars">
                {chartMode === 'categories' && expensesByCategory.map((item, index) => {
                  const percentage = chartMax > 0
                    ? (item.total / chartMax) * 100
                    : 0

                  return (
                    <div className="chart-bar-column category-mode" key={item.category}>
                      <div className="chart-bar-slot" title={`${item.category}: ${formatCurrency(item.total)}`}>
                        <div
                          className={`chart-bar color-${index % 6}`}
                          style={{ height: `${Math.max(percentage, 6)}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}

                {chartMode === 'monthly' && monthlyExpenses.map((item, index) => {
                  const percentage = chartMax > 0
                    ? (item.total / chartMax) * 100
                    : 0

                  return (
                    <div className="chart-bar-column" key={item.label}>
                      <div className="chart-bar-slot" title={`${item.label}: ${formatCurrency(item.total)}`}>
                        <div
                          className={`chart-bar color-${index % 6}`}
                          style={{ height: `${Math.max(percentage, item.total > 0 ? 6 : 0)}%` }}
                        ></div>
                      </div>

                      <span>{item.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {chartMode === 'categories' && (
          <div className="category-legend">
            {expensesByCategory.map((item, index) => {
              const percentage = totalExpenses > 0
                ? (item.total / totalExpenses) * 100
                : 0

              return (
                <div className="category-legend-row" key={item.category}>
                  <span className={`category-swatch color-${index % 6}`}></span>
                  <span title={item.category}>{item.category}</span>
                  <strong>{formatCurrency(item.total)}</strong>
                  <small>{percentage.toFixed(0)}%</small>
                </div>
              )
            })}
          </div>
        )}


      </div>

      <div className="report-summary">
        <div className={`report-group ${expanded === 'income' ? 'expanded' : ''}`}>
          <button
            className="report-total"
            onClick={() => setExpanded(expanded === 'income' ? null : 'income')}
          >
            <span>Entradas</span>
            <strong>{formatCurrency(totalIncome)}</strong>
            <i className="fi fi-br-angle-small-down"></i>
          </button>

          {expanded === 'income' && (
            <div className="category-breakdown">
              {incomeByCategory.map(item => (
                <div key={item.category} className="category-row income-row">
                  <span title={item.category}>{item.category}</span>
                  <strong>{formatCurrency(item.total)}</strong>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`report-group ${expanded === 'expense' ? 'expanded' : ''}`}>
          <button
            className="report-total"
            onClick={() => setExpanded(expanded === 'expense' ? null : 'expense')}
          >
            <span>Saídas</span>
            <strong>{formatCurrency(totalExpenses)}</strong>
            <i className="fi fi-br-angle-small-down"></i>
          </button>

          {expanded === 'expense' && (
            <div className="category-breakdown">
              {expensesByCategory.map((item, index) => (
                <div key={item.category} className="category-row">
                  <span className={`category-swatch color-${index % 6}`}></span>
                  <span title={item.category}>{item.category}</span>
                  <strong>{formatCurrency(item.total)}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="reports-filter-overlay" onClick={() => setShowFilters(false)}>
          <div className="reports-filter-panel" onClick={e => e.stopPropagation()}>
            <EntryFilters
              filters={draftFilters}
              onChange={setDraftFilters}
              categories={categories}
              onApply={applyFilters}
              onClose={() => setShowFilters(false)}
            />
          </div>
        </div>
      )}
    </section>
  )
}