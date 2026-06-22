import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { practiceApi } from '../api/client'
import ScreenHeader from '../components/ScreenHeader'

const SENTENCES = {
  DAILY: [
    '오늘 날씨가 정말 맑고 화창합니다.',
    '아침에 커피 한 잔 마시며 하루를 시작했습니다.',
    '친구와 함께 점심을 먹으러 나갔습니다.',
    '저녁에는 가족과 함께 영화를 보았습니다.',
    '주말에는 공원에서 산책을 즐겼습니다.',
  ],
  BUSINESS: [
    '이번 프로젝트의 일정을 조율해야 합니다.',
    '회의 결과를 팀원들과 공유하겠습니다.',
    '고객 만족도를 높이기 위한 방안을 검토 중입니다.',
    '보고서를 작성하여 내일까지 제출해 주세요.',
    '업무 효율을 높이기 위해 프로세스를 개선했습니다.',
  ],
  NEWS: [
    '정부는 새로운 경제 정책을 발표했습니다.',
    '기술 혁신이 산업 전반에 변화를 가져오고 있습니다.',
    '환경 보호를 위한 국제 협약이 체결되었습니다.',
    '스타트업 생태계가 빠르게 성장하고 있습니다.',
    '디지털 전환이 기업 경쟁력의 핵심이 되었습니다.',
  ],
  QUOTE: [
    '작은 시작이 위대한 결말을 만듭니다.',
    '오늘 할 수 있는 일을 내일로 미루지 마세요.',
    '실패는 성공으로 가는 디딤돌입니다.',
    '꾸준함이 재능을 이깁니다.',
    '배움에는 끝이 없습니다.',
  ],
  NUMBER: [
    '전화번호는 010-1234-5678입니다.',
    '가격은 총 29,800원이며 할인율은 15%입니다.',
    '회의실 예약 번호: A-302 (3층)',
    '비밀번호는 영문+숫자 조합 8자 이상입니다.',
    '좌표: 37.5665° N, 126.9780° E',
  ],
}

