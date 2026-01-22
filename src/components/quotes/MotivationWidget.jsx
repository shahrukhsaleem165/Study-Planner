import React from 'react'
import { useMotivationQuote } from '../../hooks/useMotivationQuotes'

function MotivationWidget() {
  const quote = useMotivationQuote()

  return (
    <div
      className="card"
      style={{
        background:
          'radial-gradient(circle at top right, rgba(56,189,248,0.16), rgba(15,23,42,1))',
      }}
    >
      <p className="section-title" style={{ marginBottom: 6 }}>
        Today&apos;s prompt
      </p>
      <p style={{ fontSize: 14, marginBottom: 6 }}>&ldquo;{quote.text}&rdquo;</p>
      <p style={{ fontSize: 12, color: '#9ca3af' }}>— {quote.author}</p>
    </div>
  )
}

export default MotivationWidget

