import { useIsMobile } from './hooks/useIsMobile'
import './App.css'
import { useState } from 'react'
import FinanceView from './views/FinanceView'
import GoalsView from './views/GoalsView'
import Dashboard from './views/Dashboard'
import FAB from './components/FAB'
import type { EntryData } from './features/Entries/ListEntries'
import type { GoalData } from './features/Goals/ListGoals'
import AuthView from './views/AuthView'

function App() {
  const isMobile = useIsMobile()
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [activeTab, setActiveTab] = useState('finance')
  const [openModal, setOpenModal] = useState(false)
  const [openGoalModal, setOpenGoalModal] = useState(false)
  const [editingEntry, setEditingEntry] = useState<EntryData | null>(null)
  const [editingGoal, setEditingGoal] = useState<GoalData | null>(null)

  if (!token) {
    return <AuthView onLogin={(t) => { localStorage.setItem('token', t); setToken(t) }} />
  }
  
  
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
          {activeTab === 'goals' && <GoalsView 
                                          openModal={openGoalModal}
                                          setOpenModal={setOpenGoalModal}
                                          editingGoal={editingGoal}
                                          setEditingGoal={setEditingGoal}
                                          />}
        </main>
        <nav className='menu'>
          <div>
            <button className={`nav ${activeTab === 'finance' ? 'active' : ''}`} onClick={() => setActiveTab('finance')}>Gestão</button>
            <button className={`nav ${activeTab === 'goals' ? 'active' : ''}`} onClick={() => setActiveTab('goals')}>Metas</button>
          </div>
          
          <FAB onClick={() => {
                if (activeTab === 'finance') {
                  setEditingEntry(null)
                  setOpenModal(true)
                } else if (activeTab === 'goals') {
                  setOpenGoalModal(true) 
                  setEditingGoal(null)
                }
                }}></FAB>
        </nav>
        </section>
      ) : (

        <>
        <Dashboard></Dashboard>
        </>

      )}
    </>
    
    
  )
}

export default App