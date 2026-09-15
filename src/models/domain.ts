export type ShipmentStatus = 'NotReceived' | 'PartiallyReceived' | 'Received'

export interface Store {
  id: string
  storeNumber: string
  name: string
  legalEntity: string
  country: string
  warehouse: string
  active: boolean
}

export interface AppUser {
  id: string
  email: string
  name: string
  storeNumber: string
  legalEntity: string
  role: string
}

export interface Shipment {
  shipmentId: string
  storeNumber: string
  legalEntity: string
  fromDC: string
  shipDate: string
  purchaseOrder: string
  purchaseCategory: string
  totalContainers: number
  receivedContainers: number
}

export interface Container {
  containerId: string
  shipmentId: string
  storeNumber: string
  legalEntity: string
  fromDC: string
  shipDate: string
  purchaseOrder: string
  purchaseCategory: string
  onlineOrderId?: string
  ssccId?: string
}

export interface ContainerLine {
  id: string
  containerId: string
  shipmentId: string
  purchaseOrder: string
  lineNumber: number
  itemNumber: string
  productName: string
  colorwayLong: string
  size: string
  quantity: number
  onlineOrderId?: string
  ssccId?: string
  legalEntity: string
}

export interface ConfirmedContainer {
  id: string
  containerId: string
  shipmentId: string
  purchaseOrder: string
  storeNumber: string
  legalEntity: string
  confirmedAt: string
  confirmedBy: string
}

export interface PowerActionSync {
  id: string
  name: string
  companyCode: string
  powerActionRunId: string
  powerAction: 'KAPowerActionPurchProductReceiptService'
  input: ProductReceiptRequest
  processingStatus: 'Pending' | 'Processing' | 'Completed' | 'Failed'
  retryCount: number
  errorMessage?: string
  createdAt: string
}

export interface ProductReceiptRequest {
  purchaseOrder: string
  containerId: string
  shipmentId: string
  storeNumber: string
  legalEntity: string
}

export interface ShipmentWithStatus extends Shipment {
  status: ShipmentStatus
}

export interface ContainerDetails {
  container: Container
  lines: ContainerLine[]
  isReceived: boolean
}

export interface OnlineParcelGroup {
  onlineOrderId: string
  ssccId: string
  containers: Container[]
}