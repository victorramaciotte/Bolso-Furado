import { useEffect, useState } from 'react'
import ListEntries from '../features/Entries/ListEntries'
import ModalEntry from '../features/Entries/ModalEntry'
import AccountCard from './AccountCard'
import type { EntryData } from '../features/Entries/ListEntries'
import './FinanceView.css'
import EntryFilters from '../features/Entries/EntryFilters'
import type { EntryFilterState, CategoryOption  } from '../features/Entries/EntryFilters'
import { getCategories } from '../services/financeService'

interface Props {
  openModal: boolean
  setOpenModal: (value: boolean) => void
  editingEntry: EntryData | null
  onLogout: () => void
  setEditingEntry: (value: EntryData | null) => void
  user: {
    id: number
    name: string
    email: string
  }
}

function FinanceView({openModal, setOpenModal, editingEntry, setEditingEntry, user, onLogout} : Props) {
  const [reload, setReload] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [filters, setFilters] = useState<EntryFilterState>({
  month: 'all',
  year: 'all',
  categoryId: 'all'
})
  const [draftFilters, setDraftFilters] = useState(filters)

  function applyFilters() {
    setFilters(draftFilters)
    setShowFilters(false)
  }

useEffect(() => {
  getCategories().then(setCategories)
}, [])

  function closeModal() {
  setOpenModal(false)
  setEditingEntry(null)
}

  function closeAndReload() {
    closeModal()
    setReload(r => r + 1)
  }

  
  function openEditing(entry: EntryData) {
    setEditingEntry(entry)
    setOpenModal(true)
  }

  return (
    <div>
        <AccountCard user={user} onLogout={onLogout}/>
        <div className='menu-container'>
            <button>
              <i className="fi fi-br-chart-simple"></i>
              Relatórios
              </button>
            <button>
              <i className="fi fi-br-calendar"></i>
            </button>
            <button onClick={() => setShowFilters(prev => !prev)}>
              <i className="fi fi-br-settings-sliders"></i>
            </button>
        </div>

        <ListEntries key={reload} onEdit={openEditing} filters={filters}/>

        
        {openModal && (
            <ModalEntry
            onClose={closeModal}
            onSuccess={closeAndReload}
            entry={editingEntry ?? undefined} 
            />
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

      

     
    
    </div>
  )
}

export default FinanceView