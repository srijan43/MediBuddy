import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { PatientDashboardPage } from './pages/PatientDashboardPage'
import { DoctorDashboardPage } from './pages/DoctorDashboardPage'
import { SymptomCheckerPage } from './pages/SymptomCheckerPage'
import { BookAppointmentPage } from './pages/BookAppointmentPage'
import { ProfilePage } from './pages/ProfilePage'
import { useAuth } from './state/auth'

export default function App() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<LandingPage />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/dashboard" replace /> : <SignupPage />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {user?.role === 'doctor' ? (
                <DoctorDashboardPage />
              ) : (
                <PatientDashboardPage />
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/symptoms"
          element={
            <ProtectedRoute role="patient">
              <SymptomCheckerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments/book"
          element={
            <ProtectedRoute role="patient">
              <BookAppointmentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
