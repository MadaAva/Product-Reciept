import type { Container } from '../models/domain'

export function ContainerTypeBadge({ container }: { container: Container }) {
  if (container.onlineOrderId) return <span className="container-type container-type-online">Click &amp; Collect</span>
  return <span className="container-type container-type-store">Store replenishment</span>
}