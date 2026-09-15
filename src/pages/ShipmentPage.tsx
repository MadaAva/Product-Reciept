import { useEffect, useState } from 'react'
import { ErrorState, LoadingState } from '../components/LoadingState'
import { ScreenHeader } from '../components/ScreenHeader'
import { ContainerTypeBadge } from '../components/ContainerTypeBadge'
import type { Container, ShipmentWithStatus } from '../models/domain'
import { useReceiptApp } from '../state/useReceiptApp'

export function ShipmentPage({ shipment, onBack, onScan, onContainerOpen }: { shipment: ShipmentWithStatus; onBack: () => void; onScan: () => void; onContainerOpen: (containerId: string) => void }) {
  const { getShipmentContainers, getContainerDetails } = useReceiptApp()
  const [containers, setContainers] = useState<Container[]>([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const load = async () => { setLoading(true); setFailed(false); try { setContainers(await getShipmentContainers(shipment.shipmentId)) } catch { setFailed(true) } finally { setLoading(false) } }
  useEffect(() => {
    let current = true
    void getShipmentContainers(shipment.shipmentId).then((result) => { if (current) setContainers(result) }).catch(() => { if (current) setFailed(true) }).finally(() => { if (current) setLoading(false) })
    return () => { current = false }
  }, [getShipmentContainers, shipment.shipmentId])
  if (loading) return <LoadingState />
  if (failed) return <ErrorState message="Container information could not be loaded." onRetry={() => void load()} />
  return <><ScreenHeader title={shipment.purchaseOrder} subtitle={`${shipment.shipmentId} · ${shipment.fromDC}`} onBack={onBack} /><section className="summary-strip"><div><span>Ship date</span><strong>{shipment.shipDate}</strong></div><div><span>Receipt</span><strong>{shipment.receivedContainers}/{shipment.totalContainers}</strong></div></section><div className="container-list"><h2>Containers</h2>{containers.map((container) => <ContainerRow key={container.containerId} container={container} getReceived={getContainerDetails} onOpen={onContainerOpen} />)}</div><button className="primary-action fixed-action" onClick={onScan}><span>Scan</span> container</button></>
}

function ContainerRow({ container, getReceived, onOpen }: { container: Container; getReceived: (containerId: string) => Promise<{ isReceived: boolean } | undefined>; onOpen: (containerId: string) => void }) {
  const [received, setReceived] = useState(false)
  useEffect(() => { void getReceived(container.containerId).then((details) => setReceived(details?.isReceived ?? false)) }, [container.containerId, getReceived])
  return <button className={`container-row ${received ? 'is-received' : ''}`} onClick={() => onOpen(container.containerId)}><span className="container-check">{received ? '✓' : ''}</span><span><strong>{container.containerId}</strong><span className="container-row-meta"><ContainerTypeBadge container={container} />{container.onlineOrderId && <small>{container.onlineOrderId}</small>}</span></span><span className="chevron">&#8250;</span></button>
}