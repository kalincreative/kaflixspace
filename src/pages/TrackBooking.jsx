import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Calendar, Clock, MapPin, CheckCircle, XCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import { getBookingsByEmail } from '../lib/supabase'

export default function TrackBooking() {
  const [email, setEmail] = useState('')
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')

  const handleTrack = async (e) => {
    e.preventDefault()
    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }
    
    setError('')
    setLoading(true)
    setSearched(true)
    
    try {
      const results = await getBookingsByEmail(email.trim())
      setBookings(results)
    } catch (err) {
      console.error('Error fetching bookings:', err)
      setError('Failed to fetch bookings. Please try again.')
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    }
    const icons = {
      pending: AlertCircle,
      approved: CheckCircle,
      rejected: XCircle,
    }
    const Icon = icons[status] || AlertCircle
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="min-h-screen pt-20 bg-neutral-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-700 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-neutral-900 mb-3">Track Your Reservation</h1>
          <p className="text-neutral-500">Enter your email to view your booking history</p>
        </div>

        <form onSubmit={handleTrack} className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your Corporate Email"
                className={`w-full px-5 py-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#FF1493]/50 text-lg ${error ? 'border-red-500' : 'border-neutral-200'}`}
              />
              {error && <p className="text-red-500 text-sm mt-2 text-left">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-[#FF1493] hover:bg-[#D9117F] text-white rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Track
                </>
              )}
            </button>
          </div>
        </form>

        {!searched && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-neutral-300" />
            </div>
            <p className="text-neutral-500">Enter your email to see your booking history</p>
          </div>
        )}

        {searched && !loading && bookings.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-neutral-300" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-700 mb-2">No bookings found</h3>
            <p className="text-neutral-500">We couldn't find any reservations for this email address</p>
          </div>
        )}

        {bookings.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-neutral-700 mb-4">
              Found {bookings.length} reservation{bookings.length !== 1 ? 's' : ''}
            </h2>
            {bookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-neutral-900 text-lg">{booking.space_name}</h3>
                    <div className="flex items-center gap-2 text-neutral-500 mt-1">
                      <MapPin className="w-4 h-4" />
                      <span>{booking.location || 'N/A'}</span>
                    </div>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-neutral-400" />
                    <span className="text-sm text-neutral-600">{formatDate(booking.booking_date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-neutral-400" />
                    <span className="text-sm text-neutral-600">{booking.time_range || 'N/A'}</span>
                  </div>
                </div>

                {(booking.usage_hours || booking.total_booking_hours) && (
                  <div className="bg-neutral-50 rounded-lg px-3 py-2 mb-4">
                    <p className="text-xs text-neutral-500">
                      {booking.usage_hours || 0} Hour{booking.usage_hours !== 1 ? 's' : ''} Usage + {booking.prep_hours || 1} Hour Prep
                      = <span className="font-medium text-neutral-700">{booking.total_booking_hours || 0} hrs</span> Total Booking
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-neutral-100">
                  <div>
                    <span className="text-sm text-neutral-500">Total</span>
                    <p className="text-2xl font-bold text-neutral-900">RM{booking.total_price}</p>
                  </div>
                  {booking.status === 'pending' && (
                    <Link
                      to="/contact"
                      className="text-sm text-pink-500 hover:text-pink-600 font-medium"
                    >
                      Need help?
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}