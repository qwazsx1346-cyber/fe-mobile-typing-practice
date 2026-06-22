import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import TabBar from '../components/TabBar'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => { logout(); navigate('/') }

  if (!user) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 20px 0', fontWeight: 800, fontSize: 22 }}>프로필</div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 20px', gap: 12 }}>
        <button className="btn-primary" onClick={() => navigate('/login')}>로그인</button>
        <button className="btn-secondary" onClick={() => navigate('/signup')}>회원가입</button>
      </div>
      <TabBar />
    </div>
  )

  const expNeeded = Math.pow(user.level, 2) * 100
  const expProgress = Math.min((user.exp / expNeeded) * 100, 100)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* 히어로 */}
        <div style={{
          background: 'linear-gradient(150deg,#2E2722,#1C1A18)',
          padding: '52px 20px 28px', color: '#fff',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%', fontSize: 32,
              background: 'var(--primary-grad)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>⌨️</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 20, fontWeight: 800 }}>{user.nickname}</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{user.email}</p>
            </div>
            <div style={{
              background: 'var(--primary-grad)', borderRadius: 12,
              padding: '6px 12px', fontSize: 13, fontWeight: 800,
            }}>Lv.{user.level}</div>
          </div>
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600,
              color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>
              <span>경험치</span><span>{user.exp} / {expNeeded} XP</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 3 }}>
              <div style={{ height: '100%', width: `${expProgress}%`, background: 'var(--primary-grad)', borderRadius: 3 }} />
            </div>
          </div>
        </div>

        {/* 정보 섹션 */}
        <div style={{ padding: '20px 20px 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card">
            <p style={{ fontSize: 13, fontWeight: 800, marginBottom: 12 }}>계정 정보</p>
            {[
              { label: '이메일', value: user.email },
              { label: '닉네임', value: user.nickname },
              { label: '지역', value: user.region || '미설정' },
              { label: '포인트', value: `${user.points?.toLocaleString() || 0} P` },
            ].map(item => (
              <div key={item.label} style={{
                display: 'flex', justifyContent: 'space-between', padding: '10px 0',
                borderBottom: '1px solid var(--card-border)', fontSize: 13,
              }}>
                <span style={{ color: 'var(--text-sub)', fontWeight: 600 }}>{item.label}</span>
                <span style={{ fontWeight: 700 }}>{item.value}</span>
              </div>
            ))}
          </div>

          <button onClick={handleLogout} style={{
            padding: 16, borderRadius: 14, background: 'none',
            border: '1.5px solid var(--card-border)', color: '#e53e3e',
            fontSize: 15, fontWeight: 700, width: '100%',
          }}>로그아웃</button>
        </div>
      </div>
      <TabBar />
    </div>
  )
}
