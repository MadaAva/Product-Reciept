import type { AppUser, ConfirmedContainer, Container, ContainerLine, PowerActionSync, Store } from '../models/domain'

export const stores: Store[] = [
  { id: 'store-1001', storeNumber: '1001', name: 'Stockholm City', legalEntity: 'SE01', country: 'SE', warehouse: 'STO-01', active: true },
  { id: 'store-1002', storeNumber: '1002', name: 'Gothenburg Nordstan', legalEntity: 'SE01', country: 'SE', warehouse: 'GOT-01', active: true },
  { id: 'store-2001', storeNumber: '2001', name: 'Oslo Sentrum', legalEntity: 'NO01', country: 'NO', warehouse: 'OSL-01', active: true },
  { id: 'store-3001', storeNumber: '3001', name: 'Copenhagen Fields', legalEntity: 'DK01', country: 'DK', warehouse: 'CPH-01', active: true },
]

export const currentUser: AppUser = {
  id: 'user-anna-lind', email: 'anna.lind@contoso-retail.example', name: 'Anna Lind', storeNumber: '1001', legalEntity: 'SE01', role: 'Store Receiver',
}

type ShipmentSeed = { shipmentId: string; storeNumber: string; legalEntity: string; fromDC: string; shipDate: string; purchaseOrder: string; purchaseCategory: string; containers: number; online?: boolean }

const shipmentSeeds: ShipmentSeed[] = [
  { shipmentId: 'SHP-SE-240901', storeNumber: '1001', legalEntity: 'SE01', fromDC: 'DC Malmo', shipDate: '2026-09-15', purchaseOrder: 'PO-SE-450081', purchaseCategory: 'Autumn apparel', containers: 4 },
  { shipmentId: 'SHP-SE-240902', storeNumber: '1001', legalEntity: 'SE01', fromDC: 'DC Boras', shipDate: '2026-09-15', purchaseOrder: 'PO-SE-450082', purchaseCategory: 'Footwear', containers: 3, online: true },
  { shipmentId: 'SHP-SE-240903', storeNumber: '1001', legalEntity: 'SE01', fromDC: 'DC Malmo', shipDate: '2026-09-14', purchaseOrder: 'PO-SE-450083', purchaseCategory: 'Accessories', containers: 5 },
  { shipmentId: 'SHP-SE-240904', storeNumber: '1001', legalEntity: 'SE01', fromDC: 'DC Boras', shipDate: '2026-09-13', purchaseOrder: 'PO-SE-450084', purchaseCategory: 'Online fulfilment', containers: 4, online: true },
  { shipmentId: 'SHP-SE-240905', storeNumber: '1002', legalEntity: 'SE01', fromDC: 'DC Malmo', shipDate: '2026-09-15', purchaseOrder: 'PO-SE-450085', purchaseCategory: 'Menswear', containers: 3 },
  { shipmentId: 'SHP-SE-240906', storeNumber: '1002', legalEntity: 'SE01', fromDC: 'DC Boras', shipDate: '2026-09-14', purchaseOrder: 'PO-SE-450086', purchaseCategory: 'Sportswear', containers: 3 },
  { shipmentId: 'SHP-NO-240907', storeNumber: '2001', legalEntity: 'NO01', fromDC: 'DC Oslo', shipDate: '2026-09-15', purchaseOrder: 'PO-NO-630021', purchaseCategory: 'Outerwear', containers: 4 },
  { shipmentId: 'SHP-NO-240908', storeNumber: '2001', legalEntity: 'NO01', fromDC: 'DC Oslo', shipDate: '2026-09-14', purchaseOrder: 'PO-NO-630022', purchaseCategory: 'Online fulfilment', containers: 3, online: true },
  { shipmentId: 'SHP-DK-240909', storeNumber: '3001', legalEntity: 'DK01', fromDC: 'DC Kolding', shipDate: '2026-09-15', purchaseOrder: 'PO-DK-720031', purchaseCategory: 'Womenswear', containers: 3 },
  { shipmentId: 'SHP-DK-240910', storeNumber: '3001', legalEntity: 'DK01', fromDC: 'DC Kolding', shipDate: '2026-09-13', purchaseOrder: 'PO-DK-720032', purchaseCategory: 'Home', containers: 3 },
  { shipmentId: 'SHP-SE-240911', storeNumber: '1001', legalEntity: 'SE01', fromDC: 'DC Malmo', shipDate: '2026-09-12', purchaseOrder: 'PO-SE-450087', purchaseCategory: 'Denim', containers: 3 },
  { shipmentId: 'SHP-SE-240912', storeNumber: '1001', legalEntity: 'SE01', fromDC: 'DC Boras', shipDate: '2026-09-11', purchaseOrder: 'PO-SE-450088', purchaseCategory: 'Online fulfilment', containers: 2, online: true },
]

