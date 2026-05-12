import { useState } from 'react'
import './AccountCard.css'

interface Props {
    user: {
        id: number
        name: string
        email: string
    }
    onLogout: () => void
}
export default function AccountCard({ user, onLogout }: Props) {
    const [showMenu, setShowMenu] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div className='card-wrapper'>
        <span className='header-line'>
           <span className='profile-header' onClick={() => setShowMenu(!showMenu)}>
                <i className="fi fi-br-user"></i>
                {user.name}

                {showMenu && (
                <div className="dropdown">
                <button onClick={() => setShowConfirm(true)}>Sair</button>
                </div>
            )}
            </span>
           <span className='triangle'></span> 
        </span>
        <div className='card'></div>

        {showConfirm && (
        <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
            <div className="confirm-modal-box" onClick={e => e.stopPropagation()}>
                <p>Deseja sair?</p>
                <button className='red-btn' onClick={onLogout}>Confirmar</button>
                <button className='muted-btn' onClick={() => setShowConfirm(false)}>Cancelar</button>
            </div>
        </div>
        )}
    </div>
  )
}
