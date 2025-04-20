"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { TransactionList } from "@/components/transaction-list";
import { TransactionFilters } from "@/components/transaction-filters";
import { CreateTransactionForm } from "@/components/create-transaction-form";
import { fetchTransactions } from "@/lib/api";
import type { SortDirection, SortField, TransactionResponse, TransactionStatus } from "@/lib/types";
import logo from "../public/logo.png";

import { TabContent, TabList, Tabs, TabTrigger } from "./custom-tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./custom-card";


export function TransactionDashboard() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "all">(
    "all"
  );
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const [sortBy, setSortBy] = useState<SortField>("date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [previousData, setPreviousData] = useState<TransactionResponse | null>(null)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["transactions", page, searchQuery, statusFilter, dateRange,
      sortBy,
      sortDirection,],
    queryFn: () =>
      fetchTransactions({ page, searchQuery, statusFilter, dateRange,
        sortBy,
        sortDirection, }),
    
    staleTime:5000, // 5 minutes

  });

  const displayData = isLoading && previousData ? previousData : data

  useEffect(() => {
    setPage(1)
  }, [searchQuery, statusFilter, dateRange, sortBy, sortDirection])

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
  };

  const handleStatusFilter = (status: TransactionStatus | "all") => {
    setStatusFilter(status);
    
  };

  const handleDateRangeChange = (range: {
    from: Date | undefined;
    to: Date | undefined;
  }) => {
    setDateRange(range);
    
  };

  const handlePageChange = (newPage: number) => {
    if (newPage !== page && newPage > 0 && (!displayData || newPage <= displayData.totalPages)) {
      setPage(newPage)
    }
    
  };

  const handleSort = (field: SortField) => {
    if (field === sortBy) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new field with default direction
      setSortBy(field)
      setSortDirection("desc") // Default to descending for new sort field
    }
  }
  

  const handleTransactionCreated = () => {
    refetch();
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background py-8 px-4 md:px-6 bg-red-50 ">
        <div className="flex items-center justify-between ">
          <h1 className="text-xl font-bold md:text-2xl text-red-600">
            Transaction Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-red-600">
              {format(new Date(), "MMMM d, yyyy")}
            </span>
          </div>
        </div>
      </header>
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <Tabs defaultValue="transactions">
          <TabList>
            <TabTrigger value="transactions">Transactions</TabTrigger>
            <TabTrigger value="create">Create Transaction</TabTrigger>
          </TabList>
          <TabContent value="transactions">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Transaction List</CardTitle>
                <CardDescription>
                  View, search, and filter your recent financial transactions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <TransactionFilters
                  onSearch={handleSearch}
                  onStatusChange={handleStatusFilter}
                  onDateRangeChange={handleDateRangeChange}
                  statusFilter={statusFilter}
                  dateRange={dateRange}
                />

                <TransactionList
                  transactions={data?.transactions || []}
                  isLoading={isLoading}
                  totalPages={data?.totalPages || 1}
                  currentPage={page}
                  onPageChange={handlePageChange}
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
              </CardContent>
            </Card>
          </TabContent>
          <TabContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create New Transaction</CardTitle>
                <CardDescription>
                  Fill out the form below to create a new transaction.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CreateTransactionForm
                  onTransactionCreated={handleTransactionCreated}
                />
              </CardContent>
            </Card>
          </TabContent>
        </Tabs>
      </main>
    </div>
  );
}
