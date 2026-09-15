import { useEffect, useState } from 'react'
import { ErrorState, LoadingState } from '../components/LoadingState'
import { ScreenHeader } from '../components/ScreenHeader'
import { ContainerTypeBadge } from '../components/ContainerTypeBadge'
import type { ContainerDetails } from '../models/domain'
import type { ReceiptError } from '../models/errors'
import { useReceiptApp } from '../state/useReceiptApp'

export function ContainerPage({ containerId, onBack, onSuccess }: { containerId: string; onBack: () => void; onSuccess: (containerId: string) => void }) {
  const { getContainerDetails, confirmReceipt } = useReceiptApp()
  const [details, setDetails] = useState<ContainerDetails>()
  const [error, setError] = useState<ReceiptError>()
  const [confirming, setConfirming] = useState(false)
  useEffect(() => { void getContainerDetails(containerId).then(setDetails) }, [containerId, getContainerDetails])
  if (!details) return <LoadingState />
  const total = details.lines.reduce((sum, line) => sum + line.quantity, 0)
  const confirm = async () => { setConfirming(true); setError(undefined); const result = await confirmReceipt(details.container); setConfirming(false); if (result.kind === 'SUCCESS') onSuccess(containerId); else setError(result.error) }
  return <><ScreenHeader title="Container" subtitle={details.container.containerId} onBack={onBack} /><main className="container-page"><section className="detail-block"><ContainerTypeBadge container={details.container} /><dl><div><dt>Shipment</dt><dd>{details.container.shipmentId}</dd></div><div><dt>Purchase order</dt><dd>{details.container.purchaseOrder}</dd></div><div><dt>Distribution center</dt><dd>{details.container.fromDC}</dd></div></dl>{details.container.onlineOrderId && <div className="online-callout"><strong>Click & Collect parcel</strong><span>Online order: {details.container.onlineOrderId}</span><span>SSCC: {details.container.ssccId}</span></div>}</section><section className="products"><div className="products-heading"><h2>Products</h2><strong>{total} units</strong></div>{details.lines.map((line) => <article key={line.id} className="product-line"><div><strong>{line.productName}</strong><span>{line.itemNumber} · {line.colorwayLong}</span><span>Size {line.size}</span></div><b>{line.quantity}</b></article>)}</section>{error && <ErrorState message={error.message} />}{details.isReceived ? <div className="received-banner">This container has already been received.</div> : <button className="primary-action fixed-action" disabled={confirming} onClick={() => void confirm()}>{confirming ? 'Confirming...' : 'Confirm receipt'}</button>}</main></>
}