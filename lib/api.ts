import type { CreateTransactionData, SortDirection, SortField, Transaction, TransactionFilters, TransactionResponse } from "@/lib/types"
import { generateTransactionId } from "@/lib/utils"

// Mock data
let transactions: Transaction[] = [
  {
    id: "TX-ABCD1234",
    amount: 1500.0,
    status: "completed",
    date: "2023-05-15T10:30:00Z",
  },
  {
    id: "TX-EFGH5678",
    amount: 750.5,
    status: "pending",
    date: "2023-05-16T14:45:00Z",
  },
  {
    id: "TX-IJKL9012",
    amount: 2000.0,
    status: "failed",
    date: "2023-05-17T09:15:00Z",
  },
  {
    id: "TX-MNOP3456",
    amount: 350.25,
    status: "completed",
    date: "2023-05-18T16:20:00Z",
  },
  {
    id: "TX-QRST7890",
    amount: 1200.75,
    status: "pending",
    date: "2023-05-19T11:10:00Z",
  },
  {
    id: "TX-UVWX1234",
    amount: 900.0,
    status: "completed",
    date: "2023-05-20T13:30:00Z",
  },
  {
    id: "TX-YZAB5678",
    amount: 1800.5,
    status: "failed",
    date: "2023-05-21T15:45:00Z",
  },
  {
    id: "TX-CDEF9012",
    amount: 500.25,
    status: "completed",
    date: "2023-05-22T10:20:00Z",
  },
  {
    id: "TX-GHIJ3456",
    amount: 1100.0,
    status: "pending",
    date: "2023-05-23T14:15:00Z",
  },
  {
    id: "TX-KLMN7890",
    amount: 2500.75,
    status: "completed",
    date: "2023-05-24T09:30:00Z",
  },
  {
    id: "TX-OPQR1234",
    amount: 300.5,
    status: "failed",
    date: "2023-05-25T16:45:00Z",
  },
  {
    id: "TX-STUV5678",
    amount: 1700.25,
    status: "completed",
    date: "2023-05-26T11:20:00Z",
  },
  {
    id: "TX-WXYZ9012",
    amount: 950.0,
    status: "pending",
    date: "2023-05-27T13:15:00Z",
  },
  {
    id: "TX-ABCD3456",
    amount: 2200.75,
    status: "completed",
    date: "2023-05-28T15:30:00Z",
  },
  {
    id: "TX-EFGH7890",
    amount: 400.5,
    status: "failed",
    date: "2023-05-29T10:45:00Z",
  },
  {
    id: "TX-OUTUE0AX",
    amount: 1924.84,
    status: "completed",
    date: "2023-05-18T18:05:00Z",
  },
  {
    id: "TX-FDJOCG2K",
    amount: 858.12,
    status: "completed",
    date: "2023-05-29T13:37:00Z",
  },
  {
    id: "TX-U921J2BQ",
    amount: 1344.03,
    status: "failed",
    date: "2023-06-08T18:29:00Z",
  },
  {
    id: "TX-I27YCZH0",
    amount: 136.89,
    status: "completed",
    date: "2023-06-20T00:22:00Z",
  },
  {
    id: "TX-UZ9NR4PZ",
    amount: 1410.46,
    status: "failed",
    date: "2023-06-30T14:53:00Z",
  },
  {
    id: "TX-EU2WF2OF",
    amount: 219.84,
    status: "failed",
    date: "2023-07-16T06:06:00Z",
  },
  {
    id: "TX-XHSYJR6E",
    amount: 2865.44,
    status: "pending",
    date: "2023-07-23T02:21:00Z",
  },
  {
    id: "TX-04OFWUPA",
    amount: 1181.22,
    status: "pending",
    date: "2023-07-29T17:36:00Z",
  },
  {
    id: "TX-EIW7T1MA",
    amount: 1198.44,
    status: "completed",
    date: "2023-08-09T12:11:00Z",
  },
  {
    id: "TX-O6X55R56",
    amount: 1917.64,
    status: "pending",
    date: "2023-08-15T21:57:00Z",
  },
  {
    id: "TX-K81J0U6G",
    amount: 665.19,
    status: "completed",
    date: "2023-08-27T09:03:00Z",
  },
  {
    id: "TX-ENT1NLRY",
    amount: 927.78,
    status: "completed",
    date: "2023-09-06T12:46:00Z",
  },
  {
    id: "TX-V4X2GJAY",
    amount: 1990.84,
    status: "pending",
    date: "2023-09-15T17:56:00Z",
  },
  {
    id: "TX-BC700WSL",
    amount: 437.34,
    status: "pending",
    date: "2023-09-23T12:19:00Z",
  },
  {
    id: "TX-MICBHOQV",
    amount: 1871.27,
    status: "failed",
    date: "2023-10-09T00:05:00Z",
  },
  {
    id: "TX-TV8IGZRO",
    amount: 479.69,
    status: "completed",
    date: "2023-10-10T02:29:00Z",
  },
  {
    id: "TX-SFCUHRAR",
    amount: 323.56,
    status: "failed",
    date: "2023-10-17T10:31:00Z",
  },
  {
    id: "TX-3Z10448H",
    amount: 1794.05,
    status: "completed",
    date: "2023-10-28T05:33:00Z",
  },
  {
    id: "TX-4DSSEO86",
    amount: 1240.57,
    status: "completed",
    date: "2023-11-01T06:01:00Z",
  },
  {
    id: "TX-OA41K2QB",
    amount: 2049.13,
    status: "completed",
    date: "2023-11-15T12:06:00Z",
  },
  {
    id: "TX-BIA8XVY8",
    amount: 2247.52,
    status: "pending",
    date: "2023-11-21T07:21:00Z",
  },
  {
    id: "TX-SYOD5KUH",
    amount: 2939.98,
    status: "failed",
    date: "2023-11-28T21:54:00Z",
  },
  {
    id: "TX-U110UTMK",
    amount: 1843.05,
    status: "failed",
    date: "2023-12-12T18:44:00Z",
  },
  {
    id: "TX-35UV1LLF",
    amount: 448.51,
    status: "completed",
    date: "2023-12-23T02:05:00Z",
  },
  {
    id: "TX-ESNNQ8OC",
    amount: 1051.29,
    status: "completed",
    date: "2024-01-02T11:08:00Z",
  },
  {
    id: "TX-SFG3RGHU",
    amount: 1688.86,
    status: "pending",
    date: "2024-01-13T11:23:00Z",
  },
  {
    id: "TX-P0UWHS79",
    amount: 511.11,
    status: "pending",
    date: "2024-01-28T04:51:00Z",
  },
  {
    id: "TX-YJN0NYBX",
    amount: 2340.62,
    status: "failed",
    date: "2024-02-05T14:25:00Z",
  },
  {
    id: "TX-L9FSXBUX",
    amount: 2394.07,
    status: "pending",
    date: "2024-02-11T16:01:00Z",
  },
  {
    id: "TX-Q5P4UK8N",
    amount: 2370.99,
    status: "pending",
    date: "2024-02-13T20:16:00Z",
  },
  {
    id: "TX-RGNHBYNF",
    amount: 944.14,
    status: "failed",
    date: "2024-02-27T11:06:00Z",
  },
  {
    id: "TX-TT4UOUOI",
    amount: 567.78,
    status: "failed",
    date: "2024-03-03T09:45:00Z",
  },
  {
    id: "TX-HH2MLCU9",
    amount: 2495.81,
    status: "pending",
    date: "2024-03-10T15:52:00Z",
  },
  {
    id: "TX-TS4RATGC",
    amount: 2529.58,
    status: "completed",
    date: "2024-03-15T14:47:00Z",
  },
  {
    id: "TX-54OGTRD0",
    amount: 174.73,
    status: "pending",
    date: "2024-03-24T03:35:00Z",
  },
  {
    id: "TX-T3A3768E",
    amount: 2006.34,
    status: "failed",
    date: "2024-03-25T03:43:00Z",
  },
  {
    id: "TX-GTXFN1K7",
    amount: 2324.36,
    status: "completed",
    date: "2024-04-03T23:19:00Z",
  },
  {
    id: "TX-I7Q6P1NJ",
    amount: 1165.6,
    status: "failed",
    date: "2024-04-15T04:12:00Z",
  },
  {
    id: "TX-WVI2ARWK",
    amount: 2825.74,
    status: "pending",
    date: "2024-04-17T07:02:00Z",
  },
  {
    id: "TX-4LT7NUUI",
    amount: 1485.23,
    status: "completed",
    date: "2024-04-25T12:48:00Z",
  },
  {
    id: "TX-5M2PC1NJ",
    amount: 2633.18,
    status: "completed",
    date: "2024-05-11T04:00:00Z",
  },
  {
    id: "TX-BAD01G90",
    amount: 2554.87,
    status: "pending",
    date: "2024-05-15T12:16:00Z",
  },
  {
    id: "TX-CG4ZDP6D",
    amount: 2698.52,
    status: "failed",
    date: "2024-05-26T21:49:00Z",
  },
  {
    id: "TX-AC4VILC5",
    amount: 568.85,
    status: "pending",
    date: "2024-05-30T10:45:00Z",
  },
  {
    id: "TX-6WPEN5R5",
    amount: 653.84,
    status: "failed",
    date: "2024-06-08T10:24:00Z",
  },
  {
    id: "TX-G3KY08EF",
    amount: 113.88,
    status: "completed",
    date: "2024-06-21T10:44:00Z",
  },
  {
    id: "TX-FOLA18XH",
    amount: 2820.06,
    status: "pending",
    date: "2024-06-29T22:49:00Z",
  },
  {
    id: "TX-JMKZBDXT",
    amount: 1499.95,
    status: "completed",
    date: "2024-07-10T12:50:00Z",
  },
  {
    id: "TX-XZYKMI36",
    amount: 2061.19,
    status: "failed",
    date: "2024-07-15T15:43:00Z",
  },
  {
    id: "TX-S95NXY8Q",
    amount: 738.03,
    status: "pending",
    date: "2024-07-29T22:42:00Z",
  },
  {
    id: "TX-14KEQDUZ",
    amount: 399.87,
    status: "completed",
    date: "2024-08-12T02:32:00Z",
  },
  {
    id: "TX-I4S5PLW2",
    amount: 605.97,
    status: "completed",
    date: "2024-08-23T10:52:00Z",
  },
  {
    id: "TX-W7L6ZDZF",
    amount: 1440.8,
    status: "completed",
    date: "2024-08-23T14:33:00Z",
  },
  {
    id: "TX-PN64929F",
    amount: 1685.85,
    status: "pending",
    date: "2024-09-07T23:47:00Z",
  },
  {
    id: "TX-FNYMFE6A",
    amount: 2651.13,
    status: "completed",
    date: "2024-09-14T05:56:00Z",
  },
  {
    id: "TX-5S1WCYZN",
    amount: 1542.74,
    status: "completed",
    date: "2024-09-27T20:13:00Z",
  },
  {
    id: "TX-ICJTLSI2",
    amount: 1912.95,
    status: "pending",
    date: "2024-10-04T18:12:00Z",
  },
  {
    id: "TX-U83HJNC7",
    amount: 1191.54,
    status: "pending",
    date: "2024-10-13T14:56:00Z",
  },
  {
    id: "TX-HMNJIFP8",
    amount: 841.1,
    status: "pending",
    date: "2024-10-27T00:51:00Z",
  },
  {
    id: "TX-262VIVNM",
    amount: 1968.13,
    status: "completed",
    date: "2024-11-10T14:38:00Z",
  },
  {
    id: "TX-8XV1J4DE",
    amount: 1953.61,
    status: "pending",
    date: "2024-11-21T03:06:00Z",
  },
  {
    id: "TX-CF79UMQD",
    amount: 1242.62,
    status: "completed",
    date: "2024-12-01T07:13:00Z",
  },
  {
    id: "TX-33JD2NF2",
    amount: 2552.91,
    status: "completed",
    date: "2024-12-10T19:48:00Z",
  },
  {
    id: "TX-OT5ZLWBP",
    amount: 2662.74,
    status: "completed",
    date: "2024-12-13T02:23:00Z",
  },
  {
    id: "TX-HMM54W8N",
    amount: 474.12,
    status: "pending",
    date: "2024-12-18T21:34:00Z",
  },
  {
    id: "TX-PGBGG0T3",
    amount: 2112.67,
    status: "failed",
    date: "2024-12-23T04:32:00Z",
  },
  {
    id: "TX-R7WX6RZZ",
    amount: 1806.54,
    status: "pending",
    date: "2024-01-04T12:54:00Z",
  },
  {
    id: "TX-WBQL6AA2",
    amount: 1763.71,
    status: "completed",
    date: "2024-01-14T08:42:00Z",
  },
  {
    id: "TX-ELT7UPPH",
    amount: 1954.25,
    status: "failed",
    date: "2024-01-19T22:12:00Z",
  },
  {
    id: "TX-EVSI4E8T",
    amount: 1860.02,
    status: "pending",
    date: "2024-01-31T17:02:00Z",
  },
  {
    id: "TX-EBOX8O4R",
    amount: 2164.9,
    status: "pending",
    date: "2024-02-16T01:26:00Z",
  },
  {
    id: "TX-P1B5N0QN",
    amount: 675.04,
    status: "completed",
    date: "2024-02-28T07:47:00Z",
  },
  {
    id: "TX-JWLUBW4J",
    amount: 2156.51,
    status: "completed",
    date: "2024-03-12T10:26:00Z",
  },
  {
    id: "TX-QX0R1697",
    amount: 2366.69,
    status: "completed",
    date: "2024-03-26T04:25:00Z",
  },
  {
    id: "TX-2P1UGCG4",
    amount: 119.7,
    status: "failed",
    date: "2024-03-27T04:10:00Z",
  },
  {
    id: "TX-K6R7UWSZ",
    amount: 2485.69,
    status: "pending",
    date: "2024-04-10T05:58:00Z",
  },
  {
    id: "TX-FY0OGWYB",
    amount: 2612.62,
    status: "failed",
    date: "2024-04-23T10:34:00Z",
  },
  {
    id: "TX-MSP6IOB4",
    amount: 679.21,
    status: "failed",
    date: "2024-05-05T17:18:00Z",
  },
  {
    id: "TX-UDOGI1JW",
    amount: 452.75,
    status: "pending",
    date: "2024-05-07T11:52:00Z",
  },
  {
    id: "TX-34JAKW6N",
    amount: 778.87,
    status: "completed",
    date: "2024-05-14T14:23:00Z",
  },
  {
    id: "TX-7T2W8KNY",
    amount: 2894.56,
    status: "pending",
    date: "2024-05-18T02:24:00Z",
  },
  {
    id: "TX-8O1RCQNF",
    amount: 2096.57,
    status: "pending",
    date: "2024-06-02T13:34:00Z",
  },
  {
    id: "TX-780RSZRG",
    amount: 236.09,
    status: "pending",
    date: "2024-06-03T15:01:00Z",
  },
  {
    id: "TX-BTIWHSOI",
    amount: 2275.97,
    status: "pending",
    date: "2024-06-06T02:06:00Z",
  },
  {
    id: "TX-SEDT16AE",
    amount: 2390.45,
    status: "failed",
    date: "2024-06-21T19:18:00Z",
  },
  {
    id: "TX-SFBXWBP8",
    amount: 416.74,
    status: "completed",
    date: "2024-06-30T09:24:00Z",
  },
  {
    id: "TX-W4EK7T1O",
    amount: 2318.22,
    status: "failed",
    date: "2024-07-04T18:31:00Z",
  },
  {
    id: "TX-LD6K0JSZ",
    amount: 420.27,
    status: "pending",
    date: "2024-07-13T09:11:00Z",
  },
  {
    id: "TX-CVVAP17Z",
    amount: 1421.23,
    status: "pending",
    date: "2024-07-22T04:15:00Z",
  },
  {
    id: "TX-2U7A37YH",
    amount: 1425.12,
    status: "pending",
    date: "2024-07-31T18:05:00Z",
  },
  {
    id: "TX-Q9FNVOT9",
    amount: 2085.74,
    status: "pending",
    date: "2024-08-01T01:05:00Z",
  },
  {
    id: "TX-R7VBSSIC",
    amount: 285.08,
    status: "failed",
    date: "2024-08-16T08:33:00Z",
  },
  {
    id: "TX-7PM6OVRE",
    amount: 1931.3,
    status: "pending",
    date: "2024-08-28T08:49:00Z",
  },
  {
    id: "TX-Q3SVYNVH",
    amount: 1090.94,
    status: "pending",
    date: "2024-09-12T15:49:00Z",
  },
  {
    id: "TX-H7UZIF8E",
    amount: 426.33,
    status: "pending",
    date: "2024-09-18T01:47:00Z",
  },
  {
    id: "TX-BJO7OWH6",
    amount: 1974.08,
    status: "completed",
    date: "2024-09-29T01:22:00Z",
  },
  {
    id: "TX-4X8TRSH8",
    amount: 1811.95,
    status: "failed",
    date: "2024-10-10T02:53:00Z",
  },
  {
    id: "TX-Q6TDSUA3",
    amount: 747.95,
    status: "completed",
    date: "2024-10-11T20:21:00Z",
  },
  {
    id: "TX-UMPTF7WG",
    amount: 142.96,
    status: "pending",
    date: "2024-10-18T18:14:00Z",
  },
  {
    id: "TX-6HAOOY16",
    amount: 985.16,
    status: "completed",
    date: "2024-10-21T02:27:00Z",
  },
]

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))


