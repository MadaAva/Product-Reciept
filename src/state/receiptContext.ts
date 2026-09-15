import { createContext } from 'react'
import type { AppUser, Container, ContainerDetails, ShipmentWithStatus, Store } from '../models/domain'
import type { ReceiptResult, ScanResult } from '../models/errors'

export interface AppContextValue {
  user: AppUser
  store?: Store
  shipments: ShipmentWithStatus[]
  loading: boolean
  loadError: boolean
  refreshShipments(): Promise<void>
  getShipmentContainers(shipmentId: string): Promise<Container[]>
  getContainerDetails(containerId: string): Promise<ContainerDetails | undefined>
  handleContainerScan(scannedValue: string, expectedShipmentId?: string): Promise<ScanResult>
  confirmReceipt(container: Container): Promise<ReceiptResult>
}

export const AppContext = createContext<AppContextValue | undefined>(undefined)