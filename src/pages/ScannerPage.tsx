import { useState } from 'react'
import { ScreenHeader } from '../components/ScreenHeader'
import type { ReceiptError } from '../models/errors'
import { useReceiptApp } from '../state/useReceiptApp'

export function ScannerPage({ shipmentId, onBack, onValidScan }: { shipmentId?: string; onBack: () => void; onValidScan: (containerId: string) => void }) {
  const { handleContainerScan } = useReceiptApp()
  const [value, setValue] = useState('')
  const [error, setError] = useState<ReceiptError>()
  const [scanning, setScanning] = useState(false)
  const scan = async () => { if (!value.trim()) return; setScanning(true); setError(undefined); const result = await handleContainerScan(value, shipmentId); setScanning(false); if (result.kind === 'VALID') onValidScan(result.containerId); else setError(result.error) }
  return <><ScreenHeader title="Scan container" subtitle={shipmentId ? `For shipment ${shipmentId}` : 'Receive an incoming container'} onBack={onBack} /><main className="scanner-page"><div className="barcode-frame"><span className="scan-line" /><span>Barcode scanner ready</span></div><label htmlFor="barcode">Container barcode</label><input id="barcode" autoFocus value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void scan() }} placeholder="Enter or scan container ID" />{error && <div className="inline-error"><strong>{error.code === 'WRONG_STORE' ? 'Wrong store' : 'Scan unavailable'}</strong><p>{error.message}</p></div>}<button className="primary-action" disabled={scanning || !value.trim()} onClick={() => void scan()}>{scanning ? 'Validating...' : 'Validate container'}</button><p className="scanner-hint">Manual entry is available in this development build.</p></main></>
}