// Sort function for transactions
function sortTransactions(
  transactions: Transaction[],
  sortBy: SortField = "date",
  sortDirection: SortDirection = "desc",
) {
  return [...transactions].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case "date":
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
        break
      case "amount":
        comparison = a.amount - b.amount
        break
      case "status":
        comparison = a.status.localeCompare(b.status)
        break
      case "id":
        comparison = a.id.localeCompare(b.id)
        break
      default:
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
    }

    return sortDirection === "asc" ? comparison : -comparison
  })
}

export async function fetchTransactions(filters: TransactionFilters): Promise<TransactionResponse> {
  await delay(800)

  // Clone the original array to prevent mutation
  let filteredTransactions = [...transactions]

  // 1. Apply search filter (fix: handle numeric search with commas/decimals)
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase().replace(/,/g, ".") // Normalize decimals
    filteredTransactions = filteredTransactions.filter(
      (transaction) =>
        transaction.id.toLowerCase().includes(query) || transaction.amount.toString().toLowerCase().includes(query),
    )
  }

  // 2. Apply status filter
  if (filters.statusFilter && filters.statusFilter !== "all") {
    filteredTransactions = filteredTransactions.filter((transaction) => transaction.status === filters.statusFilter)
  }

  // 3. Date range filter (fix: handle timezones and invalid dates)
  if (filters.dateRange?.from || filters.dateRange?.to) {
    filteredTransactions = filteredTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date)
      let fromDate = filters.dateRange?.from ? new Date(filters.dateRange.from) : null
      let toDate = filters.dateRange?.to ? new Date(filters.dateRange.to) : null

      // Check for invalid dates and ignore them
      if (fromDate && isNaN(fromDate.getTime())) fromDate = null
      if (toDate && isNaN(toDate.getTime())) toDate = null

      // Adjust toDate to end of day (23:59:59.999)
      if (toDate) toDate.setHours(23, 59, 59, 999)

      // Compare dates in UTC to avoid timezone issues
      const transactionUTCTime = transactionDate.getTime()
      const fromUTCTime = fromDate ? fromDate.getTime() : Number.NEGATIVE_INFINITY
      const toUTCTime = toDate ? toDate.getTime() : Number.POSITIVE_INFINITY

      return transactionUTCTime >= fromUTCTime && transactionUTCTime <= toUTCTime
    })
  }

  // 4. Apply sorting
  const sortBy = filters.sortBy || "date"
  const sortDirection = filters.sortDirection || "desc"
  filteredTransactions = sortTransactions(filteredTransactions, sortBy, sortDirection)

  // 5. Pagination (fix: clamp page number to valid range)
  const ITEMS_PER_PAGE = 10
  const totalItems = filteredTransactions.length
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE))

  // Ensure page is within valid bounds (1 <= page <= totalPages)
  const validPage = Math.max(1, Math.min(filters.page, totalPages))
  const startIndex = (validPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex)

  return {
    transactions: paginatedTransactions,
    totalPages: totalPages,
    currentPage: validPage,
  }
}

export async function createTransaction(data: CreateTransactionData): Promise<Transaction> {
  await delay(1000) // Simulate network delay

  const newTransaction: Transaction = {
    id: generateTransactionId(),
    amount: data.amount,
    status: data.status,
    date: data.date,
  }

  // Add to the beginning of the array (newest first)
  transactions = [newTransaction, ...transactions]

  return newTransaction
}
