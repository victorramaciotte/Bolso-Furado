import { useIsMobile } from './hooks/useIsMobile'
import './App.css'
import { useState } from 'react'
import FinanceView from './views/FinanceView'
import GoalsView from './views/GoalsView'

function App() {
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState('finance')
  
  return (
    <>
      {isMobile ? (
        <section className='wrapper'>
        <main>
          {activeTab === 'finance' && <FinanceView/>}
          {activeTab === 'goals' && <GoalsView/>}
        </main>
        <nav className='menu'>
          <button className={activeTab === 'finance' ? 'active' : ''} onClick={() => setActiveTab('finance')}>Gestão</button>
          <button className={activeTab === 'goals' ? 'active' : ''} onClick={() => setActiveTab('goals')}>Metas</button>
        </nav>
        </section>
      ) : (

        <span>You're on desktop WOW!!</span>

      )}
    </>
    
    
  )
}

export default App