import type { AppUser, ConfirmedContainer, Container, PowerActionSync } from '../models/domain'
import type { ReceiptResult, ScanResult } from '../models/errors'
import { receiptMessages } from '../models/errors'
import type { ConfirmedContainerRepository, ContainerRepository, PowerActionRepository, ShipmentRepository } from '../repositories/interfaces'
import type { Logger } from './logger'

export interface ReceiptService {
  handleContainerScan(scannedValue: string, user: AppUser, expectedShipmentId?: string): Promise<ScanResult>
  confirmContainerReceipt(container: Container, user: AppUser): Promise<ReceiptResult>
}

export class DefaultReceiptService implements ReceiptService {
  private readonly containers: ContainerRepository
  private readonly shipments: ShipmentRepository
  private readonly confirmations: ConfirmedContainerRepository
  private readonly actions: PowerActionRepository
  private readonly logger: Logger

  constructor(
    containers: ContainerRepository,
    shipments: ShipmentRepository,
    confirmations: ConfirmedContainerRepository,
    actions: PowerActionRepository,
    logger: Logger,
  ) {
    this.containers = containers
    this.shipments = shipments
    this.confirmations = confirmations
    this.actions = actions
    this.logger = logger
  }

  async handleContainerScan(scannedValue: string, user: AppUser, expectedShipmentId?: string): Promise<ScanResult> {
    const normalized = scannedValue.trim().toUpperCase().replace(/\s+/g, '')
    this.logger.info('container scan', { value: normalized })
    const container = await this.containers.getById(normalized)
    const validation = await this.validate(container, user, expectedShipmentId)
    if (validation) return validation
    if (!container) return this.error('CONTAINER_NOT_FOUND')
    return { kind: 'VALID', containerId: container.containerId, shipmentId: container.shipmentId }
  }

  async confirmContainerReceipt(container: Container, user: AppUser): Promise<ReceiptResult> {
    const validation = await this.validate(container, user)
    if (validation) return validation
    if (await this.confirmations.exists(container.containerId, container.shipmentId)) {
      return this.error('ALREADY_RECEIVED')
    }
    try {
      // Production repositories make confirmation and integration enqueue atomic server-side.
      const confirmation: ConfirmedContainer = { id: crypto.randomUUID(), containerId: container.containerId, shipmentId: container.shipmentId, purchaseOrder: container.purchaseOrder, storeNumber: user.storeNumber, legalEntity: user.legalEntity, confirmedAt: new Date().toISOString(), confirmedBy: user.id }
      await this.confirmations.create(confirmation)
      const action: PowerActionSync = { id: crypto.randomUUID(), name: 'Product receipt', companyCode: user.legalEntity, powerActionRunId: crypto.randomUUID(), powerAction: 'KAPowerActionPurchProductReceiptService', input: { purchaseOrder: container.purchaseOrder, containerId: container.containerId, shipmentId: container.shipmentId, storeNumber: user.storeNumber, legalEntity: user.legalEntity }, processingStatus: 'Pending', retryCount: 0, createdAt: confirmation.confirmedAt }
      await this.actions.create(action)
      this.logger.info('receipt confirmation', { containerId: container.containerId, shipmentId: container.shipmentId })
      this.logger.info('Power Action creation', { actionId: action.id })
      return { kind: 'SUCCESS', confirmationId: confirmation.id }
    } catch {
      this.logger.error('unexpected receipt error', { containerId: container.containerId })
      return this.error('PRODUCT_RECEIPT_FAILED')
    }
  }

  private async validate(container: Container | undefined, user: AppUser, expectedShipmentId?: string): Promise<{ kind: 'ERROR'; error: { code: keyof typeof receiptMessages; message: string } } | undefined> {
    if (!container) return this.error('CONTAINER_NOT_FOUND')
    if (container.storeNumber !== user.storeNumber) return this.error('WRONG_STORE')
    if (container.legalEntity !== user.legalEntity) return this.error('WRONG_LEGAL_ENTITY')
    if (expectedShipmentId && container.shipmentId !== expectedShipmentId) return this.error('CONTAINER_NOT_FOUND')
    if (!await this.shipments.getById(container.shipmentId)) return this.error('CONTAINER_NOT_FOUND')
    return undefined
  }

  private error(code: keyof typeof receiptMessages): { kind: 'ERROR'; error: { code: keyof typeof receiptMessages; message: string } } {
    this.logger.warn('validation failure', { code })
    return { kind: 'ERROR', error: { code, message: receiptMessages[code] } }
  }
}