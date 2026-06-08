import { useState } from 'react'
import ListEntries, { type EntryData } from '../features/Entries/ListEntries'
import ModalEntry from '../features/Entries/ModalEntry'
import './Dashboard.css'
import GoalsView from './GoalsView'
import type { GoalData } from '../features/Goals/ListGoals'
import AccountCard from './AccountCard'
import ReportsView from '../features/Reports/ReportsView'
import BudgetMonitor from '../features/Monitoring/BudgetMonitor'

interface Props {
  user: {
    id: number
    name: string
    email: string
  }
  onLogout: () => void
}

export default function Dashboard({ user, onLogout }: Props) {
  const [openModal, setOpenModal] = useState(false)
  const [editingEntry, setEditingEntry] = useState<EntryData | null>(null)
  const [reload, setReload] = useState(0)
  const [openGoalModal, setOpenGoalModal] = useState(false)
  const [editingGoal, setEditingGoal] = useState<GoalData | null>(null)

  function openEditing(entry: EntryData) {
    setEditingEntry(entry)
    setOpenModal(true)
  }

  function closeEntryModal() {
    setOpenModal(false)
    setEditingEntry(null)
  }

  function closeEntryModalAndReload() {
    closeEntryModal()
    setReload(r => r + 1)
  }

  function openNewEntry() {
    setEditingEntry(null)
    setOpenModal(true)
  }

  function openNewGoal() {
    setEditingGoal(null)
    setOpenGoalModal(true)
  }

  return (
    <div className="dashboard">
      <div className="account-card">
        <AccountCard user={user} onLogout={onLogout} />
      </div>

      <div className="monitoring-strip">
        <BudgetMonitor reloadKey={reload} />
      </div>

      <div className="entries dashboard-panel">
        <div className="div-header">
          <span>Lançamentos</span>

          <button onClick={openNewEntry}>
            <i className="fi fi-br-plus"></i>
            Novo Lançamento
          </button>
        </div>

        <div className="list-wrapper">
          <ListEntries key={reload} onEdit={openEditing} />
        </div>
      </div>

      <div className="goals dashboard-panel">
        <div className="div-header">
          <span>Metas</span>

          <button onClick={openNewGoal}>
            <i className="fi fi-br-plus"></i>
            Nova Meta
          </button>
        </div>

        <GoalsView
          openModal={openGoalModal}
          setOpenModal={setOpenGoalModal}
          editingGoal={editingGoal}
          setEditingGoal={setEditingGoal}
        />
      </div>

      <div className="calendar"></div>

      <div className="analytics dashboard-panel">
        <div className="dashboard-panel-content reports-panel">
          <ReportsView />
        </div>
      </div>

      {openModal && (
        <ModalEntry
          onClose={closeEntryModal}
          onSuccess={closeEntryModalAndReload}
          entry={editingEntry ?? undefined}
        />
      )}
    </div>
  )
}