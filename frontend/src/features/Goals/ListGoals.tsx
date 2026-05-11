import { useEffect, useState } from "react"
import { getGoals } from "../../services/goalService"
import Goal from "./Goal"
import './ListGoals.css'

export interface GoalData {
  id: number
  name: string
  target_amount: number
  current_amount?: number
  initial_amount?: number
  deadline?: Date
}
export type CreateGoalData = Omit <GoalData, 'id'>

interface Props {
  onEdit: (goal: GoalData) => void
}


function ListGoals({ onEdit }: Props) {
  const [goals, setGoals] = useState<GoalData[]>([])
  const [loading, setLoading] = useState(true)
  const [toggle, setToggle] = useState<number | null>(null)

  useEffect(() => {
    getGoals()
      .then(data => {
        setGoals(data)
        setLoading(false)
      })
  }, [])

  if (loading) return <p className="loading-list">Carregando...</p>

  return (
    <>
        {goals.length > 0 ? (
            <ul className="list-goals">
                {goals.map(goal => (
                <Goal
                    key={goal.id}
                    name={goal.name}
                    current_amount={goal.current_amount}
                    initial_amount={goal.initial_amount}
                    target_amount={goal.target_amount}
                    deadline={goal.deadline}
                    toggle={toggle === goal.id}
                    onEdit={() => onEdit(goal)}
                    onToggle={() => setToggle(prev => prev === goal.id ? null : goal.id)}
                />
                ))}
            </ul>
        ) : (
            <div className="empty-list">
            <p>Nenhuma meta encontrada. Crie uma nova!</p>
            </div>
        )}
    </>
    
  )
}
export default ListGoals