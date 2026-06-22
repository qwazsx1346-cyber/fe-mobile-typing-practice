import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { practiceApi } from '../api/client'
import TabBar from '../components/TabBar'

export default function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [ranking, setRanking] = useState([])

  useEffect(() => {
    if (user) {
      practiceApi.stats().then(r => setStats(r.data)).catch(() => {})
      practiceApi.ranking(user.region).then(r => setRanking(r.data.slice(0, 3))).catch(() => {})
    } else {
      practiceApi.ranking().then(r => setRanking(r.data.slice(0, 3))).catch(() => {})
    }
  }, [user])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? '좋은 아침이에요' : hour < 18 ? '안녕하세요' : '좋은 저녁이에요'

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 16px' }}>
        {/* 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-sub)', fontWeight: 600 }}>{greeting} 👋</p>
            <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>
              {user ? user.nickname : '게스트'}님
            </h1>
          </div>
          {user && (
            <div style={{
              background: 'var(--primary-50)', border: '1px solid var(--primary-50-border)',
              borderRadius: 12, padding: '6px 12px', fontSize: 12, fontWeight: 700, color: 'var(--primary)',
            }}>Lv.{user.level}</div>
          )}
        </div>

        {/* 오늘의 연습 CTA */}
        <button onClick={() => navigate('/practice/category')}
          style={{
            width: '100%', background: 'var(--primary-grad)', borderRadius: 20, padding: 20,
            color: '#fff', textAlign: 'left', marginBottom: 16,
            boxShadow: '0 10px 22px rgba(213,97,63,0.24)',
          }}>
          <p style={{ fontSize: 12, fontWeight: 600, opacity: 0.85, marginBottom: 4 }}>오늘의 연습</p>
          <p style={{ fontSize: 20, fontWeight: 800 }}>타자 연습 시작하기 ⚡</p>
          <p style={{ fontSize: 12, fontWeight: 600, opacity: 0.75, marginTop: 4 }}>WPM을 측정하고 실력을 키워보세요</p>
        </button>

        {/* 내 통계 (로그인 시) */}
        {stats && (
          <div className="card" style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 800, marginBottom: 12 }}>내 실력</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: '평균 WPM', value: Math.round(stats.avgWpm || 0) },
                { label: '최고 WPM', value: stats.maxWpm || 0 },
                { label: '평균 정확도', value: `${Math.round(stats.avgAccuracy || 0)}%` },
                { label: '총 연습', value: `${stats.totalSessions}회` },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--bg)', borderRadius: 12, padding: '10px 12px' }}>
                  <p style={{ fontSize: 11, color: 'var(--text-sub)', fontWeight: 600 }}>{s.label}</p>
                  <p style={{ fontSize: 20, fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: 'var(--text-main)' }}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 지역 랭킹 */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <p style={{ fontSize: 13, fontWeight: 800 }}>
              {user?.region ? `${user.region} 랭킹` : '전국 랭킹'} 🏆
            </p>
            <button onClick={() => navigate('/compete')}
              style={{ background: 'none', fontSize: 12, color: 'var(--primary)', fontWeight: 700 }}>전체보기</button>
          </div>
          {ranking.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, textAlign: 'center', padding: '8px 0' }}>아직 기록이 없어요</p>
          ) : ranking.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0',
              borderBottom: i < ranking.length - 1 ? '1px solid var(--card-border)' : 'none' }}>
              <span style={{ fontSize: 18, width: 28, textAlign: 'center' }}>
                {['🥇','🥈','🥉'][i]}
              </span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 700 }}>{r.nickname}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{r.region}</p>
              </div>
              <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--primary)', fontVariantNumeric: 'tabular-nums' }}>{r.wpm} WPM</p>
            </div>
          ))}
        </div>

        {/* 빠른 실행 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button onClick={() => navigate('/practice/offline')}
            className="card" style={{ textAlign: 'left', padding: 14 }}>
            <span style={{ fontSize: 24, display: 'block', marginBottom: 6 }}>📡</span>
            <p style={{ fontSize: 13, fontWeight: 700 }}>오프라인 연습</p>
            <p style={{ fontSize: 11, color: 'var(--text-sub)', fontWeight: 600, marginTop: 2 }}>인터넷 없이도 OK</p>
          </button>
          <button onClick={() => navigate('/stats')}
            className="card" style={{ textAlign: 'left', padding: 14 }}>
            <span style={{ fontSize: 24, display: 'block', marginBottom: 6 }}>📈</span>
            <p style={{ fontSize: 13, fontWeight: 700 }}>내 통계</p>
            <p style={{ fontSize: 11, color: 'var(--text-sub)', fontWeight: 600, marginTop: 2 }}>실력 성장 확인</p>
          </button>
        </div>

        {!user && (
          <div style={{
            marginTop: 16, background: 'linear-gradient(150deg,#2E2722,#1C1A18)',
            borderRadius: 18, padding: 18, color: '#fff',
          }}>
            <p style={{ fontSize: 13, fontWeight: 800, marginBottom: 6 }}>🔒 로그인하면 더 많은 기능이!</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 600, marginBottom: 14 }}>
              기록 저장, 랭킹 참여, 도전 과제, 캐릭터 커스터마이징
            </p>
            <button onClick={() => navigate('/login')}
              style={{ background: 'var(--primary-grad)', color: '#fff', fontWeight: 700, fontSize: 14,
                padding: '10px 20px', borderRadius: 12, boxShadow: '0 6px 16px rgba(213,97,63,0.3)' }}>
              로그인 / 회원가입
            </button>
          </div>
        )}
      </div>
      <TabBar />
    </div>
  )
}
