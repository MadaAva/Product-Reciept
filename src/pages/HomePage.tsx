import type { ShipmentWithStatus } from '../models/domain'
import { StatusBadge } from '../components/StatusBadge'
import { ErrorState, LoadingState } from '../components/LoadingState'
import { useReceiptApp } from '../state/useReceiptApp'

export function HomePage({ onShipmentOpen, onHistoryOpen, onFunctionsOpen }: { onShipmentOpen: (shipment: ShipmentWithStatus) => void; onHistoryOpen: () => void; onFunctionsOpen: () => void }) {
  const { store, shipments, loading, loadError, refreshShipments } = useReceiptApp()
  if (loading) return <LoadingState />
  if (loadError || !store) return <ErrorState message="Incoming shipments could not be loaded." onRetry={() => void refreshShipments()} />
  const grouped = shipments.reduce<Record<string, ShipmentWithStatus[]>>((groups, shipment) => ({ ...groups, [shipment.shipDate]: [...(groups[shipment.shipDate] ?? []), shipment] }), {})
  return <>
    <section className="store-banner"><button className="banner-close-button" onClick={onFunctionsOpen} aria-label="Return to functions" title="Return to functions">&times;</button><span>Receiving at</span><strong>{store.name}</strong><small>{store.storeNumber} · {store.legalEntity} · {store.warehouse}</small></section>
    <div className="page-title"><div><p className="eyebrow">Incoming goods</p><h1>Shipments</h1></div><div className="page-actions"><button className="text-button" onClick={onHistoryOpen}>History</button></div></div>
    {Object.entries(grouped).sort(([first], [second]) => second.localeCompare(first)).map(([date, dateShipments]) => <section className="shipment-group" key={date}><h2>{new Date(`${date}T12:00:00`).toLocaleDateString('en-SE', { weekday: 'long', day: 'numeric', month: 'long' })}</h2>{dateShipments.map((shipment) => <button className="shipment-card" key={shipment.shipmentId} onClick={() => onShipmentOpen(shipment)}><div className="card-top"><span className="dc-label">{shipment.fromDC}</span><StatusBadge status={shipment.status} /></div><strong>{shipment.purchaseOrder}</strong><span className="shipment-id">{shipment.shipmentId}</span><div className="receipt-progress"><span>{shipment.receivedContainers} of {shipment.totalContainers} containers</span><span>{Math.round((shipment.receivedContainers / shipment.totalContainers) * 100)}%</span></div><div className="progress-track"><span style={{ width: `${(shipment.receivedContainers / shipment.totalContainers) * 100}%` }} /></div></button>)}</section>)}
  </>
}