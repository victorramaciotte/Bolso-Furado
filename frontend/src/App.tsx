import { useIsMobile } from './hooks/useIsMobile'
import './App.css'
import { useState } from 'react'
import FinanceView from './views/FinanceView'
import GoalsView from './views/GoalsView'
import FAB from './components/FAB'
import type { EntryData } from './features/Entries/ListEntries'

function App() {
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState('finance')
  const [openModal, setOpenModal] = useState(false)
  const [editingEntry, setEditingEntry] = useState<EntryData | null>(null)
  
  return (
    <>
      {isMobile ? (
        <section className='wrapper'>
        <main>
          {activeTab === 'finance' && <FinanceView 
                                          openModal={openModal}
                                          setOpenModal={setOpenModal}
                                          editingEntry={editingEntry}
                                          setEditingEntry={setEditingEntry}
                                          />}
          {activeTab === 'goals' && <GoalsView/>}
        </main>
        <nav className='menu'>
          <div>
            <button className={`nav ${activeTab === 'finance' ? 'active' : ''}`} onClick={() => setActiveTab('finance')}>Gestão</button>
            <button className={`nav ${activeTab === 'goals' ? 'active' : ''}`} onClick={() => setActiveTab('goals')}>Metas</button>
          </div>
          
          <FAB onClick={() => {
                setEditingEntry(null); 
                setOpenModal(true);
                }}></FAB>
        </nav>
        </section>
      ) : (

        <span>You're on desktop WOW!!</span>

      )}
    </>
    
    
  )
}

export default App