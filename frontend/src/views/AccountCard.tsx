import { useEffect, useState } from 'react'
import './AccountCard.css'
import AccountSettingsModal from '../features/Account/AccountSettingsModal'
import { getCategories } from '../services/financeService'
import { getAccountSummary, updateAccountSettings, type AccountSummary } from '../services/accountService'

type CategoryOption = {
  id: number
  name: string
}

interface Props {
  user: {
    id: number
    name: string
    email: string
  }
  onLogout: () => void
}

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

export default function AccountCard({ user, onLogout }: Props) {
  const [showMenu, setShowMenu] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [summary, setSummary] = useState<AccountSummary>({
    initialBalance: 0,
    availableBalance: 0,
    budgetAmount: 0,
    categoryLimits: []
  })

  async function loadAccountData() {
    const [categoriesData, summaryData] = await Promise.all([
      getCategories(),
      getAccountSummary()
    ])

    setCategories(categoriesData)
    setSummary(summaryData)
  }

  useEffect(() => {
    loadAccountData()
  }, [])

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

      <div className='card'>
        <span className='label'>Saldo</span>
        <span className='balance'>
            <p className='currency'>R$</p>
            <p>
                {summary.availableBalance.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
                })}
            </p>
        </span>

        <button onClick={() => setShowSettings(true)}>
          <i className="fi fi-br-pencil"></i>
        </button>

        <span className='budget'>
          Orçamento: {formatCurrency(summary.budgetAmount)}
        </span>
      </div>

      {showConfirm && (
        <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="confirm-modal-box" onClick={e => e.stopPropagation()}>
            <p>Deseja sair?</p>
            <button className='red-btn' onClick={onLogout}>Confirmar</button>
            <button className='muted-btn' onClick={() => setShowConfirm(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {showSettings && (
        <AccountSettingsModal
          initialBalance={summary.initialBalance}
          budgetAmount={summary.budgetAmount}
          categories={categories}
          initialCategoryLimits={summary.categoryLimits.map(limit => ({
            categoryId: limit.categoryId,
            amount: String(limit.amount)
          }))}
          onClose={() => setShowSettings(false)}
          onSave={async (data) => {
            await updateAccountSettings(data)
            await loadAccountData()
            setShowSettings(false)
          }}
        />
      )}
    </div>
  )
}