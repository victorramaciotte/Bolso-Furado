import { useEffect, useState } from 'react'
import { getEntries, getCategories } from '../../services/financeService'
import type { EntryData } from '../Entries/ListEntries'
import EntryFilters, { type EntryFilterState, type CategoryOption } from '../Entries/EntryFilters'
import { filterEntries } from '../Entries/entriesFilters'
import { calcExpenses, calcIncome, sumByCategory } from './ReportsCalc'
import './Reports.css'

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

export default function ReportsView() {
  const [entries, setEntries] = useState<EntryData[]>([])
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [expanded, setExpanded] = useState<'income' | 'expense' | null>(null)

  const [filters, setFilters] = useState<EntryFilterState>({
    month: 'all',
    year: 'all',
    categoryId: 'all'
  })

  const [draftFilters, setDraftFilters] = useState(filters)

  

  useEffect(() => {
    getEntries().then(setEntries)
    getCategories().then(setCategories)
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

  const maxTotal = Math.max(totalIncome, totalExpenses, 1)

  

  return (
    <section>
      <button onClick={() => {
        setDraftFilters(filters)
        setShowFilters(true)
      }}>
        Filtros
      </button>

      {expensesByCategory.length === 0 ? (
        <p className="empty-report">Nenhuma saída nesse período.</p>
      ) : (
        <div className="category-chart">
          <div className="report-card">
            <div className="report-card-header">
              <span>Gastos do período</span>
              <strong>{formatCurrency(totalExpenses)}</strong>
            </div>

            <div className="category-chart">
              {expensesByCategory.map((item, index) => {
                const percentage = totalExpenses > 0
                  ? (item.total / totalExpenses) * 100
                  : 0

                return (
                  <div className="category-bar-row" key={item.category}>
                    <div
                      className={`category-bar color-${index % 6}`}
                      style={{ width: `${Math.max(percentage, 8)}%` }}
                    >
                      <span>{item.category}</span>
                      <strong>{percentage.toFixed(0)}%</strong>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      

      {showFilters && (
        <div className="filter-overlay" onClick={() => setShowFilters(false)}>
          <EntryFilters
            filters={draftFilters}
            onChange={setDraftFilters}
            categories={categories}
            onApply={applyFilters}
            onClose={() => setShowFilters(false)}
          />
        </div>
      )}

      <div className="report-summary">
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
              <div key={item.category} className="category-row">
                <span>{item.category}</span>
                <strong>{formatCurrency(item.total)}</strong>
              </div>
            ))}
          </div>
        )}

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
            {expensesByCategory.map(item => (
              <div key={item.category} className="category-row">
                <span>{item.category}</span>
                <strong>{formatCurrency(item.total)}</strong>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}