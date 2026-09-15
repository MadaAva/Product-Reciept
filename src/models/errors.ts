export type ReceiptErrorCode =
  | 'CONTAINER_NOT_FOUND'
  | 'WRONG_STORE'
  | 'WRONG_LEGAL_ENTITY'
  | 'ALREADY_RECEIVED'
  | 'LOAD_FAILED'
  | 'PRODUCT_RECEIPT_FAILED'

export interface ReceiptError {
  code: ReceiptErrorCode
  message: string
}

export type ReceiptResult =
  | { kind: 'SUCCESS'; confirmationId: string }
  | { kind: 'ERROR'; error: ReceiptError }

export type ScanResult =
  | { kind: 'VALID'; containerId: string; shipmentId: string }
  | { kind: 'ERROR'; error: ReceiptError }

export const receiptMessages: Record<ReceiptErrorCode, string> = {
  CONTAINER_NOT_FOUND: 'This container could not be found. Check the barcode and try again.',
  WRONG_STORE: 'This container belongs to a different store and cannot be received here.',
  WRONG_LEGAL_ENTITY: 'This container belongs to a different legal entity.',
  ALREADY_RECEIVED: 'This container has already been received for this shipment.',
  LOAD_FAILED: 'We could not load this information. Please try again.',
  PRODUCT_RECEIPT_FAILED: 'Receipt confirmation could not be completed. Please try again.',
}