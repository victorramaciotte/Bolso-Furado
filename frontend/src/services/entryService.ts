import api from "../services/api"
import { ENDPOINTS } from '../constants/endpoints'
import type { EntryData, CreateEntryData } from "../features/Entries/ListEntries"

export async function getEntries() {
    const response = await api.get(ENDPOINTS.entries)
    return response.data
}

export async function createEntry(data : CreateEntryData) {
    const response = await api.post(ENDPOINTS.entries, data)
    return response.data
}

export async function deleteEntry(id: number) {
    const response = await api.delete(`${ENDPOINTS.entries}/${id}`)
    return response.data
}

export async function updateEntry(id: number, data: CreateEntryData) {
    const response = await api.put(`${ENDPOINTS.entries}/${id}`, data)
    return response.data
}