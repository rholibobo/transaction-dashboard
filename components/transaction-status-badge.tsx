import { cn } from "@/lib/utils"
import type { TransactionStatus } from "@/lib/types"

interface TransactionStatusBadgeProps {
  status: TransactionStatus
}

export function TransactionStatusBadge({ status }: TransactionStatusBadgeProps) {
  const statusConfig = {
    completed: {
      className: "bg-green-50 text-green-700 border-green-200 hover:bg-green-50 hover:text-green-700",
    },
    pending: {
      className: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50 hover:text-yellow-700",
    },
    failed: {
      className: "bg-red-50 text-red-700 border-red-200 hover:bg-red-50 hover:text-red-700",
    },
  }

  const config = statusConfig[status]

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        config.className,
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}
