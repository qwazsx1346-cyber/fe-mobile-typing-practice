import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { practiceApi } from '../api/client'
import TabBar from '../components/TabBar'

export default function CompetePage() {
  const { user } = useAuth()
  const [tab, setTab] = useState('national')
  const [ranking, setRanking] = useState([])

  useEffect(() => {
    const region = tab === 'region' ? user?.region : null
    practiceApi.ranking(region).then(r => setRanking(r.data)).catch(() => {})
  }, [tab, user])

  const myRank = user ? ranking.findIndex(r => r.nickname === user.nickname) + 1 : -1

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 20px 0', fontWeight: 800, fontSize: 22 }}>경쟁 & 랭킹</div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 16px' }}>
        {/* 탭 */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {[['national','전국'],['region','지역']].map(([val,label]) => (
            <button key={val} onClick={() => setTab(val)}
              style={{
                padding: '7px 20px', borderRadius: 99, fontSize: 12, fontWeight: 700,
                background: tab === val ? 'var(--primary)' : 'var(--primary-50)',
                color: tab === val ? '#fff' : 'var(--text-sub)',
                border: '1px solid', borderColor: tab === val ? 'transparent' : 'var(--primary-50-border)',
              }}>{label}</button>
          ))}
        </div>

        {tab === 'region' && !user && (
          <div className="card" style={{ textAlign: 'center', padding: 24, marginBottom: 16 }}>
            <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>🔒 로그인이 필요합니다</p>
            <p style={{ fontSize: 12, color: 'var(--text-sub)', fontWeight: 600 }}>지역 랭킹은 회원만 이용할 수 있어요</p>
          </div>
        )}

        {/* 시상대 */}
        {ranking.length >= 3 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 10, marginBottom: 20 }}>
            {[1, 0, 2].map(idx => {
              const r = ranking[idx]
              const heights = ['80px', '100px', '60px']
              return (
                <div key={idx} style={{ textAlign: 'center', flex: 1 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, marginBottom: 4, color: 'var(--text-sub)' }}>{r.nickname}</p>
                  <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--primary)', marginBottom: 4, fontVariantNumeric: 'tabular-nums' }}>{r.wpm} WPM</p>
                  <div style={{
                    height: heights[idx === 0 ? 1 : idx === 1 ? 0 : 2],
                    background: ['#D7A24B','var(--primary-grad)','#9A8F84'][idx === 0 ? 1 : idx === 1 ? 0 : 2],
                    borderRadius: '10px 10px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24,
                  }}>{['🥇','🥈','🥉'][idx === 0 ? 1 : idx === 1 ? 0 : 2]}</div>
                </div>
              )
            })}
          </div>
        )}

        {/* 순위 리스트 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ranking.slice(3).map((r, i) => (
            <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-muted)', width: 28, textAlign: 'center' }}>{i + 4}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 700 }}>{r.nickname}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{r.region}</p>
              </div>
              <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums' }}>{r.wpm} WPM</p>
            </div>
          ))}
        </div>

        {/* 내 순위 */}
        {myRank > 0 && (
          <div style={{
            position: 'sticky', bottom: 0, margin: '16px -20px -16px',
            background: 'linear-gradient(150deg,#2E2722,#1C1A18)', padding: '14px 20px', color: '#fff',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--dark-orange)' }}>#{myRank}</span>
            <span style={{ flex: 1, fontSize: 13, fontWeight: 700 }}>나 ({user?.nickname})</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--dark-orange)', fontVariantNumeric: 'tabular-nums' }}>
              {ranking[myRank - 1]?.wpm} WPM
            </span>
          </div>
        )}
      </div>
      <TabBar />
    </div>
  )
}
