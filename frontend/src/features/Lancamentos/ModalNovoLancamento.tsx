import { useState } from 'react'
import './ModalNovoLancamento.css'

interface Props {
  onClose: () => void
  onSucesso: () => void
}

export default function ModalNovoLancamento({ onClose, onSucesso }: Props) {
  const [form, setForm] = useState({
    nome: '',
    valor: '',
    tipo: '',
    data: '',
    origem: '',
    categoria: '',
    motivacao: '',
    status: '',
    recorrencia: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit() {
    await fetch(`${import.meta.env.VITE_API_URL}/lancamentos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        valor: parseFloat(form.valor),
      }),
    })
    onSucesso()
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="modal-titulo">Registrar Lançamento</h2>

        <label>Nome Lançamento:</label>
        <input name="nome" value={form.nome} onChange={handleChange} />

        <div className="modal-linha">
          <div className="modal-grupo">
            <label>Valor:</label>
            <input name="valor" type="number" value={form.valor} onChange={handleChange} />
          </div>
          <div className="modal-grupo">
            <label>Tipo:</label>
            <div className="modal-radio">
              <label>
                <input type="radio" name="tipo" value="entrada" onChange={handleChange} /> Receita
              </label>
              <label>
                <input type="radio" name="tipo" value="saida" onChange={handleChange} /> Despesa
              </label>
            </div>
          </div>
        </div>

        <div className="modal-linha">
          <div className="modal-grupo">
            <label>Data:</label>
            <input name="data" type="date" value={form.data} onChange={handleChange} />
          </div>
          <div className="modal-grupo">
            <label>Origem:</label>
            <select name="origem" value={form.origem} onChange={handleChange}>
              <option value="">Selecione</option>
              {['Salário','Freelance','Investimento','Presente','Outros'].map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="modal-linha">
          <div className="modal-grupo">
            <label>Categoria:</label>
            <select name="categoria" value={form.categoria} onChange={handleChange}>
              <option value="">Selecione</option>
              {['Alimentação','Transporte','Moradia'].map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className="modal-grupo">
            <label>Motivação:</label>
            <select name="motivacao" value={form.motivacao} onChange={handleChange}>
              <option value="">Selecione</option>
              {['Necessidade','Lazer','Investimento','Imprevisto','Desejo'].map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="modal-linha">
          <div className="modal-grupo">
            <label>Status:</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="">Selecione</option>
              {['Pago','Pendente','Agendado','Cancelado'].map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className="modal-grupo">
            <label>Recorrência:</label>
            <input name="recorrencia" type="date" value={form.recorrencia} onChange={handleChange} />
          </div>
        </div>

        <button className="modal-btn" onClick={handleSubmit}>Registrar Lançamento</button>
      </div>
    </div>
  )
}