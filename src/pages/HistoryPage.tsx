import { ScreenHeader } from '../components/ScreenHeader'
import { StatusBadge } from '../components/StatusBadge'
import { useReceiptApp } from '../state/useReceiptApp'

export function HistoryPage({ onBack, onShipmentOpen }: { onBack: () => void; onShipmentOpen: (shipmentId: string) => void }) {
  const { shipments } = useReceiptApp()
  const history = shipments.filter((shipment) => shipment.status === 'Received' || shipment.shipDate < '2026-09-15')
  return <><ScreenHeader title="Receipt history" subtitle="Previously received and in-progress shipments" onBack={onBack} /><main className="history-list">{history.map((shipment) => <button key={shipment.shipmentId} className="history-item" onClick={() => onShipmentOpen(shipment.shipmentId)}><div><strong>{shipment.purchaseOrder}</strong><span>{shipment.shipmentId} · {shipment.shipDate}</span></div><StatusBadge status={shipment.status} /><span className="chevron">&#8250;</span></button>)}</main></>
}