const products = [
  ['TSH-100', 'Essential Crew T-Shirt', 'Ocean Blue', 'S'], ['TSH-101', 'Essential Crew T-Shirt', 'Ocean Blue', 'M'],
  ['JKT-220', 'Lightweight Field Jacket', 'Moss Green', 'M'], ['JKT-221', 'Lightweight Field Jacket', 'Moss Green', 'L'],
  ['SNE-310', 'Runner Classic', 'Cloud White', '42'], ['SNE-311', 'Runner Classic', 'Cloud White', '43'],
  ['BAG-410', 'Canvas Weekender', 'Charcoal', 'One Size'], ['CAP-510', 'Structured Cap', 'Brick Red', 'One Size'],
  ['JNS-610', 'Straight Fit Denim', 'Indigo Rinse', '30/32'], ['JNS-611', 'Straight Fit Denim', 'Indigo Rinse', '32/32'],
] as const

export const containers: Container[] = shipmentSeeds.flatMap((shipment) =>
  Array.from({ length: shipment.containers }, (_, index) => {
    const sequence = String(index + 1).padStart(2, '0')
    const onlineOrderId = shipment.online && index < 3 ? `WEB-${shipment.shipmentId.slice(-3)}-${String(index + 1).padStart(3, '0')}` : undefined
    return {
      containerId: `CNT-${shipment.shipmentId.slice(4, 6)}-${shipment.shipmentId.slice(-6)}-${sequence}`,
      shipmentId: shipment.shipmentId, storeNumber: shipment.storeNumber, legalEntity: shipment.legalEntity,
      fromDC: shipment.fromDC, shipDate: shipment.shipDate, purchaseOrder: shipment.purchaseOrder, purchaseCategory: shipment.purchaseCategory,
      onlineOrderId, ssccId: onlineOrderId ? `003735000${shipment.shipmentId.slice(-3)}${sequence}` : undefined,
    }
  }),
)

export const containerLines: ContainerLine[] = containers.flatMap((container, containerIndex) =>
  Array.from({ length: 2 + (containerIndex % 2) }, (_, lineIndex) => {
    const product = products[(containerIndex + lineIndex) % products.length]
    return {
      id: `LINE-${container.containerId}-${lineIndex + 1}`, containerId: container.containerId, shipmentId: container.shipmentId,
      purchaseOrder: container.purchaseOrder, lineNumber: lineIndex + 1, itemNumber: product[0], productName: product[1],
      colorwayLong: product[2], size: product[3], quantity: 4 + ((containerIndex + lineIndex) % 8),
      onlineOrderId: container.onlineOrderId, ssccId: container.ssccId, legalEntity: container.legalEntity,
    }
  }),
)

const confirmedIndexes = new Set([4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19])
export const confirmedContainers: ConfirmedContainer[] = containers
  .filter((_, index) => confirmedIndexes.has(index))
  .map((container, index) => ({
    id: `CONF-${String(index + 1).padStart(3, '0')}`, containerId: container.containerId, shipmentId: container.shipmentId,
    purchaseOrder: container.purchaseOrder, storeNumber: container.storeNumber, legalEntity: container.legalEntity,
    confirmedAt: `2026-09-${String(10 + (index % 5)).padStart(2, '0')}T09:${String(10 + index).padStart(2, '0')}:00.000Z`, confirmedBy: 'user-anna-lind',
  }))

export const powerActionSyncs: PowerActionSync[] = confirmedContainers.slice(0, 5).map((confirmation, index) => ({
  id: `SYNC-${String(index + 1).padStart(3, '0')}`, name: 'Product receipt', companyCode: confirmation.legalEntity,
  powerActionRunId: `run-mock-${index + 1}`, powerAction: 'KAPowerActionPurchProductReceiptService',
  input: { purchaseOrder: confirmation.purchaseOrder, containerId: confirmation.containerId, shipmentId: confirmation.shipmentId, storeNumber: confirmation.storeNumber, legalEntity: confirmation.legalEntity },
  processingStatus: index === 3 ? 'Failed' : index === 4 ? 'Completed' : 'Pending', retryCount: index === 3 ? 2 : 0,
  errorMessage: index === 3 ? 'D365FO endpoint unavailable. Retry scheduled.' : undefined, createdAt: confirmation.confirmedAt,
}))