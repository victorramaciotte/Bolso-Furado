import api from './api'

export type AccountCategoryLimit = {
  categoryId: number
  categoryName: string
  amount: number
}

export type AccountSummary = {
  initialBalance: number
  availableBalance: number
  budgetAmount: number
  categoryLimits: AccountCategoryLimit[]
}

export type AccountSettingsPayload = {
  initialBalance: number
  budgetAmount: number
  categoryLimits: {
    categoryId: number
    amount: number
  }[]
}

export async function getAccountSummary() {
  const response = await api.get<AccountSummary>('/account/summary')
  return response.data
}

export async function updateAccountSettings(data: AccountSettingsPayload) {
  const response = await api.put('/account/settings', data)
  return response.data
}