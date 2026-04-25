import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Home from './pages/Home'
import Booking from './pages/Booking'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Navbar from './components/Navbar'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('kaflix_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData) => {
    localStorage.setItem('kaflix_user', JSON.stringify(userData))
    setUser(userData)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF1493] border-t-transparent"></div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F5F5F5]">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Home />} />
          <Route path="/news" element={<Home />} />
          <Route path="/contact" element={<Home />} />
          <Route path="/booking/:roomId" element={<Booking />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/admin" element={user?.isAdmin ? <Admin /> : <Navigate to="/login" />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}