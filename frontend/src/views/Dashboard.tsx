import { useState } from "react"
import ListEntries, { type EntryData } from "../features/Entries/ListEntries"
import ModalEntry from "../features/Entries/ModalEntry"
import './Dashboard.css'
import GoalsView, { type Props} from "./GoalsView"
import type { GoalData } from "../features/Goals/ListGoals"



export default function Dashboard() {
    const [openModal, setOpenModal] = useState(false)
    const [editingEntry, setEditingEntry] = useState<EntryData | null>(null)
    const [reload, setReload] = useState(0)
    const [openGoalModal, setOpenGoalModal] = useState(false)
    const [editingGoal, setEditingGoal] = useState<GoalData | null>(null)

    function openEditing(entry: EntryData) {
        setEditingEntry(entry)
        setOpenModal(true)
    }

  return (
    <div className='dashboard'>
          <div className='account-card'></div>
          <div className='entries'>
            <div className="div-header">
                <span>Lançamentos</span>
                <button>
                    <i className="fi fi-br-plus"></i>
                    Novo Lançamento
                </button>
            </div>
            <ListEntries key={reload} onEdit={openEditing}/>
          </div>
          <div className='goals'>
            <div className="div-header">
                <span>Metas</span>
                <button>
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
          <div className='calendar'></div>
          <div className='analytics'></div>
          {openModal && (
                    <ModalEntry
                        onClose={() => setOpenModal(false)}
                        onSuccess={() => { setOpenModal(false); setReload(r => r + 1) }}
                        entry={editingEntry ?? undefined}
                        />
          )}
    </div>
  )
}
