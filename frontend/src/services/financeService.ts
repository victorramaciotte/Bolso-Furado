import api from "./api"
import { ENDPOINTS } from '../constants/endpoints'
import type { CreateEntryData } from "../features/Entries/ListEntries"


////////ENTRIES////////////////////////////////////////Q

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

/////////////////CATEGORIES////////////////////////////////////////////////////////////////

export async function getCategories() {
    const response = await api.get(ENDPOINTS.categories)
    return response.data
}

export async function createCategory(name: String) {
    const response = await api.post(ENDPOINTS.categories, {name})
    return response.data
}

export async function deleteCategory(id: number) {
    const response = await api.delete(`${ENDPOINTS.categories}/${id}`)
    return response.data
}

export async function updateCategory(id: number, name: String) {
    const response = await api.put(`${ENDPOINTS.categories}/${id}`, {name})
    return response.data
}