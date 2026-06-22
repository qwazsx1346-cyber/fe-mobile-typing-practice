import { useNavigate } from 'react-router-dom'
import ScreenHeader from '../components/ScreenHeader'

const CATEGORIES = [
  { id: 'DAILY', icon: '☀️', label: '일상', desc: '쉬운 일상 문장' },
  { id: 'BUSINESS', icon: '💼', label: '업무', desc: '비즈니스 표현' },
  { id: 'NEWS', icon: '📰', label: '뉴스', desc: '시사 & 뉴스' },
  { id: 'QUOTE', icon: '💬', label: '명언', desc: '영감을 주는 글귀' },
  { id: 'NUMBER', icon: '🔢', label: '숫자·특수', desc: '숫자와 특수문자' },
]

const GAME_MODES = [
  { id: 'speed', icon: '⚡', label: '스피드 타이핑', desc: '1분/3분 제한 시간' },
  { id: 'fall', icon: '🌧', label: '단어 낙하', desc: '떨어지는 단어를 쳐라' },
  { id: 'tug', icon: '🤝', label: '줄다리기', desc: '1:1 대전 모드' },
]

export default function CategoryPage() {
  const navigate = useNavigate()
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title="연습 선택" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 32px' }}>
        <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-sub)', marginBottom: 10 }}>카테고리</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
          {CATEGORIES.map(c => (
            <button key={c.id} className="card"
              onClick={() => navigate('/practice/typing', { state: { category: c.id } })}
              style={{ textAlign: 'left', padding: 14 }}>
              <span style={{ fontSize: 26, display: 'block', marginBottom: 6 }}>{c.icon}</span>
              <p style={{ fontSize: 14, fontWeight: 700 }}>{c.label}</p>
              <p style={{ fontSize: 11, color: 'var(--text-sub)', fontWeight: 600, marginTop: 2 }}>{c.desc}</p>
            </button>
          ))}
        </div>

        <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-sub)', marginBottom: 10 }}>게임 모드</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {GAME_MODES.map(g => (
            <button key={g.id} className="card"
              onClick={() => navigate(`/game/${g.id}`)}
              style={{ display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left' }}>
              <span style={{ fontSize: 28, flexShrink: 0 }}>{g.icon}</span>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700 }}>{g.label}</p>
                <p style={{ fontSize: 12, color: 'var(--text-sub)', fontWeight: 600, marginTop: 2 }}>{g.desc}</p>
              </div>
              <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: 18 }}>›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
