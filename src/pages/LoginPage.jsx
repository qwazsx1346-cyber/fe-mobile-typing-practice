import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import ScreenHeader from '../components/ScreenHeader'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/home')
    } catch (err) {
      setError(err.response?.data?.message || '로그인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title="로그인" />
      <form onSubmit={submit} style={{ flex: 1, padding: '24px 24px 32px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-sub)', display: 'block', marginBottom: 6 }}>이메일</label>
          <input className="input-field" type="email" placeholder="이메일 입력" value={form.email} onChange={set('email')} required />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-sub)', display: 'block', marginBottom: 6 }}>비밀번호</label>
          <input className="input-field" type="password" placeholder="비밀번호 입력" value={form.password} onChange={set('password')} required />
        </div>

        {error && <p style={{ color: '#e53e3e', fontSize: 13, fontWeight: 600 }}>{error}</p>}

        <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: 8 }}>
          {loading ? '로그인 중...' : '로그인'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0' }}>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--card-border)' }} />
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>또는</span>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--card-border)' }} />
        </div>

        <button type="button"
          style={{
            background: '#FEE500', color: '#3A2929', fontWeight: 700,
            fontSize: 15, padding: 15, borderRadius: 14, width: '100%',
          }}>
          카카오로 로그인
        </button>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-sub)', fontWeight: 600, marginTop: 8 }}>
          계정이 없으신가요?{' '}
          <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 700 }}>회원가입</Link>
        </p>
      </form>
    </div>
  )
}
