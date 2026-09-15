export function LoadingState() { return <div className="loading-state"><span className="spinner" />Loading receipt information...</div> }

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return <div className="error-state"><strong>Unable to continue</strong><p>{message}</p>{onRetry && <button className="secondary-button" onClick={onRetry}>Try again</button>}</div>
}