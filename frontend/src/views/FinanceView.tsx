import { useState } from 'react'
import ListEntries from '../features/Entries/ListEntries'
import ModalEntry from '../features/Entries/ModalEntry'
import type { EntryData } from '../features/Entries/ListEntries'
import './FinanceView.css'

function FinanceView() {
  const [openModal, setOpenModal] = useState(false)
  const [reload, setReload] = useState(0)
  const [editingEntry, setEditingEntry] = useState<EntryData | null>(null)

  function closeModal() {
  setOpenModal(false)
  setEditingEntry(null)
}

  function closeAndReload() {
    closeModal()
    setReload(r => r + 1)
  }

  
  function openEditing(lanc: EntryData) {
    setEditingEntry(lanc)
    setOpenModal(true)
  }

  return (
    <div>
      
        <div className='menu-container'>
            <button>Relatórios</button>
            <i
                className="fi fi-br-plus"
                onClick={() => {
                setEditingEntry(null); 
                setOpenModal(true);
                }}
                style={{ cursor: 'pointer' }}
            ></i>
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