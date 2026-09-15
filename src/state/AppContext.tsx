import { useEffect, useState, type ReactNode } from 'react'
import { currentUser } from '../data/mockData'
import type { ContainerDetails, ShipmentWithStatus, Store } from '../models/domain'
import { MockConfirmedContainerRepository, MockContainerRepository, MockPowerActionRepository, MockShipmentRepository, MockStoreRepository } from '../repositories/mockRepositories'
import { ConsoleLogger } from '../services/logger'
import { DefaultReceiptService } from '../services/receiptService'
import { calculateShipmentStatus } from '../services/shipmentStatus'
import { AppContext } from './receiptContext'

const confirmations = new MockConfirmedContainerRepository()
const containerRepository = new MockContainerRepository()
const shipmentRepository = new MockShipmentRepository(confirmations)
const logger = new ConsoleLogger()
const receiptService = new DefaultReceiptService(containerRepository, shipmentRepository, confirmations, new MockPowerActionRepository(), logger)
const storeRepository = new MockStoreRepository()

export function AppProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<Store>()
  const [shipments, setShipments] = useState<ShipmentWithStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  const refreshShipments = async () => {
    setLoading(true)
    setLoadError(false)
    try {
      logger.info('shipment load', { store: currentUser.storeNumber })
      const [storeResult, shipmentResult] = await Promise.all([
        storeRepository.getByStoreNumber(currentUser.storeNumber),
        shipmentRepository.getForStore(currentUser.storeNumber, currentUser.legalEntity),
      ])
      setStore(storeResult)
      setShipments(shipmentResult.map((shipment) => ({ ...shipment, status: calculateShipmentStatus(shipment.totalContainers, shipment.receivedContainers) })))
    } catch {
      logger.error('unexpected errors', { operation: 'shipment load' })
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    logger.info('application start', { user: currentUser.id })
    void Promise.all([
      storeRepository.getByStoreNumber(currentUser.storeNumber),
      shipmentRepository.getForStore(currentUser.storeNumber, currentUser.legalEntity),
    ]).then(([storeResult, shipmentResult]) => {
      setStore(storeResult)
      setShipments(shipmentResult.map((shipment) => ({ ...shipment, status: calculateShipmentStatus(shipment.totalContainers, shipment.receivedContainers) })))
    }).catch(() => {
      logger.error('unexpected errors', { operation: 'shipment load' })
      setLoadError(true)
    }).finally(() => setLoading(false))
  }, [])

  const getContainerDetails = async (containerId: string): Promise<ContainerDetails | undefined> => {
    const container = await containerRepository.getById(containerId)
    if (!container) return undefined
    const [lines, received] = await Promise.all([containerRepository.getLines(containerId), confirmations.exists(container.containerId, container.shipmentId)])
    return { container, lines, isReceived: received }
  }

  return <AppContext.Provider value={{ user: currentUser, store, shipments, loading, loadError, refreshShipments, getShipmentContainers: (shipmentId) => containerRepository.getForShipment(shipmentId), getContainerDetails, handleContainerScan: (value, shipmentId) => receiptService.handleContainerScan(value, currentUser, shipmentId), confirmReceipt: async (container) => {
    const result = await receiptService.confirmContainerReceipt(container, currentUser)
    if (result.kind === 'SUCCESS') await refreshShipments()
    return result
  } }}>{children}</AppContext.Provider>
}