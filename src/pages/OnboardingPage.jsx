import { useNavigate } from 'react-router-dom'

export default function OnboardingPage() {
  const navigate = useNavigate()
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '48px 24px 32px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20, margin: '0 auto 16px',
          background: 'var(--primary-grad)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: 36, boxShadow: '0 10px 22px rgba(213,97,63,0.24)',
        }}>⌨️</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>타닥</h1>
        <p style={{ color: 'var(--text-sub)', fontSize: 14, fontWeight: 600 }}>한글 타자 연습 & 지역 경쟁</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
        {[
          { icon: '⚡', title: '실시간 WPM 측정', desc: '타이핑할 때마다 속도와 정확도가 즉시 표시됩니다' },
          { icon: '📊', title: '성장 분석', desc: '오타 패턴, 향상 그래프로 나의 실력을 파악하세요' },
          { icon: '🏆', title: '지역 랭킹 경쟁', desc: '동네 친구들과 실력을 겨뤄보세요' },
        ].map(item => (
          <div key={item.title} className="card" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 24, flexShrink: 0 }}>{item.icon}</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-sub)', fontWeight: 600, lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="btn-primary" onClick={() => navigate('/home')}>게스트로 시작</button>
        <button className="btn-secondary" onClick={() => navigate('/login')}>로그인</button>
      </div>
    </div>
  )
}
