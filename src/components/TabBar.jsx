import { useNavigate, useLocation } from 'react-router-dom'

const tabs = [
  { path: '/home', icon: '🏠', label: '홈' },
  { path: '/stats', icon: '📊', label: '통계' },
  { path: '/compete', icon: '🏆', label: '경쟁' },
  { path: '/profile', icon: '👤', label: '프로필' },
]

export default function TabBar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav style={{
      display: 'flex', background: '#fff',
      borderTop: '1px solid var(--card-border)',
      paddingBottom: 'env(safe-area-inset-bottom)',
      height: 74, flexShrink: 0,
    }}>
      {tabs.map(t => {
        const active = pathname.startsWith(t.path)
        return (
          <button key={t.path} onClick={() => navigate(t.path)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 3,
              background: 'none', fontSize: 10, fontWeight: 600,
              color: active ? 'var(--primary)' : 'var(--text-muted)',
            }}>
            <span style={{ fontSize: 22 }}>{t.icon}</span>
            {t.label}
          </button>
        )
      })}
    </nav>
  )
}
