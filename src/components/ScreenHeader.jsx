import { useNavigate } from 'react-router-dom'

export default function ScreenHeader({ title, onBack, dark, right }) {
  const navigate = useNavigate()
  const handleBack = onBack || (() => navigate(-1))

  return (
    <header style={{
      display: 'flex', alignItems: 'center', height: 52,
      padding: '0 8px', flexShrink: 0,
      color: dark ? '#fff' : 'var(--text-main)',
    }}>
      <button onClick={handleBack}
        style={{
          background: 'none', width: 40, height: 40,
          fontSize: 22, color: 'inherit', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>‹</button>
      <span style={{ flex: 1, textAlign: 'center', fontSize: 17, fontWeight: 700 }}>{title}</span>
      <div style={{ width: 40 }}>{right}</div>
    </header>
  )
}
