import { useState } from 'react'
import './App.css'
import ListaLancamentos from './features/Lancamentos/ListaLancamento'
import ModalNovoLancamento from './features/Lancamentos/ModalNovoLancamento'

function App() {
  const [modalAberto, setModalAberto] = useState(false)
  const [recarregar, setRecarregar] = useState(0)

  return (
    <div className='app-container'>
      <div className='menu-container'>
        <i
          className="fi fi-br-plus"
          onClick={() => setModalAberto(true)}
          style={{ cursor: 'pointer' }}
        ></i>
      </div>

      <ListaLancamentos key={recarregar} />

      {modalAberto && (
        <ModalNovoLancamento
          onClose={() => setModalAberto(false)}
          onSucesso={() => setRecarregar(r => r + 1)}
        />
      )}
    </div>
  )
}

export default App