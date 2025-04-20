"use client"

import { useEffect, useState, useRef } from "react"
import { CalendarIcon, Search, ChevronDown } from "lucide-react"
import type { TransactionStatus } from "@/lib/types"
import { cn, useDebounce } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar } from "./custom-calendar"


interface TransactionFiltersProps {
  onSearch: (query: string) => void
  onStatusChange: (status: TransactionStatus | "all") => void
  onDateRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void
  statusFilter: TransactionStatus | "all"
  dateRange: { from: Date | undefined; to: Date | undefined }
}

export function TransactionFilters({
  onSearch,
  onStatusChange,
  onDateRangeChange,
  statusFilter,
  dateRange,
}: TransactionFiltersProps) {
  const [searchInput, setSearchInput] = useState("")
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const statusDropdownRef = useRef<HTMLDivElement>(null)
  const datePickerRef = useRef<HTMLDivElement>(null)
  const debouncedSearchTerm = useDebounce(searchInput, 500)

  // Handle clicks outside the dropdowns to close them
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setStatusDropdownOpen(false)
      }
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setDatePickerOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    onSearch(debouncedSearchTerm)
  }, [debouncedSearchTerm, onSearch])

  // Format the status for display
  const formatStatus = (status: TransactionStatus | "all") => {
    if (status === "all") return "All"
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  // Format the date range for display
  const formatDateRange = () => {
    if (dateRange.from) {
      if (dateRange.to) {
        return `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}`
      }
      return format(dateRange.from, "LLL dd, y")
    }
    return "Pick a date range"
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Custom Search Input */}
      <div className="space-y-2">
        <label
          htmlFor="search"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            id="search"
            type="text"
            placeholder="Transaction ID or Amount"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-8 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </div>

      {/* Custom Status Dropdown */}
      <div className="space-y-2" ref={statusDropdownRef}>
        <label
          htmlFor="status"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Status
        </label>
        <div className="relative">
          <button
            type="button"
            id="status"
            onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            aria-haspopup="listbox"
            aria-expanded={statusDropdownOpen}
          >
            <span>{formatStatus(statusFilter)}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </button>
          {statusDropdownOpen && (
            <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md">
              <div className="p-1" role="listbox">
                <button
                  className={cn(
                    "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                    statusFilter === "all" ? "bg-accent text-accent-foreground" : "",
                  )}
                  onClick={() => {
                    onStatusChange("all")
                    setStatusDropdownOpen(false)
                  }}
                  role="option"
                  aria-selected={statusFilter === "all"}
                >
                  {statusFilter === "all" && (
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </span>
                  )}
                  All
                </button>
                <button
                  className={cn(
                    "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                    statusFilter === "completed" ? "bg-accent text-accent-foreground" : "",
                  )}
                  onClick={() => {
                    onStatusChange("completed")
                    setStatusDropdownOpen(false)
                  }}
                  role="option"
                  aria-selected={statusFilter === "completed"}
                >
                  {statusFilter === "completed" && (
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </span>
                  )}
                  Completed
                </button>
                <button
                  className={cn(
                    "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                    statusFilter === "pending" ? "bg-accent text-accent-foreground" : "",
                  )}
                  onClick={() => {
                    onStatusChange("pending")
                    setStatusDropdownOpen(false)
                  }}
                  role="option"
                  aria-selected={statusFilter === "pending"}
                >
                  {statusFilter === "pending" && (
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </span>
                  )}
                  Pending
                </button>
                <button
                  className={cn(
                    "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                    statusFilter === "failed" ? "bg-accent text-accent-foreground" : "",
                  )}
                  onClick={() => {
                    onStatusChange("failed")
                    setStatusDropdownOpen(false)
                  }}
                  role="option"
                  aria-selected={statusFilter === "failed"}
                >
                  {statusFilter === "failed" && (
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </span>
                  )}
                  Failed
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom Date Range Picker */}
      <div className="space-y-2" ref={datePickerRef}>
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Date Range
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setDatePickerOpen(!datePickerOpen)}
            className="flex h-10 w-full items-center justify-start rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            aria-haspopup="dialog"
            aria-expanded={datePickerOpen}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span className={cn(!dateRange.from && "text-muted-foreground")}>{formatDateRange()}</span>
          </button>
          {datePickerOpen && (
            <div className="absolute right-0 z-50 mt-1 rounded-md border bg-popover p-4 text-popover-foreground shadow-md">
              <div className="flex flex-col md:flex-row">
                <Calendar
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={
                    dateRange.from && dateRange.to
                      ? { from: dateRange.from, to: dateRange.to }
                      : undefined
                  }
                  onSelect={(range: any) => {
                    if (range && "from" in range) {
                      onDateRangeChange({
                        from: range.from,
                        to: range.to,
                      })
                    }
                  }}
                  numberOfMonths={1}
                  showOutsideDays={true}
                  initialFocus
                />
                <Calendar
                  mode="range"
                  defaultMonth={
                    dateRange.from
                      ? new Date(dateRange.from.getFullYear(), dateRange.from.getMonth() + 1, 1)
                      : undefined
                  }
                  selected={
                    dateRange.from && dateRange.to
                      ? { from: dateRange.from, to: dateRange.to }
                      : undefined
                  }
                  onSelect={(range: any) => {
                    if (range && "from" in range) {
                      onDateRangeChange({
                        from: range.from,
                        to: range.to,
                      })
                    }
                  }}
                  numberOfMonths={1}
                  showOutsideDays={true}
                />
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    onDateRangeChange({ from: undefined, to: undefined })
                    setDatePickerOpen(false)
                  }}
                  className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setDatePickerOpen(false)}
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
