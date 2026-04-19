import { useState } from 'react'
import './App.css'
import ListEntries from './features/Entries/ListEntries'
import ModalEntry from './features/Entries/ModalEntry'
import type { EntryData } from './features/Entries/ListEntries'

function App() {
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
      <main className='app-container'>
        <div className='menu-container'>
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

        {/* UM ÚNICO BLOCO PARA O MODAL */}
        {openModal && (
          <ModalEntry
            onClose={closeModal}
            onSuccess={closeAndReload}
            entry={editingEntry ?? undefined} 
          />
        )}

      

      </main>
      
      <nav className='tabs'>
          
      </nav>
    </div>
  )
}

export default App