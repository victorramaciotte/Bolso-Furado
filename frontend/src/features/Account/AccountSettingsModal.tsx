import { useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import './AccountSettingsModal.css'

type CategoryOption = {
  id: number
  name: string
}

type CategoryLimit = {
  categoryId: number
  amount: string
}

interface Props {
  initialBalance: number
  budgetAmount: number
  categories: CategoryOption[]
  initialCategoryLimits?: CategoryLimit[]
  onClose: () => void
  onSave: (data: {
    initialBalance: number
    budgetAmount: number
    categoryLimits: { categoryId: number; amount: number }[]
  }) => void | Promise<void>
}

 function valueToInput(value: number) {
        return value > 0 ? String(value) : ''
    }

export default function AccountSettingsModal({
  initialBalance,
  budgetAmount,
  categories,
  initialCategoryLimits = [],
  onClose,
  onSave
}: Props) {
    const [balance, setBalance] = useState(valueToInput(initialBalance))
    const [budget, setBudget] = useState(valueToInput(budgetAmount))
    const [activeTab, setActiveTab] = useState<'balance' | 'budget' | 'categories'>('balance')
    const [categoryLimits, setCategoryLimits] = useState<CategoryLimit[]>([])

    useEffect(() => {
        setBalance(valueToInput(initialBalance))
        setBudget(valueToInput(budgetAmount))

        setCategoryLimits(
        categories.map(category => {
            const existing = initialCategoryLimits.find(limit => limit.categoryId === category.id)

            return {
            categoryId: category.id,
            amount: existing?.amount ?? ''
            }
        })
        )
    }, [categories, initialBalance, budgetAmount, initialCategoryLimits])

    function updateCategoryLimit(categoryId: number, amount: string) {
        setCategoryLimits(prev =>
        prev.map(limit =>
            limit.categoryId === categoryId ? { ...limit, amount } : limit
        )
        )
    }

   

    async function save() {
        await onSave({
        initialBalance: Number(balance || 0),
        budgetAmount: Number(budget || 0),
        categoryLimits: categoryLimits
            .filter(limit => Number(limit.amount || 0) > 0)
            .map(limit => ({
            categoryId: limit.categoryId,
            amount: Number(limit.amount)
            }))
        })
    }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="account-settings-modal" onClick={e => e.stopPropagation()}>
        <header className="account-settings-header">
          <h2>Conta</h2>
          <button type="button" onClick={onClose}>
            <i className="fi fi-br-cross-small"></i>
          </button>
        </header>

        <div className="account-settings-tabs">
          <button
            type="button"
            className={activeTab === 'balance' ? 'active' : ''}
            onClick={() => setActiveTab('balance')}
          >
            Saldo
          </button>

          <button
            type="button"
            className={activeTab === 'budget' ? 'active' : ''}
            onClick={() => setActiveTab('budget')}
          >
            Orçamento
          </button>

          <button
            type="button"
            className={activeTab === 'categories' ? 'active' : ''}
            onClick={() => setActiveTab('categories')}
          >
            Categorias
          </button>
        </div>

        {activeTab === 'balance' && (
          <section className="account-settings-section">
            <label>
              Saldo inicial
              <NumericFormat
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                decimalScale={2}
                fixedDecimalScale
                placeholder="R$ 0,00"
                value={balance}
                onValueChange={(values) => setBalance(values.value)}
              />
            </label>
          </section>
        )}

        {activeTab === 'budget' && (
          <section className="account-settings-section">
            <label>
              Orçamento geral do mês
              <NumericFormat
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                decimalScale={2}
                fixedDecimalScale
                placeholder="R$ 0,00"
                value={budget}
                onValueChange={(values) => setBudget(values.value)}
              />
            </label>
          </section>
        )}

        {activeTab === 'categories' && (
          <section className="account-settings-section">
            <div className="category-limits-header">
              <span>Limites por categoria</span>
              <small>Opcional</small>
            </div>

            <div className="category-limits-list">
              {categories.length === 0 ? (
                <p className="empty-category-limits">Nenhuma categoria encontrada.</p>
              ) : (
                categories.map(category => {
                  const limit = categoryLimits.find(item => item.categoryId === category.id)

                  return (
                    <label key={category.id} className="category-limit-row">
                      <span>{category.name}</span>

                      <NumericFormat
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="R$ "
                        decimalScale={2}
                        fixedDecimalScale
                        placeholder="R$ 0,00"
                        value={limit?.amount ?? ''}
                        onValueChange={(values) =>
                          updateCategoryLimit(category.id, values.value)
                        }
                      />
                    </label>
                  )
                })
              )}
            </div>
          </section>
        )}

        <div className="account-settings-actions">
          <button className="muted-btn" type="button" onClick={onClose}>
            Cancelar
          </button>
          <button className="primary-btn" type="button" onClick={save}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}