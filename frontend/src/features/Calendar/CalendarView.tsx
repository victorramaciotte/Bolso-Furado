import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { getEntries } from '../../services/financeService'
import type { EntryData } from '../Entries/ListEntries'
import { detectRecurringExpenses } from '../Monitoring/budgetMonitoring'
import './CalendarView.css'

interface Props {
  compact?: boolean
  onBack?: () => void 
  onOpenEntryModal?: () => void
  reloadKey?: number
}

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]
const MONTHS_SHORT = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

const THIS_YEAR = new Date().getFullYear()
const YEAR_RANGE = Array.from({ length: 11 }, (_, i) => THIS_YEAR - 5 + i)

export default function CalendarView({ compact = false, onBack, onOpenEntryModal, reloadKey = 0 }: Props) {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear]   = useState(today.getFullYear())
  const [entries, setEntries]           = useState<EntryData[]>([])
  const [recurringIds, setRecurringIds] = useState<Set<number>>(new Set())
  const [selectedDay, setSelectedDay]   = useState<number | null>(null)
  const [loading, setLoading]           = useState(true)
  const [showPicker, setShowPicker]     = useState(false)
  const [pickerMode, setPickerMode]     = useState<'month' | 'year'>('month')

  useEffect(() => {
  getEntries().then(data => {
    setEntries(data)

    const recurring = detectRecurringExpenses(data)
    const ids = new Set<number>()

    data.forEach((entry: EntryData) => {
      if (entry.type === 'expense') {
        const norm = entry.name
          .toLowerCase().normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^\w\s]/g, ' ')
          .replace(/\b(assinatura|pagamento|mensalidade|conta|fatura)\b/g, '')
          .replace(/\s+/g, ' ')
          .trim()

        if (recurring.some(r => r.id === `${norm}-${entry.category_id}`)) {
          ids.add(entry.id)
        }
      }
    })

    setRecurringIds(ids)
    setLoading(false)
  })
}, [reloadKey])

  function getDaysInMonth(m: number, y: number) { return new Date(y, m + 1, 0).getDate() }

  function getFirstDayOfMonth(m: number, y: number) {
    return new Date(y, m, 1).getDay() // 0=Sun
  }

  function getEntriesForDay(day: number) {
    return entries.filter(e => {
      const d = new Date(e.date)
      return d.getDate() === day && d.getMonth() === currentMonth && d.getFullYear() === currentYear
    })
  }

  function prevMonth() {
    setSelectedDay(null)
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
    else setCurrentMonth(m => m - 1)
  }

  function nextMonth() {
    setSelectedDay(null)
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
    else setCurrentMonth(m => m + 1)
  }

  const daysInMonth = getDaysInMonth(currentMonth, currentYear)
  const firstDay    = getFirstDayOfMonth(currentMonth, currentYear)

  // Only render cells actually needed: leading empties + days of month
  // but keep rows complete (pad last row to multiple of 7)
  const usedCells = firstDay + daysInMonth
  const totalCells = Math.ceil(usedCells / 7) * 7

  const isToday = (day: number) =>
    day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()

  const selectedEntries = selectedDay !== null ? getEntriesForDay(selectedDay) : []

  if (loading) return <p className="cal-loading">Carregando...</p>

  return (
    <div className='cal-wrapper'>
        {onBack && (
            <div className='top'>
                <button className="cal-back-btn" onClick={onBack}>
                <i className="fi fi-br-angle-left"></i>
                </button>
            </div>
        )}
        
        <div className={`cal-root ${compact ? 'cal-compact' : ''}`}>

        {/* Header: título + botão filtro */}
        <div className="cal-header">
            <button className="cal-filter-btn" onClick={() => { setShowPicker(p => !p); setPickerMode('month') }}>
                <span className="cal-title">{MONTHS[currentMonth]}</span>
                <span className="cal-title">{currentYear}</span>
                <i className="fi fi-br-caret-down"></i>
            </button>
        </div>

        {/* Picker de mês/ano */}
        {showPicker && (
            <div className="cal-picker">
            <div className="cal-picker-tabs">
                <button className={pickerMode === 'month' ? 'active' : ''} onClick={() => setPickerMode('month')}>Mês</button>
                <button className={pickerMode === 'year'  ? 'active' : ''} onClick={() => setPickerMode('year')}>Ano</button>
            </div>
            {pickerMode === 'month' ? (
                <div className="cal-picker-grid">
                {MONTHS_SHORT.map((m, i) => (
                    <button key={i}
                    className={`cal-picker-item ${i === currentMonth ? 'active' : ''}`}
                    onClick={() => { setCurrentMonth(i); setSelectedDay(null); setShowPicker(false) }}
                    >{m}</button>
                ))}
                </div>
            ) : (
                <div className="cal-picker-grid">
                {YEAR_RANGE.map(y => (
                    <button key={y}
                    className={`cal-picker-item ${y === currentYear ? 'active' : ''}`}
                    onClick={() => { setCurrentYear(y); setSelectedDay(null); setShowPicker(false); setPickerMode('month') }}
                    >{y}</button>
                ))}
                </div>
            )}
            </div>
        )}

        {/* Labels dos dias da semana */}
        <div className="cal-weekdays">
            {WEEKDAYS.map((d, i) => <div key={i} className="cal-weekday">{d}</div>)}
        </div>

        {/* Grid — apenas dias do mês + células vazias do início */}
        <div className="cal-grid">
            {Array.from({ length: totalCells }).map((_, i) => {
            const day = i - firstDay + 1
            const inMonth = day >= 1 && day <= daysInMonth

            if (!inMonth) {
                return <div key={i} className="cal-cell cal-empty" />
            }

            const dayEntries  = getEntriesForDay(day)
            const hasIncome    = dayEntries.some(e => e.type === 'income')
            const hasExpense   = dayEntries.some(e => e.type === 'expense' && !recurringIds.has(e.id))
            const hasRecurring = dayEntries.some(e => recurringIds.has(e.id))
            const isSelected   = selectedDay === day
            const isTodayDay   = isToday(day)

            return (
                <div
                key={i}
                className={`cal-cell cal-in-month ${isTodayDay ? 'cal-today' : ''} ${isSelected ? 'cal-selected' : ''}`}
                onClick={() => setSelectedDay(prev => prev === day ? null : day)}
                >
                <span className="cal-day-num">{day}</span>
                <div className="cal-dots">
                    {hasIncome    && <span className="cal-dot dot-income" />}
                    {hasExpense   && <span className="cal-dot dot-expense" />}
                    {hasRecurring && <span className="cal-dot dot-recurring" />}
                </div>
                </div>
            )
            })}
        </div>

        {/* Setas de navegação embaixo */}
        <div className="cal-nav-bar">
            <button className="cal-nav" onClick={prevMonth}>
            <i className="fi fi-br-angle-left"></i>
            </button>
            <button className="cal-nav" onClick={nextMonth}>
            <i className="fi fi-br-angle-right"></i>
            </button>
        </div>

        {/* Popup de detalhes */}
        {selectedDay !== null && createPortal(
            <div className="cal-popup-overlay" onClick={() => setSelectedDay(null)}>
            <div className="cal-popup" onClick={e => e.stopPropagation()}>
                <div className="cal-popup-header">
                <span>{selectedDay} de {MONTHS[currentMonth]}</span>
                <button onClick={() => setSelectedDay(null)}>
                    <i className="fi fi-br-cross-small"></i>
                </button>
                </div>
                {selectedEntries.length === 0 ? (
                <p className="cal-popup-empty">Nenhuma transação neste dia.</p>
                ) : (
                <ul className="cal-popup-list">
                    {selectedEntries.map(entry => (
                    <li key={entry.id}
                        className={`cal-popup-item ${
                        entry.type === 'income' ? 'item-income'
                        : recurringIds.has(entry.id) ? 'item-recurring'
                        : 'item-expense'
                        }`}
                    >
                        <div className="cal-popup-left">
                        <span className="cal-popup-name">{entry.name}</span>
                        <span className="cal-popup-cat">{entry.category?.name ?? 'Sem categoria'}</span>
                        </div>
                        <span className="cal-popup-value">
                        {entry.type === 'income' ? '+' : '−'}
                        {entry.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                    </li>
                    ))}
                </ul>
                )}
            </div>
            </div>,
            document.body
        )}
        </div>
    </div>
  )
}