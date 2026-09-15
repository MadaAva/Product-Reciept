import type { ShipmentStatus } from '../models/domain'

export function StatusBadge({ status }: { status: ShipmentStatus }) {
  const text = status === 'NotReceived' ? 'Not received' : status === 'PartiallyReceived' ? 'Partially received' : 'Received'
  return <span className={`status status-${status}`}>{text}</span>
}