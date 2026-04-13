import { useState } from 'react'
import './App.css'
import ListaLancamentos from './features/Lancamentos/ListaLancamento'
import ModalNovoLancamento from './features/Lancamentos/ModalNovoLancamento'
import type { LancamentoData } from './features/Lancamentos/ListaLancamento'

function App() {
  const [modalAberto, setModalAberto] = useState(false)
  const [recarregar, setRecarregar] = useState(0)
  const [lancamentoEditando, setLancamentoEditando] = useState<LancamentoData | null>(null)

  function fecharModal() {
  setModalAberto(false)
  setLancamentoEditando(null)
}

  function fecharERecarregar() {
    fecharModal()
    setRecarregar(r => r + 1)
  }

  // Função para abrir o modal de edição de forma limpa
  function abrirEdicao(lanc: LancamentoData) {
    setLancamentoEditando(lanc)
    setModalAberto(true)
  }

  return (
    <div className='app-container'>
      <div className='menu-container'>
        <i
          className="fi fi-br-plus"
          onClick={() => {
            setLancamentoEditando(null); // Garante que não há lixo de edição
            setModalAberto(true);
          }}
          style={{ cursor: 'pointer' }}
        ></i>
      </div>

      <ListaLancamentos key={recarregar} onEditar={abrirEdicao}/>

      {/* UM ÚNICO BLOCO PARA O MODAL */}
      {modalAberto && (
        <ModalNovoLancamento
          onClose={fecharModal}
          onSucesso={fecharERecarregar}
          lancamento={lancamentoEditando ?? undefined} // Se for null, vira undefined
        />
      )}
    </div>
  )
}

export default App