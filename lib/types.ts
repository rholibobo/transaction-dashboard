export type TransactionStatus = "completed" | "pending" | "failed"

export interface Transaction {
  id: string
  amount: number
  status: TransactionStatus
  date: string
}

export type SortField = "date" | "amount" | "status" | "id"
export type SortDirection = "asc" | "desc"

export interface TransactionFilters {
  page: number
  searchQuery?: string
  statusFilter?: TransactionStatus | "all"
  dateRange?: {
    from: Date | undefined
    to: Date | undefined
  }
  sortBy?: SortField
  sortDirection?: SortDirection
}

export interface TransactionResponse {
  transactions: Transaction[]
  totalPages: number
  currentPage: number
}

export interface CreateTransactionData {
  amount: number
  status: TransactionStatus
  date: string
}
