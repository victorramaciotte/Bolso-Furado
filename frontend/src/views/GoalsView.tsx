import { useState } from "react"
import ListGoals, { type GoalData } from "../features/Goals/ListGoals"
import ModalGoal from "../features/Goals/ModalGoal"
import './FinanceView.css'

  
  interface Props {
    openModal: boolean
    setOpenModal: (value: boolean) => void
    editingGoal: GoalData | null
    setEditingGoal: (value: GoalData | null) => void
  }
  
  function GoalsView({openModal, setOpenModal, editingGoal, setEditingGoal} : Props) {
    const [reload, setReload] = useState(0)
  
    function closeModal() {
    setOpenModal(false)
    setEditingGoal(null)
  }
  
    function closeAndReload() {
      closeModal()
      setReload(r => r + 1)
    }
  
    
    function openEditing(goal: GoalData) {
      setEditingGoal(goal)
      setOpenModal(true)
    }
  
    return (
      <div>
  
          <ListGoals key={reload} onEdit={openEditing}/>
  
          
          {openModal && (
            <ModalGoal
              onClose={closeModal}
              onSuccess={closeAndReload}
              goal={editingGoal ?? undefined} 
            />
          )}
  
        
  
       
      
      </div>
    )
}

export default GoalsView