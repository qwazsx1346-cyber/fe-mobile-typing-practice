import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import OnboardingPage from './pages/OnboardingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import TypingPage from './pages/TypingPage'
import StatsPage from './pages/StatsPage'
import CompetePage from './pages/CompetePage'
import ProfilePage from './pages/ProfilePage'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<OnboardingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/practice/category" element={<CategoryPage />} />
        <Route path="/practice/typing" element={<TypingPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/compete" element={<CompetePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
