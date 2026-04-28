import { useState } from 'react'
import ListEntries from '../features/Entries/ListEntries'
import ModalEntry from '../features/Entries/ModalEntry'
import type { EntryData } from '../features/Entries/ListEntries'
import './FinanceView.css'

interface Props {
  openModal: boolean
  setOpenModal: (value: boolean) => void
  editingEntry: EntryData | null
  setEditingEntry: (value: EntryData | null) => void
}

function FinanceView({openModal, setOpenModal, editingEntry, setEditingEntry} : Props) {
  const [reload, setReload] = useState(0)

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
      
        <div className='menu-container'>
            <button>Relatórios</button>
        </div>

        <ListEntries key={reload} onEdit={openEditing}/>

        
        {openModal && (
          <ModalEntry
            onClose={closeModal}
            onSuccess={closeAndReload}
            entry={editingEntry ?? undefined} 
          />
        )}

      

     
    
    </div>
  )
}

export default FinanceView