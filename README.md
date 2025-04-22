# Transaction Dashboard

A modern, responsive financial transaction management dashboard built with Next.js and React.

![Transaction Dashboard Screenshot](/placeholder.svg?height=400&width=800)

## Overview

Transaction Dashboard is a comprehensive web application designed to help users manage and analyze financial transactions. It provides a clean, intuitive interface for viewing, filtering, sorting, and creating transaction records with real-time updates and responsive design for all devices.

## Features

- **Transaction Management**
  - View all transactions in a sortable, filterable table
  - Create new transactions with amount, status, and date
  - Sort by transaction ID, amount, status, or date
  - Pagination for handling large transaction sets

- **Advanced Filtering**
  - Search by transaction ID or amount
  - Filter by transaction status (completed, pending, failed)
  - Date range filtering with calendar picker
  - Combination of multiple filters simultaneously

- **Responsive Design**
  - Optimized for desktop, tablet, and mobile devices
  - Card-based view on mobile for better readability
  - Collapsible filters on smaller screens
  - Touch-friendly interface elements

- **Real-time Updates**
  - Instant feedback when creating transactions
  - Optimistic UI updates for a smooth user experience
  - Data caching for improved performance

## Technologies Used

- **Frontend**
  - Next.js 14+ (App Router)
  - React 18+
  - TypeScript
  - Tailwind CSS for styling
  - Lucide React for icons

- **State Management & Data Fetching**
  - React Query (TanStack Query)
  - React Hook Form for form handling
  - Zod for validation

- **Utilities**
  - date-fns for date manipulation
  - clsx and tailwind-merge for conditional styling

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
   git clone https://github.com/yourusername/transaction-dashboard.git
   cd transaction-dashboard
```

2. Install dependencies:
```bash
   npm install
   # or
   yarn install
```

3. Run the development server:
```bash
   npm run dev
   # or
   yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

### Viewing Transactions

The main dashboard displays a list of transactions with the following information:
- Transaction ID
- Amount
- Status (completed, pending, or failed)
- Date

You can sort the table by clicking on any column header.

### Filtering Transactions

Use the filter controls at the top of the transaction list to:
1. Search for specific transaction IDs or amounts
2. Filter by transaction status
3. Select a date range using the calendar picker

### Creating Transactions

1. Click on the "Create Transaction" tab
2. Fill in the required information:
   - Amount
   - Status
   - Date
3. Click "Create Transaction" to add the new transaction

## Project Structure

\`\`\`
transaction-dashboard/
├── app/                  # Next.js App Router
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Main page
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── transaction-dashboard.tsx    # Main dashboard component
│   ├── transaction-list.tsx         # Transaction table/list
│   ├── transaction-filters.tsx      # Filtering controls
│   ├── create-transaction-form.tsx  # Form for creating transactions
│   ├── transaction-status-badge.tsx # Status indicator
│   ├── custom-card.tsx          # Card component
│   ├── custom-tabs.tsx          # Tabs component
│   └── custom-calendar.tsx      # Calendar component
├── lib/                  # Utility functions and types
│   ├── api.ts            # API functions
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Helper functions
└── public/               # Static assets
\`\`\`


### Styling

The project uses Tailwind CSS for styling. You can customize the appearance by:

1. Modifying the `tailwind.config.ts` file to change colors, fonts, etc.
2. Editing the `globals.css` file for global styles
3. Adjusting component-specific styles in their respective files

### Data Source

The current implementation uses mock data in `lib/api.ts`. To connect to a real backend:

1. Modify the API functions in `lib/api.ts` to make actual API calls
2. Update the React Query hooks in the components to work with your API
3. Adjust error handling as needed


## Acknowledgments

- Icons provided by [Lucide Icons](https://lucide.dev/)
- Date handling by [date-fns](https://date-fns.org/)
- Form validation with [Zod](https://github.com/colinhacks/zod)
