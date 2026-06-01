import { useState } from 'react'
import './EntryFilters.css'

interface EntryFiltersProps {
  filters: EntryFilterState
  onChange: (filters: EntryFilterState) => void
  onApply: () => void
  onClose: () => void
  categories: CategoryOption[]
}

export type EntryFilterState = {
  month: number | 'all'
  year: number | 'all'
  categoryId: number | 'all'
}

export type CategoryOption  = {
  id: number
  name: string
}

export default function EntryFilters({ filters, onChange, onApply, onClose, categories }: EntryFiltersProps) {

    const months = [
        { value: 0, label: 'Janeiro' },
        { value: 1, label: 'Fevereiro' },
        { value: 2, label: 'Março' },
        { value: 3, label: 'Abril' },
        { value: 4, label: 'Maio' },
        { value: 5, label: 'Junho' },
        { value: 6, label: 'Julho' },
        { value: 7, label: 'Agosto' },
        { value: 8, label: 'Setembro' },
        { value: 9, label: 'Outubro' },
        { value: 10, label: 'Novembro' },
        { value: 11, label: 'Dezembro' }
    ]

    const [openCategory, setOpenCategory] = useState(false)
    const [openMonth, setOpenMonth] = useState(false)
    
    const [openYear, setOpenYear] = useState(false)

    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 15 }, (_, index) => currentYear - index)

    const selectedMonthLabel =
        filters.month === 'all'
            ? 'Todos os meses'
            : months.find(month => month.value === filters.month)?.label ?? 'Mês'
    
    const selectedYearLabel =
        filters.year === 'all' ? 'Todos os anos' : String(filters.year)

    const selectedCategoryLabel =
        filters.categoryId === 'all'
        ? 'Todas as categorias'
        : categories.find(category => category.id === filters.categoryId)?.name ?? 'Categoria'

    return (
        <div className="entry-filters" onClick={(e) => e.stopPropagation()}>
        <div className="filter-group">
            <span>Mês</span>

            <div className="custom-select">
                <button type="button" onClick={() => setOpenMonth(prev => !prev)}>
                {selectedMonthLabel}
                <i className="fi fi-br-angle-small-down"></i>
                </button>

                {openMonth && (
                <div className="custom-select-menu">
                    <button
                    type="button"
                    onClick={() => {
                        onChange({ ...filters, month: 'all' })
                        setOpenMonth(false)
                    }}
                    >
                    Todos os meses
                    </button>

                    {months.map(month => (
                    <button
                        key={month.value}
                        type="button"
                        onClick={() => {
                        onChange({ ...filters, month: month.value })
                        setOpenMonth(false)
                        }}
                    >
                        {month.label}
                    </button>
                    ))}
                </div>
                )}
            </div>
        </div>

        <div className="filter-group">
            <span>Ano</span>

            <div className="custom-select">
                <button type="button" onClick={() => setOpenYear(prev => !prev)}>
                {selectedYearLabel}
                <i className="fi fi-br-angle-small-down"></i>
                </button>

                {openYear && (
                <div className="custom-select-menu">
                    <button
                    type="button"
                    onClick={() => {
                        onChange({ ...filters, year: 'all' })
                        setOpenYear(false)
                    }}
                    >
                    Todos os anos
                    </button>

                    {years.map(year => (
                    <button
                        key={year}
                        type="button"
                        onClick={() => {
                        onChange({ ...filters, year })
                        setOpenYear(false)
                        }}
                    >
                        {year}
                    </button>
                    ))}
                </div>
                )}
            </div>
        </div>

            <div className="filter-group">
                <span>Categoria</span>

                <div className="custom-select">
                    <button type="button" onClick={() => setOpenCategory(prev => !prev)}>
                        {selectedCategoryLabel}
                        <i className="fi fi-br-angle-small-down"></i>
                    </button>

                    {openCategory && (
                        <div className="custom-select-menu">
                        <button
                            type="button"
                            onClick={() => {
                            onChange({ ...filters, categoryId: 'all' })
                            setOpenCategory(false)
                            }}
                        >
                            Todas
                        </button>

                        {categories.map(category => (
                            <button
                            key={category.id}
                            onClick={() => {
                                onChange({ ...filters, categoryId: category.id })
                                setOpenCategory(false)
                            }}
                            >
                            {category.name}
                            </button>
                        ))}
                        </div>
                    )}
                </div>
            </div>
            
            
            <div className='action filter'>
                <button className='modal-btn btn-muted' onClick={onClose}>Cancelar</button>
                <button className='modal-btn btn-save' onClick={onApply}>Aplicar</button>
            </div>
            
        </div>
    )
}
 