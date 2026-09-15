import { useReceiptApp } from '../state/useReceiptApp'

export function SuccessPage({ containerId, onDone }: { containerId: string; onDone: () => void }) {
  const { shipments } = useReceiptApp()
  const shipment = shipments.find((item) => item.shipmentId === containerId)
  return <main className="success-page"><div className="success-mark">✓</div><p className="eyebrow">Receipt confirmed</p><h1>Container received</h1><p>{containerId} has been recorded and queued for product receipt processing.</p>{shipment && <small>{shipment.purchaseOrder}</small>}<button className="primary-action" onClick={onDone}>Return to shipments</button></main>
}