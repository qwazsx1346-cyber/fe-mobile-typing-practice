import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import ScreenHeader from '../components/ScreenHeader'

const REGIONS = ['서울','부산','대구','인천','광주','대전','울산','세종','경기','강원','충북','충남','전북','전남','경북','경남','제주']

export default function SignupPage() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', passwordConfirm: '', nickname: '', region: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setError('')
    if (form.password !== form.passwordConfirm) { setError('비밀번호가 일치하지 않습니다.'); return }
    if (form.password.length < 8) { setError('비밀번호는 8자 이상이어야 합니다.'); return }
    setLoading(true)
    try {
      await signup(form.email, form.password, form.nickname, form.region || null)
      navigate('/home')
    } catch (err) {
      setError(err.response?.data?.message || '회원가입에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ label, children }) => (
    <div>
      <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-sub)', display: 'block', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  )

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title="회원가입" />
      <form onSubmit={submit} style={{ flex: 1, padding: '16px 24px 32px', display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>
        <Field label="이메일">
          <input className="input-field" type="email" placeholder="이메일 입력" value={form.email} onChange={set('email')} required />
        </Field>
        <Field label="비밀번호 (8자 이상)">
          <input className="input-field" type="password" placeholder="비밀번호 입력" value={form.password} onChange={set('password')} required />
        </Field>
        <Field label="비밀번호 확인">
          <input className="input-field" type="password" placeholder="비밀번호 재입력" value={form.passwordConfirm} onChange={set('passwordConfirm')} required />
        </Field>
        <Field label="닉네임 (2~20자)">
          <input className="input-field" placeholder="닉네임 입력" value={form.nickname} onChange={set('nickname')} required minLength={2} maxLength={20} />
        </Field>
        <Field label="지역 (선택)">
          <select className="input-field" value={form.region} onChange={set('region')}
            style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\'%3E%3Cpath d=\'M1 1l5 5 5-5\' stroke=\'%23857B70\' stroke-width=\'1.5\' fill=\'none\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}>
            <option value="">지역 선택 (선택사항)</option>
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>

        {error && <p style={{ color: '#e53e3e', fontSize: 13, fontWeight: 600 }}>{error}</p>}

        <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: 8 }}>
          {loading ? '가입 중...' : '회원가입'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-sub)', fontWeight: 600 }}>
          이미 계정이 있으신가요?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>로그인</Link>
        </p>
      </form>
    </div>
  )
}
