import { useEffect, useState } from 'react'
import { getAccountSummary, type AccountSummary } from '../../services/accountService'
import { getEntries } from '../../services/financeService'
import type { EntryData } from '../Entries/ListEntries'
import {
  calculateBudgetAlerts,
  detectRecurringExpenses,
  type BudgetAlert,
  type RecurringExpense
} from './budgetMonitoring'
import './BudgetMonitor.css'

interface Props {
  reloadKey: number
}

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

function getMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function getDismissKey(alert: BudgetAlert) {
  return `budget-alert-dismissed-${getMonthKey()}-${alert.id}-${alert.level}`
}

function levelLabel(level: BudgetAlert['level']) {
  if (level === 'exceeded') return 'Excedido'
  if (level === 'danger') return 'Perto do limite'

  return 'Atenção'
}

export default function BudgetMonitor({ reloadKey }: Props) {
  const [alerts, setAlerts] = useState<BudgetAlert[]>([])
  const [pendingAlerts, setPendingAlerts] = useState<BudgetAlert[]>([])
  const [activeAlert, setActiveAlert] = useState<BudgetAlert | null>(null)
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([])
  const [showDetails, setShowDetails] = useState(false)

  async function loadMonitoringData() {
    const [entriesData, summaryData] = await Promise.all([
      getEntries(),
      getAccountSummary()
    ])

    const entries = entriesData as EntryData[]
    const summary = summaryData as AccountSummary

    const nextAlerts = calculateBudgetAlerts(entries, summary)
    const nextRecurringExpenses = detectRecurringExpenses(entries)

    const newPendingAlerts = nextAlerts.filter(alert => {
      return localStorage.getItem(getDismissKey(alert)) !== 'true'
    })

    setAlerts(nextAlerts)
    setRecurringExpenses(nextRecurringExpenses.slice(0, 3))
    setPendingAlerts(newPendingAlerts)

    if (!activeAlert && newPendingAlerts.length > 0) {
      setActiveAlert(newPendingAlerts[0])
    }
  }

  useEffect(() => {
    loadMonitoringData()

    const intervalId = window.setInterval(loadMonitoringData, 60000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [reloadKey])

  function dismissActiveAlert() {
    if (!activeAlert) return

    localStorage.setItem(getDismissKey(activeAlert), 'true')

    const remainingAlerts = pendingAlerts.filter(alert => alert.id !== activeAlert.id)

    setPendingAlerts(remainingAlerts)
    setActiveAlert(remainingAlerts[0] ?? null)
  }

  if (alerts.length === 0 && recurringExpenses.length === 0) return null

  return (
    <>
      <section className="budget-monitor-summary">
        {alerts.length > 0 && (
          <button className="monitor-summary-btn" onClick={() => setShowDetails(true)}>
            <span className={`summary-dot ${alerts.some(alert => alert.level === 'exceeded') ? 'exceeded' : ''}`}></span>
            <span>
              {alerts.length === 1
                ? '1 alerta de orçamento'
                : `${alerts.length} alertas de orçamento`}
            </span>
          </button>
        )}

        {recurringExpenses.length > 0 && (
          <button className="monitor-summary-btn" onClick={() => setShowDetails(true)}>
            <i className="fi fi-br-rotate-right"></i>
            <span>
              {recurringExpenses.length === 1
                ? '1 recorrência detectada'
                : `${recurringExpenses.length} recorrências detectadas`}
            </span>
          </button>
        )}
      </section>

      {activeAlert && (
        <div className="budget-modal-overlay" onClick={dismissActiveAlert}>
          <div className={`budget-alert-modal ${activeAlert.level}`} onClick={e => e.stopPropagation()}>
            <div className="budget-alert-icon">
              <i className="fi fi-br-bell-ring"></i>
            </div>

            <div className="budget-alert-content">
              <small>{levelLabel(activeAlert.level)}</small>
              <h3>{activeAlert.title}</h3>
              <p>{activeAlert.message}</p>

              <div className="monitor-progress-bar">
                <div
                  className="monitor-progress"
                  style={{ width: `${Math.min(activeAlert.percentage, 100)}%` }}
                ></div>
              </div>

              <div className="monitor-values">
                <span>{formatCurrency(activeAlert.spent)}</span>
                <span>{formatCurrency(activeAlert.limit)}</span>
              </div>

              <button className="primary-btn" onClick={dismissActiveAlert}>
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetails && (
        <div className="budget-modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="budget-details-modal" onClick={e => e.stopPropagation()}>
            <header className="budget-details-header">
              <h3>Monitoramento</h3>
              <button onClick={() => setShowDetails(false)}>
                <i className="fi fi-br-cross-small"></i>
              </button>
            </header>

            {alerts.length > 0 && (
              <section className="budget-details-section">
                <strong>Orçamento</strong>

                {alerts.map(alert => (
                  <article key={alert.id} className={`budget-details-item ${alert.level}`}>
                    <div>
                      <b>{alert.title}</b>
                      <p>{alert.message}</p>
                    </div>

                    <span>{Math.round(alert.percentage)}%</span>
                  </article>
                ))}
              </section>
            )}

            {recurringExpenses.length > 0 && (
              <section className="budget-details-section">
                <strong>Despesas recorrentes</strong>

                {recurringExpenses.map(expense => (
                  <article key={expense.id} className="budget-details-item recurring">
                    <div>
                      <b>{expense.name}</b>
                      <p>{expense.categoryName}</p>
                    </div>

                    <span>{expense.months.length} meses</span>
                  </article>
                ))}
              </section>
            )}
          </div>
        </div>
      )}
    </>
  )
}