"use client"

import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { createTransaction } from "@/lib/api"
import type { TransactionStatus } from "@/lib/types"
import { Calendar } from "./custom-calendar"


interface CreateTransactionFormProps {
  onTransactionCreated: () => void
}

const formSchema = z.object({
  amount: z.coerce.number().positive("Amount must be a positive number"),
  status: z.enum(["completed", "pending", "failed"]),
  date: z.date().refine((date) => date <= new Date(), {
    message: "Date cannot be in the future",
  }),
})

type FormValues = z.infer<typeof formSchema>

export function CreateTransactionForm({ onTransactionCreated }: CreateTransactionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState({ title: "", message: "", type: "" })
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const statusDropdownRef = useRef<HTMLDivElement>(null)
  const datePickerRef = useRef<HTMLDivElement>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: undefined,
      status: "completed",
      date: new Date(),
    },
  })

  const selectedStatus = watch("status")
  const selectedDate = watch("date")

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

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  const displayToast = (title: string, message: string, type: string) => {
    setToastMessage({ title, message, type })
    setShowToast(true)
  }

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    try {
      await createTransaction({
        amount: values.amount,
        status: values.status as TransactionStatus,
        date: values.date.toISOString(),
      })
      displayToast("Success", "Transaction created successfully", "success")
      reset({
        amount: undefined,
        status: "completed",
        date: new Date(),
      })
      onTransactionCreated()
    } catch (error) {
      displayToast("Error", "Failed to create transaction", "error")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Custom Toast */}
      {showToast && (
        <div
          className={cn(
            "fixed right-4 top-4 z-50 max-w-md rounded-lg p-4 shadow-md",
            toastMessage.type === "success" ? "bg-green-50 text-green-900" : "bg-red-50 text-red-900",
          )}
        >
          <div className="flex items-start">
            <div className="flex-1">
              <h3 className="font-medium">{toastMessage.title}</h3>
              <div className="mt-1 text-sm">{toastMessage.message}</div>
            </div>
            <button
              type="button"
              className="ml-4 inline-flex h-5 w-5 items-center justify-center rounded-md text-gray-400 hover:text-gray-500"
              onClick={() => setShowToast(false)}
            >
              <span className="sr-only">Close</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Amount Field */}
        <div className="space-y-2">
          <label
            htmlFor="amount"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
            <input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              className={cn(
                "flex h-10 w-full rounded-md border bg-background px-3 py-2 pl-7 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                errors.amount ? "border-red-500" : "border-input",
              )}
              {...register("amount")}
            />
          </div>
          <p className="text-sm text-muted-foreground">Enter the transaction amount in USD.</p>
          {errors.amount && <p className="text-sm font-medium text-red-500">{errors.amount.message}</p>}
        </div>

        {/* Status Field */}
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
              className={cn(
                "flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                errors.status ? "border-red-500" : "border-input",
              )}
              aria-haspopup="listbox"
              aria-expanded={statusDropdownOpen}
            >
              <span>{selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}</span>
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 opacity-50"
              >
                <path
                  d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.26618 11.9026 7.38064 11.95 7.49999 11.95C7.61933 11.95 7.73379 11.9026 7.81819 11.8182L10.0682 9.56819Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            {statusDropdownOpen && (
              <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md">
                <div className="p-1" role="listbox">
                  <button
                    type="button"
                    className={cn(
                      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                      selectedStatus === "completed" ? "bg-accent text-accent-foreground" : "",
                    )}
                    onClick={() => {
                      setValue("status", "completed")
                      setStatusDropdownOpen(false)
                    }}
                    role="option"
                    aria-selected={selectedStatus === "completed"}
                  >
                    {selectedStatus === "completed" && (
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
                    type="button"
                    className={cn(
                      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                      selectedStatus === "pending" ? "bg-accent text-accent-foreground" : "",
                    )}
                    onClick={() => {
                      setValue("status", "pending")
                      setStatusDropdownOpen(false)
                    }}
                    role="option"
                    aria-selected={selectedStatus === "pending"}
                  >
                    {selectedStatus === "pending" && (
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
                    type="button"
                    className={cn(
                      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                      selectedStatus === "failed" ? "bg-accent text-accent-foreground" : "",
                    )}
                    onClick={() => {
                      setValue("status", "failed")
                      setStatusDropdownOpen(false)
                    }}
                    role="option"
                    aria-selected={selectedStatus === "failed"}
                  >
                    {selectedStatus === "failed" && (
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
            <input type="hidden" {...register("status")} />
          </div>
          <p className="text-sm text-muted-foreground">Select the current status of the transaction.</p>
          {errors.status && <p className="text-sm font-medium text-red-500">{errors.status.message}</p>}
        </div>

        {/* Date Field */}
        <div className="space-y-2" ref={datePickerRef}>
          <label
            htmlFor="date"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Date
          </label>
          <div className="relative">
            <button
              type="button"
              id="date"
              onClick={() => setDatePickerOpen(!datePickerOpen)}
              className={cn(
                "flex h-10 w-full items-center justify-start rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                errors.date ? "border-red-500" : "border-input",
              )}
              aria-haspopup="dialog"
              aria-expanded={datePickerOpen}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>{selectedDate ? format(selectedDate, "PPP") : "Pick a date"}</span>
            </button>
            {datePickerOpen && (
              <div className="absolute right-0 z-50 mt-1 rounded-md border bg-popover p-4 text-popover-foreground shadow-md">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      if (date instanceof Date) {
                        setValue("date", date)
                      }
                      setDatePickerOpen(false)
                    }
                  }}
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setValue("date", new Date())
                      setDatePickerOpen(false)
                    }}
                    className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                  >
                    Today
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
            <input type="hidden" {...register("date")} />
          </div>
          <p className="text-sm text-muted-foreground">The date when the transaction occurred.</p>
          {errors.date && <p className="text-sm font-medium text-red-500">{errors.date.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create Transaction"}
        </button>
      </form>
    </div>
  )
}
