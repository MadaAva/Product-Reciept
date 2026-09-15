import type { ConfirmedContainer, Container, ContainerLine, PowerActionSync, Shipment, Store } from '../models/domain'

export interface StoreRepository {
  getByStoreNumber(storeNumber: string): Promise<Store | undefined>
}

export interface ShipmentRepository {
  getForStore(storeNumber: string, legalEntity: string): Promise<Shipment[]>
  getById(shipmentId: string): Promise<Shipment | undefined>
}

export interface ContainerRepository {
  getForShipment(shipmentId: string): Promise<Container[]>
  getById(containerId: string): Promise<Container | undefined>
  getLines(containerId: string): Promise<ContainerLine[]>
}

export interface ConfirmedContainerRepository {
  getForShipment(shipmentId: string): Promise<ConfirmedContainer[]>
  exists(containerId: string, shipmentId: string): Promise<boolean>
  create(confirmation: ConfirmedContainer): Promise<ConfirmedContainer>
}

export interface PowerActionRepository {
  create(action: PowerActionSync): Promise<PowerActionSync>
  getAll(): Promise<PowerActionSync[]>
}