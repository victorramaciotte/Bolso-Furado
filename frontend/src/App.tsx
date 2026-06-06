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
import ReportsView from './features/Reports/ReportsView'

function App() {
  const isMobile = useIsMobile()
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') ?? '{}'))
  const [activeTab, setActiveTab] = useState<'finance' | 'goals' | 'reports'>('finance')
  const [openModal, setOpenModal] = useState(false)
  const [openGoalModal, setOpenGoalModal] = useState(false)
  const [editingEntry, setEditingEntry] = useState<EntryData | null>(null)
  const [editingGoal, setEditingGoal] = useState<GoalData | null>(null)

  if (!token) {
    return <AuthView onLogin={(t, u) => { 
      localStorage.setItem('token', t); 
      localStorage.setItem('user', JSON.stringify(u))
      setToken(t) 
      setUser(u)
    }} />
      
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser({})
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
                                          user={user}
                                          onLogout={handleLogout}
                                          onOpenReports={() => setActiveTab('reports')}
                                          />}
          {activeTab === 'goals' && <GoalsView 
                                          openModal={openGoalModal}
                                          setOpenModal={setOpenGoalModal}
                                          editingGoal={editingGoal}
                                          setEditingGoal={setEditingGoal}
                                          />}
          {activeTab === 'reports' && <ReportsView />}
        </main>
        <nav className='menu'>
          <div>
            <button className={`nav ${activeTab === 'finance' ? 'active' : ''}`} onClick={() => setActiveTab('finance')}>
              <i className="fi fi-sr-hand-holding-usd"></i>
              <span>Gestão</span>
            </button>
            <button className={`nav ${activeTab === 'goals' ? 'active' : ''}`} onClick={() => setActiveTab('goals')}>
              <i className="fi fi-sr-piggy-bank"></i>
              <span>Metas</span>
            </button>
          </div>
          
          {activeTab !== 'reports' && (
            <FAB onClick={() => {
              if (activeTab === 'finance') {
                setEditingEntry(null)
                setOpenModal(true)
              } else if (activeTab === 'goals') {
                setOpenGoalModal(true)
                setEditingGoal(null)
              }
            }} />
          )}
        </nav>
        </section>
      ) : (

        <>
        <Dashboard user={user} onLogout={handleLogout}></Dashboard>
        </>

      )}
    </>
    
    
  )
}

export default App