import React from 'react'
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NotificationContextProvider } from './NotificationContext'
import { UserContextProvider } from './UserContext'
import { MemoryRouter as Router } from 'react-router-dom'

const AllTheProviders = ({ children }) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <NotificationContextProvider>
        <UserContextProvider>
          <Router>{children}</Router>
        </UserContextProvider>
      </NotificationContextProvider>
    </QueryClientProvider>
  )
}

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }
