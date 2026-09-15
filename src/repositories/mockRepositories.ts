import { confirmedContainers, containerLines, containers, powerActionSyncs, stores } from '../data/mockData'
import type { ConfirmedContainer, Container, ContainerLine, PowerActionSync, Shipment, Store } from '../models/domain'
import type { ConfirmedContainerRepository, ContainerRepository, PowerActionRepository, ShipmentRepository, StoreRepository } from './interfaces'

const delay = () => Promise.resolve()

export class MockStoreRepository implements StoreRepository {
  async getByStoreNumber(storeNumber: string): Promise<Store | undefined> {
    await delay()
    return stores.find((store) => store.storeNumber === storeNumber)
  }
}

export class MockShipmentRepository implements ShipmentRepository {
  private readonly confirmations: ConfirmedContainerRepository

  constructor(confirmations: ConfirmedContainerRepository) {
    this.confirmations = confirmations
  }

  async getForStore(storeNumber: string, legalEntity: string): Promise<Shipment[]> {
    await delay()
    const matchingContainers = containers.filter((container) => container.storeNumber === storeNumber && container.legalEntity === legalEntity)
    const shipmentIds = [...new Set(matchingContainers.map((container) => container.shipmentId))]
    return Promise.all(shipmentIds.map((shipmentId) => this.toShipment(shipmentId)))
  }

  async getById(shipmentId: string): Promise<Shipment | undefined> {
    await delay()
    return containers.some((container) => container.shipmentId === shipmentId) ? this.toShipment(shipmentId) : undefined
  }

  private async toShipment(shipmentId: string): Promise<Shipment> {
    const shipmentContainers = containers.filter((container) => container.shipmentId === shipmentId)
    const confirmed = await this.confirmations.getForShipment(shipmentId)
    const first = shipmentContainers[0]
    return { shipmentId, storeNumber: first.storeNumber, legalEntity: first.legalEntity, fromDC: first.fromDC, shipDate: first.shipDate, purchaseOrder: first.purchaseOrder, purchaseCategory: first.purchaseCategory, totalContainers: shipmentContainers.length, receivedContainers: confirmed.length }
  }
}

export class MockContainerRepository implements ContainerRepository {
  async getForShipment(shipmentId: string): Promise<Container[]> { await delay(); return containers.filter((container) => container.shipmentId === shipmentId) }
  async getById(containerId: string): Promise<Container | undefined> { await delay(); return containers.find((container) => container.containerId === containerId) }
  async getLines(containerId: string): Promise<ContainerLine[]> { await delay(); return containerLines.filter((line) => line.containerId === containerId) }
}

export class MockConfirmedContainerRepository implements ConfirmedContainerRepository {
  private readonly records = [...confirmedContainers]

  async getForShipment(shipmentId: string): Promise<ConfirmedContainer[]> { await delay(); return this.records.filter((record) => record.shipmentId === shipmentId) }
  async exists(containerId: string, shipmentId: string): Promise<boolean> { await delay(); return this.records.some((record) => record.containerId === containerId && record.shipmentId === shipmentId) }
  async create(confirmation: ConfirmedContainer): Promise<ConfirmedContainer> { await delay(); this.records.push(confirmation); return confirmation }
}

export class MockPowerActionRepository implements PowerActionRepository {
  private readonly records = [...powerActionSyncs]

  async create(action: PowerActionSync): Promise<PowerActionSync> { await delay(); this.records.push(action); return action }
  async getAll(): Promise<PowerActionSync[]> { await delay(); return [...this.records] }
}