"use client"

import { ChevronLeft, ChevronRight, ArrowUp, ArrowDown } from "lucide-react"
import type { Transaction, SortField, SortDirection } from "@/lib/types"
import { TransactionStatusBadge } from "@/components/transaction-status-badge"
import { formatCurrency, formatDate, cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface TransactionListProps {
  transactions: Transaction[]
  isLoading: boolean
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
  sortBy: SortField
  sortDirection: SortDirection
  onSort: (field: SortField) => void
}

export function TransactionList({
  transactions,
  isLoading,
  totalPages,
  currentPage,
  onPageChange,
  sortBy,
  sortDirection,
  onSort,
}: TransactionListProps) {
  
  const [isMobile, setIsMobile] = useState(false)
  
  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Initial check
    checkIfMobile()
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile)
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  // Calculate pagination info
  const startItem = transactions.length > 0 ? (currentPage - 1) * 10 + 1 : 0
  const endItem = transactions.length > 0 ? startItem + transactions.length - 1 : 0
  const hasPreviousPage = currentPage > 1
  const hasNextPage = currentPage < totalPages

  // Render sort indicator
  const renderSortIndicator = (field: SortField) => {
    if (sortBy !== field) return null

    return sortDirection === "asc" ? (
      <ArrowUp className="ml-1 h-4 w-4 inline" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4 inline" />
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-red-50 bg-white shadow-sm overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b border-red-50 bg-red-50/30 transition-colors">
            <th
                className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 cursor-pointer hover:text-foreground"
                onClick={() => onSort("id")}
              >
                Transaction ID {renderSortIndicator("id")}
              </th>
              <th
                className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 cursor-pointer hover:text-foreground"
                onClick={() => onSort("amount")}
              >
                Amount {renderSortIndicator("amount")}
              </th>
              <th
                className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 cursor-pointer hover:text-foreground"
                onClick={() => onSort("status")}
              >
                Status {renderSortIndicator("status")}
              </th>
              <th
                className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 cursor-pointer hover:text-foreground"
                onClick={() => onSort("date")}
              >
                Date {renderSortIndicator("date")}
              </th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {/* Loading state */}
            {isLoading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <tr key={index} className="border-b border-red-50 transition-colors hover:bg-red-50/20">
                  <td className="p-4 pl-6 align-middle [&:has([role=checkbox])]:pr-0">
                    <div className="h-5 w-[120px] animate-pulse rounded bg-red-100"></div>
                  </td>
                  <td className="p-4 pl-6 align-middle [&:has([role=checkbox])]:pr-0">
                    <div className="h-5 w-[80px] animate-pulse rounded bg-red-100"></div>
                  </td>
                  <td className="p-4 pl-6 align-middle [&:has([role=checkbox])]:pr-0">
                    <div className="h-5 w-[100px] animate-pulse rounded bg-red-100"></div>
                  </td>
                  <td className="p-4 pl-6 align-middle [&:has([role=checkbox])]:pr-0">
                    <div className="h-5 w-[100px] animate-pulse rounded bg-red-100"></div>
                  </td>
                </tr>
              ))
            ) : transactions.length === 0 ? (
              <tr className="border-b border-red-50 transition-colors hover:bg-red-50/20">
                <td colSpan={4} className="h-24 p-4 text-center align-middle text-red-800 [&:has([role=checkbox])]:pr-0">
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-red-50 transition-colors hover:bg-red-50/20"
                >
                  <td className="p-4 pl-6 align-middle font-medium text-red-900 [&:has([role=checkbox])]:pr-0">
                    {transaction.id}
                  </td>
                  <td className="p-4 pl-6 align-middle text-red-800 [&:has([role=checkbox])]:pr-0">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="p-4 pl-6 align-middle [&:has([role=checkbox])]:pr-0">
                    <TransactionStatusBadge 
                      status={transaction.status} 
                      // className="border-red-100 bg-red-50/50 text-red-700" 
                    />
                  </td>
                  <td className="p-4 pl-6 align-middle text-red-700 [&:has([role=checkbox])]:pr-0">
                    {formatDate(transaction.date)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="text-sm text-red-700">
          {transactions.length > 0 ? (
            `Showing ${startItem} to ${endItem} of ${totalPages * 10}+ items`
          ) : (
            'No items to display'
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1 || isLoading}
            className={cn(
              "inline-flex h-9 items-center justify-center rounded-lg border border-red-100 bg-white px-3.5 text-sm font-medium text-red-800",
              "transition-colors hover:bg-red-50 hover:text-red-900",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500",
              "disabled:pointer-events-none disabled:opacity-50"
            )}
          >
            <ChevronLeft className="mr-1.5 h-4 w-4" />
            Previous
          </button>
          <span className="min-w-[100px] text-center text-sm font-medium text-red-900">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || isLoading}
            className={cn(
              "inline-flex h-9 items-center justify-center rounded-lg border border-red-100 bg-white px-3.5 text-sm font-medium text-red-800",
              "transition-colors hover:bg-red-50 hover:text-red-900",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500",
              "disabled:pointer-events-none disabled:opacity-50"
            )}
          >
            Next
            <ChevronRight className="ml-1.5 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
