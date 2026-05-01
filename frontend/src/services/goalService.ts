import api from "./api"
import { ENDPOINTS } from '../constants/endpoints'
import type { CreateGoalData } from "../features/Goals/ListGoals"


////////goals////////////////////////////////////////Q

export async function getGoals() {
    const response = await api.get(ENDPOINTS.goals)
    return response.data
}

export async function createGoal(data : CreateGoalData) {
    const response = await api.post(ENDPOINTS.goals, data)
    return response.data
}

export async function deleteGoal(id: number) {
    const response = await api.delete(`${ENDPOINTS.goals}/${id}`)
    return response.data
}

export async function updateGoal(id: number, data: CreateGoalData) {
    const response = await api.put(`${ENDPOINTS.goals}/${id}`, data)
    return response.data
}
