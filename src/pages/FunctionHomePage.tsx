import apparelDisplayImage from '../assets/retail/apparel-display.jpg'

export function FunctionHomePage({ onProductReceiptOpen }: { onProductReceiptOpen: () => void }) {
  return <main className="function-home">
    <header className="function-home-header">
      <p className="eyebrow">Store operations</p>
      <h1>What do you need to do?</h1>
      <p>Select a function to begin.</p>
    </header>
    <section className="function-list" aria-label="Available store functions">
      <button className="function-tile" onClick={onProductReceiptOpen}>
        <img className="function-image" src={apparelDisplayImage} alt="Clothing display in a retail store" />
        <span className="function-copy"><strong>Product receipt</strong><small>Receive containers and confirm incoming goods</small></span>
        <span className="chevron" aria-hidden="true">&#8250;</span>
      </button>
    </section>
  </main>
}