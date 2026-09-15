import { useContext } from 'react'
import { AppContext } from './receiptContext'

export function useReceiptApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useReceiptApp must be used within AppProvider')
  return context
}