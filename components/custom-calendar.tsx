"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  isBefore,
  isAfter,
} from "date-fns"

interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

interface CalendarProps {
  mode?: "single" | "range" | "multiple"
  selected?: DateRange | Date | (() => DateRange | Date | undefined) | undefined
  onSelect?: (date: Date | DateRange | undefined) => void
  disabled?: (date: Date) => boolean
  className?: string
  showOutsideDays?: boolean
  initialFocus?: boolean
  numberOfMonths?: number
  defaultMonth?: Date
}

export function Calendar({
  mode = "single",
  selected,
  onSelect,
  disabled,
  className,
  showOutsideDays = true,
  initialFocus,
  numberOfMonths = 1,
  defaultMonth,
}: CalendarProps) {
  const [month, setMonth] = React.useState<Date>(defaultMonth || new Date())
  const [internalSelected, setInternalSelected] = React.useState<DateRange | Date | undefined>(selected)
  const [hoveredDate, setHoveredDate] = React.useState<Date | null>(null)

  // Update internal state when selected prop changes
  React.useEffect(() => {
    setInternalSelected(selected)
  }, [selected])

  // Get days for the current month view
  const getDaysForMonthView = (date: Date) => {
    const start = startOfWeek(startOfMonth(date))
    const end = endOfWeek(endOfMonth(date))
    return eachDayOfInterval({ start, end })
  }

  // Get week days headers
  const weekDays = React.useMemo(() => {
    const start = startOfWeek(new Date())
    return Array.from({ length: 7 }).map((_, i) => {
      const day = (i + start.getDay()) % 7
      return format(new Date(start.setDate(start.getDate() - start.getDay() + day)), "EEE")
    })
  }, [])

  // Handle month navigation
  const handlePreviousMonth = () => {
    setMonth(subMonths(month, 1))
  }

  const handleNextMonth = () => {
    setMonth(addMonths(month, 1))
  }

  // Handle day selection
  const handleDayClick = (day: Date) => {
    if (disabled && disabled(day)) return

    if (mode === "single") {
      setInternalSelected(day)
      onSelect?.(day)
    } else if (mode === "range") {
      if (!internalSelected || !("from" in internalSelected)) {
        // First click - set from date
        const newRange: DateRange = { from: day, to: undefined }
        setInternalSelected(newRange)
        onSelect?.(newRange)
      } else if (internalSelected.from && !internalSelected.to) {
        // Second click - set to date
        let newRange: DateRange

        if (isBefore(day, internalSelected.from)) {
          // If clicking a date before the from date, swap them
          newRange = { from: day, to: internalSelected.from }
        } else {
          newRange = { from: internalSelected.from, to: day }
        }

        setInternalSelected(newRange)
        onSelect?.(newRange)
      } else {
        // Third click - start new range
        const newRange: DateRange = { from: day, to: undefined }
        setInternalSelected(newRange)
        onSelect?.(newRange)
      }
    }
  }

  // Handle day hover for range selection
  const handleDayHover = (day: Date) => {
    if (
      mode === "range" &&
      internalSelected &&
      "from" in internalSelected &&
      internalSelected.from &&
      !internalSelected.to
    ) {
      setHoveredDate(day)
    }
  }

  // Check if a date is selected
  const isDateSelected = (date: Date): boolean => {
    if (!internalSelected) return false

    if (mode === "single" && !(internalSelected instanceof Date) && !("from" in internalSelected)) {
      return false
    }

    if (mode === "single" && internalSelected instanceof Date) {
      return isSameDay(date, internalSelected)
    }

    if (mode === "range" && "from" in internalSelected) {
      const { from, to } = internalSelected
      if (!from) return false
      if (!to) return isSameDay(date, from)

      return isSameDay(date, from) || isSameDay(date, to) || (isAfter(date, from) && isBefore(date, to))
    }

    if (mode === "multiple" && Array.isArray(internalSelected)) {
      return internalSelected.some((selectedDate) => isSameDay(date, selectedDate))
    }

    return false
  }

  // Check if a date is in the hover range
  const isDateInHoverRange = (date: Date): boolean => {
    if (
      mode === "range" &&
      internalSelected &&
      "from" in internalSelected &&
      internalSelected.from &&
      !internalSelected.to &&
      hoveredDate
    ) {
      if (isBefore(hoveredDate, internalSelected.from)) {
        return isAfter(date, hoveredDate) && isBefore(date, internalSelected.from)
      } else {
        return isAfter(date, internalSelected.from) && isBefore(date, hoveredDate)
      }
    }
    return false
  }

  // Generate days for the current month
  const days = getDaysForMonthView(month)

  // Group days by week
  const weeks = React.useMemo(() => {
    const result = []
    let week = []

    for (let i = 0; i < days.length; i++) {
      week.push(days[i])
      if (week.length === 7) {
        result.push(week)
        week = []
      }
    }

    return result
  }, [days])

  return (
    <div className={cn("p-3", className)}>
      <div className="space-y-4">
        <div className="flex justify-center pt-1 relative items-center">
          <span className="text-sm font-medium">{format(month, "MMMM yyyy")}</span>
          <div className="space-x-1 flex items-center absolute right-1">
            <button
              type="button"
              onClick={handlePreviousMonth}
              className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-input bg-background text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-input bg-background text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="w-full">
          <div className="flex">
            {weekDays.map((day, i) => (
              <div key={i} className="text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] text-center">
                {day}
              </div>
            ))}
          </div>
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex w-full mt-2">
              {week.map((day, dayIndex) => {
                const isOutsideCurrentMonth = !isSameMonth(day, month)
                const isDisabled = disabled ? disabled(day) : false
                const isSelected = isDateSelected(day)
                const isInHoverRange = isDateInHoverRange(day)
                const isDayToday = isToday(day)
                const isRangeStart =
                  mode === "range" &&
                  internalSelected &&
                  "from" in internalSelected &&
                  internalSelected.from &&
                  isSameDay(day, internalSelected.from)
                const isRangeEnd =
                  mode === "range" &&
                  internalSelected &&
                  "from" in internalSelected &&
                  internalSelected.to &&
                  isSameDay(day, internalSelected.to)

                return (
                  <div key={dayIndex} className="h-9 w-9 text-center text-sm p-0 relative">
                    <button
                      type="button"
                      onClick={() => handleDayClick(day)}
                      onMouseEnter={() => handleDayHover(day)}
                      disabled={isDisabled}
                      className={cn(
                        "inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                        isSelected
                          ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                          : isDayToday
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent hover:text-accent-foreground",
                        isOutsideCurrentMonth && !showOutsideDays && "invisible",
                        isOutsideCurrentMonth && showOutsideDays && "text-muted-foreground opacity-50",
                        isInHoverRange && "bg-accent/50",
                        isRangeStart && "rounded-l-md",
                        isRangeEnd && "rounded-r-md",
                      )}
                      tabIndex={isOutsideCurrentMonth && !showOutsideDays ? -1 : 0}
                      aria-label={format(day, "PPP")}
                      aria-selected={isSelected}
                    >
                      {format(day, "d")}
                    </button>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

Calendar.displayName = "Calendar"
