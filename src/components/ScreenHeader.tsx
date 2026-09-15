export function ScreenHeader({ title, subtitle, onBack, action }: { title: string; subtitle?: string; onBack?: () => void; action?: React.ReactNode }) {
  return <header className="screen-header">
    <div className="header-title">
      {onBack && <button className="icon-button" onClick={onBack} aria-label="Go back">&#8592;</button>}
      <div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>
    </div>
    {action}
  </header>
}