export default function TypingPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { user } = useAuth()
  const category = state?.category || 'DAILY'

  const [sentences] = useState(() => {
    const list = [...(SENTENCES[category] || SENTENCES.DAILY)]
    return list.sort(() => Math.random() - 0.5)
  })
  const [index, setIndex] = useState(0)
  const [input, setInput] = useState('')
  const [startTime, setStartTime] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [typoCount, setTypoCount] = useState(0)
  const [done, setDone] = useState(false)
  const [results, setResults] = useState([])
  const inputRef = useRef(null)
  const timerRef = useRef(null)

  const current = sentences[index] || ''

  useEffect(() => {
    inputRef.current?.focus()
    return () => clearInterval(timerRef.current)
  }, [])

  useEffect(() => {
    if (startTime && !done) {
      timerRef.current = setInterval(() => {
        const sec = (Date.now() - startTime) / 1000
        setElapsed(sec)
        const chars = results.reduce((s, r) => s + r.sentence.length, 0) + input.length
        setWpm(Math.round((chars / 5) / (sec / 60)))
      }, 300)
    }
    return () => clearInterval(timerRef.current)
  }, [startTime, done, input, results])

  const handleInput = e => {
    const val = e.target.value
    if (!startTime) setStartTime(Date.now())
    setInput(val)

    let typos = 0
    for (let i = 0; i < val.length; i++) {
      if (val[i] !== current[i]) typos++
    }
    const correct = val.length - typos
    setAccuracy(val.length > 0 ? Math.round((correct / val.length) * 100) : 100)
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      if (input.trim() === '') return
      const typos = [...input].filter((c, i) => c !== current[i]).length
      setTypoCount(t => t + typos)
      setResults(r => [...r, { sentence: current, input, typos }])

      if (index + 1 >= sentences.length) {
        clearInterval(timerRef.current)
        setDone(true)
        if (user && startTime) {
          const totalDuration = Math.round((Date.now() - startTime) / 1000)
          const totalChars = [...results, { sentence: current }].reduce((s, r) => s + r.sentence.length, 0)
          const finalWpm = Math.round((totalChars / 5) / (totalDuration / 60))
          practiceApi.save({
            wpm: finalWpm, accuracy, duration: totalDuration,
            typoCount: typoCount + typos, type: 'SHORT', category,
          }).catch(() => {})
        }
      } else {
        setIndex(i => i + 1)
        setInput('')
        setAccuracy(100)
      }
    }
  }

  const renderSentence = () => current.split('').map((ch, i) => {
    let color = 'var(--text-dim)'
    if (i < input.length) color = input[i] === ch ? 'var(--green)' : '#e53e3e'
    else if (i === input.length) color = 'var(--primary)'
    return (
      <span key={i} style={{
        color, fontWeight: 600,
        borderBottom: i === input.length ? '2px solid var(--primary)' : 'none',
      }}>{ch}</span>
    )
  })

  if (done) {
    const totalSec = Math.round(elapsed)
    const mins = Math.floor(totalSec / 60)
    const secs = totalSec % 60
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ScreenHeader title="연습 결과" onBack={() => navigate('/home')} />
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
            <h2 style={{ fontSize: 22, fontWeight: 800 }}>연습 완료!</h2>
          </div>
          <div style={{
            background: 'linear-gradient(150deg,#2E2722,#1C1A18)',
            borderRadius: 20, padding: 20, marginBottom: 16, color: '#fff',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, textAlign: 'center' }}>
              {[
                { label: 'WPM', value: wpm },
                { label: '정확도', value: `${accuracy}%` },
                { label: '소요', value: `${mins}:${String(secs).padStart(2,'0')}` },
              ].map(s => (
                <div key={s.label}>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: 4 }}>{s.label}</p>
                  <p style={{ fontSize: 24, fontWeight: 800, color: '#F4A07C', fontVariantNumeric: 'tabular-nums' }}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>
          {!user && (
            <div className="card" style={{ marginBottom: 16, borderColor: 'var(--primary-50-border)', background: 'var(--primary-50)', textAlign: 'center' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 6 }}>기록을 저장하려면 로그인하세요!</p>
              <button onClick={() => navigate('/login')} className="btn-primary" style={{ padding: '10px 0' }}>로그인</button>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="btn-primary" onClick={() => navigate(0)}>다시 연습하기</button>
            <button className="btn-secondary" onClick={() => navigate('/home')}>홈으로</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={`${index + 1} / ${sentences.length}`} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 20px 24px', gap: 14 }}>
        {/* 실시간 지표 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[
            { label: 'WPM', value: wpm, color: 'var(--primary)' },
            { label: '정확도', value: `${accuracy}%`, color: 'var(--green)' },
            { label: '진행', value: `${index}/${sentences.length}`, color: 'var(--text-sub)' },
          ].map(s => (
            <div key={s.label} className="card" style={{ textAlign: 'center', padding: '10px 8px' }}>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 2 }}>{s.label}</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: s.color, fontVariantNumeric: 'tabular-nums' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* 진행바 */}
        <div style={{ height: 4, background: 'var(--card-border)', borderRadius: 4 }}>
          <div style={{ height: '100%', background: 'var(--primary-grad)', borderRadius: 4, width: `${(index / sentences.length) * 100}%`, transition: 'width 0.3s' }} />
        </div>

        {/* 제시 문장 */}
        <div className="card" style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.55, letterSpacing: '-0.01em', minHeight: 80 }}>
          {renderSentence()}
        </div>

        {/* 입력창 */}
        <div style={{ position: 'relative' }}>
          <input
            ref={inputRef}
            className="input-field"
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="여기에 입력하세요 (Enter로 다음 문장)"
            style={{ fontSize: 16, paddingRight: 44 }}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </div>

        <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textAlign: 'center' }}>
          Enter 키를 눌러 다음 문장으로 넘어가세요
        </p>
      </div>
    </div>
  )
}
