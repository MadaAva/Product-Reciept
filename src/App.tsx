import { useState } from 'react'
import './App.css'
import './visualEnhancements.css'
import type { ShipmentWithStatus } from './models/domain'
import { ContainerPage } from './pages/ContainerPage'
import { HistoryPage } from './pages/HistoryPage'
import { HomePage } from './pages/HomePage'
import { FunctionHomePage } from './pages/FunctionHomePage'
import { ScannerPage } from './pages/ScannerPage'
import { ShipmentPage } from './pages/ShipmentPage'
import { SuccessPage } from './pages/SuccessPage'
import { AppProvider } from './state/AppContext'
import { useReceiptApp } from './state/useReceiptApp'

type Page = 'home' | 'shipment' | 'scanner' | 'container' | 'success' | 'history'

function ReceiptApp({ onFunctionsOpen }: { onFunctionsOpen: () => void }) {
  const { shipments } = useReceiptApp()
  const [page, setPage] = useState<Page>('home')
  const [shipment, setShipment] = useState<ShipmentWithStatus>()
  const [containerId, setContainerId] = useState('')
  const [returnToHistory, setReturnToHistory] = useState(false)
  const openShipment = (nextShipment: ShipmentWithStatus) => { setReturnToHistory(false); setShipment(nextShipment); setPage('shipment') }
  const openHistoryShipment = (shipmentId: string) => {
    const nextShipment = shipments.find((item) => item.shipmentId === shipmentId)
    if (!nextShipment) return
    setReturnToHistory(true)
    setShipment(nextShipment)
    setPage('shipment')
  }
  const openContainer = (nextContainerId: string) => { setContainerId(nextContainerId); setPage('container') }
  if (page === 'shipment' && shipment) return <ShipmentPage shipment={shipment} onBack={() => setPage(returnToHistory ? 'history' : 'home')} onScan={() => setPage('scanner')} onContainerOpen={openContainer} />
  if (page === 'scanner') return <ScannerPage shipmentId={shipment?.shipmentId} onBack={() => setPage(shipment ? 'shipment' : 'home')} onValidScan={openContainer} />
  if (page === 'container') return <ContainerPage containerId={containerId} onBack={() => setPage(shipment ? 'shipment' : 'home')} onSuccess={() => setPage('success')} />
  if (page === 'success') return <SuccessPage containerId={containerId} onDone={() => setPage('home')} />
  if (page === 'history') return <HistoryPage onBack={() => setPage('home')} onShipmentOpen={openHistoryShipment} />
  return <HomePage onShipmentOpen={openShipment} onHistoryOpen={() => setPage('history')} onFunctionsOpen={onFunctionsOpen} />
}

export default function App() {
  const [activeFunction, setActiveFunction] = useState<'home' | 'productReceipt'>('home')
  if (activeFunction === 'home') return <FunctionHomePage onProductReceiptOpen={() => setActiveFunction('productReceipt')} />
  return <AppProvider><ReceiptApp onFunctionsOpen={() => setActiveFunction('home')} /></AppProvider>
}
