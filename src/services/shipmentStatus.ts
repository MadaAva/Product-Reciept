import type { ShipmentStatus } from '../models/domain'

export function calculateShipmentStatus(totalContainers: number, confirmedContainerCount: number): ShipmentStatus {
  if (confirmedContainerCount <= 0) return 'NotReceived'
  if (confirmedContainerCount >= totalContainers) return 'Received'
  return 'PartiallyReceived'
}