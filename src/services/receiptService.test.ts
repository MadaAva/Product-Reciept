import { describe, expect, it } from 'vitest'
import { containers, currentUser, powerActionSyncs } from '../data/mockData'
import { MockConfirmedContainerRepository, MockContainerRepository, MockPowerActionRepository, MockShipmentRepository } from '../repositories/mockRepositories'
import type { Logger } from './logger'
import { DefaultReceiptService } from './receiptService'
import { calculateShipmentStatus } from './shipmentStatus'

const logger: Logger = { info: () => undefined, warn: () => undefined, error: () => undefined }

function createService() {
  const confirmations = new MockConfirmedContainerRepository()
  const actions = new MockPowerActionRepository()
  const service = new DefaultReceiptService(new MockContainerRepository(), new MockShipmentRepository(confirmations), confirmations, actions, logger)
  return { service, actions }
}

describe('shipment status calculation', () => {
  it('derives statuses from unique confirmed container counts', () => {
    expect(calculateShipmentStatus(4, 0)).toBe('NotReceived')
    expect(calculateShipmentStatus(4, 2)).toBe('PartiallyReceived')
    expect(calculateShipmentStatus(4, 4)).toBe('Received')
  })
})

describe('receipt process', () => {
  it('rejects a container that belongs to another store', async () => {
    const { service } = createService()
    const wrongStore = containers.find((container) => container.storeNumber === '1002')!
    const result = await service.handleContainerScan(wrongStore.containerId, currentUser)
    expect(result).toMatchObject({ kind: 'ERROR', error: { code: 'WRONG_STORE' } })
  })

  it('returns already received without creating another Power Action', async () => {
    const { service, actions } = createService()
    const alreadyReceived = containers[4]
    const before = (await actions.getAll()).length
    const result = await service.confirmContainerReceipt(alreadyReceived, currentUser)
    expect(result).toMatchObject({ kind: 'ERROR', error: { code: 'ALREADY_RECEIVED' } })
    expect((await actions.getAll()).length).toBe(before)
  })

  it('confirms an unreceived container once and queues one Power Action', async () => {
    const { service, actions } = createService()
    const unreceived = containers[0]
    const before = (await actions.getAll()).length
    const result = await service.confirmContainerReceipt(unreceived, currentUser)
    expect(result.kind).toBe('SUCCESS')
    expect((await actions.getAll()).length).toBe(before + 1)
    const duplicate = await service.confirmContainerReceipt(unreceived, currentUser)
    expect(duplicate).toMatchObject({ kind: 'ERROR', error: { code: 'ALREADY_RECEIVED' } })
    expect((await actions.getAll()).length).toBe(before + 1)
  })
})

describe('mock dataset scenarios', () => {
  it('provides the intended operational test data', () => {
    expect(containers).toHaveLength(40)
    expect(containers.filter((container) => container.onlineOrderId)).toHaveLength(11)
    expect(powerActionSyncs.some((action) => action.processingStatus === 'Failed')).toBe(true)
    expect(containers.filter((container) => container.purchaseOrder === 'PO-SE-450081')).toHaveLength(4)
  })
})