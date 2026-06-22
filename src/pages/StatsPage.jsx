import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { practiceApi } from '../api/client'
import TabBar from '../components/TabBar'
import ScreenHeader from '../components/ScreenHeader'

export default function StatsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [history, setHistory] = useState([])
  const [period, setPeriod] = useState('week')

  useEffect(() => {
    if (!user) return
    practiceApi.stats().then(r => setStats(r.data)).catch(() => {})
    practiceApi.history(period).then(r => setHistory(r.data)).catch(() => {})
  }, [user, period])

  if (!user) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title="통계" onBack={() => navigate('/home')} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <span style={{ fontSize: 48, marginBottom: 16 }}>📊</span>
        <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>로그인이 필요합니다</p>
        <p style={{ fontSize: 13, color: 'var(--text-sub)', fontWeight: 600, textAlign: 'center', marginBottom: 20 }}>
          통계와 기록 분석은 로그인 후 이용할 수 있어요
        </p>
        <button className="btn-primary" style={{ maxWidth: 200 }} onClick={() => navigate('/login')}>로그인</button>
      </div>
      <TabBar />
    </div>
  )

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 20px 0', fontWeight: 800, fontSize: 22 }}>통계 & 분석</div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 16px' }}>
        {/* 기간 탭 */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[['week','주간'],['month','월간'],['all','전체']].map(([val,label]) => (
            <button key={val} onClick={() => setPeriod(val)}
              style={{
                padding: '7px 16px', borderRadius: 99, fontSize: 12, fontWeight: 700,
                background: period === val ? 'var(--primary)' : 'var(--primary-50)',
                color: period === val ? '#fff' : 'var(--text-sub)',
                border: '1px solid',
                borderColor: period === val ? 'transparent' : 'var(--primary-50-border)',
              }}>{label}</button>
          ))}
        </div>

        {/* 스탯 카드 */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            {[
              { label: '평균 타속', value: `${Math.round(stats.avgWpm || 0)}`, unit: 'WPM' },
              { label: '최고 타속', value: stats.maxWpm || 0, unit: 'WPM' },
              { label: '평균 정확도', value: `${Math.round(stats.avgAccuracy || 0)}`, unit: '%' },
              { label: '총 연습 횟수', value: stats.totalSessions, unit: '회' },
            ].map(s => (
              <div key={s.label} className="card">
                <p style={{ fontSize: 11, color: 'var(--text-sub)', fontWeight: 600, marginBottom: 4 }}>{s.label}</p>
                <p style={{ fontSize: 26, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
                  {s.value}<span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginLeft: 2 }}>{s.unit}</span>
                </p>
              </div>
            ))}
          </div>
        )}

        {/* 최근 기록 */}
        <p style={{ fontSize: 13, fontWeight: 800, marginBottom: 10 }}>최근 연습 기록</p>
        {history.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 32 }}>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 600 }}>이 기간의 기록이 없어요</p>
            <button className="btn-primary" style={{ marginTop: 16, padding: '10px 0' }}
              onClick={() => navigate('/practice/category')}>연습 시작하기</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {history.map(h => (
              <div key={h.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 700 }}>{h.type} / {h.category || '—'}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
                    {new Date(h.createdAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)', fontVariantNumeric: 'tabular-nums' }}>{h.wpm} WPM</p>
                  <p style={{ fontSize: 11, color: 'var(--green)', fontWeight: 600 }}>{Math.round(h.accuracy)}%</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <TabBar />
    </div>
  )
}
