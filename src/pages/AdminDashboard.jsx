import { useState, useEffect, useMemo } from 'react'
import { LayoutDashboard, Calendar, ChevronDown, Users, Home, Wallet, TrendingUp, CheckCircle, XCircle, LogOut, CreditCard, BarChart3, CalendarDays, Loader2, ChevronLeft, ChevronRight, CalendarRange } from 'lucide-react'
import { supabase, getBookings, updateBookingStatus as supabaseUpdateStatus } from '../lib/supabase'

const sidebarLinks = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { id: 'all-bookings', label: 'All Bookings', icon: Calendar, path: '/admin/bookings' },
  { id: 'calendar', label: 'Calendar View', icon: CalendarDays, path: '/admin/calendar' },
  { id: 'clients', label: 'Clients', icon: Users, path: '/admin/clients' },
  { id: 'spaces', label: 'Spaces', icon: Home, path: '/admin/spaces' },
  { id: 'payment', label: 'Payment', icon: CreditCard, path: '/admin/finance/payment' },
  { id: 'report', label: 'Report', icon: BarChart3, path: '/admin/finance/report' },
]

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeLink, setActiveLink] = useState('all-bookings')
  const [openDropdowns, setOpenDropdowns] = useState({ bookings: true, finance: false })
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const data = await getBookings()
      setBookings(data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleDropdown = (dropdown) => {
    setOpenDropdowns(prev => ({ ...prev, [dropdown]: !prev[dropdown] }))
  }

  const updateStatus = async (id, newStatus) => {
    try {
      await supabaseUpdateStatus(id, newStatus)
      setBookings(bookings.map(booking => 
        booking.id === id ? { ...booking, status: newStatus } : booking
      ))
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    
    const days = []
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    return days
  }

  const getBookingsForDate = (date) => {
    if (!date) return []
    const dateStr = date.toISOString().split('T')[0]
    return bookings.filter(b => {
      const bookingDate = b.booking_date ? b.booking_date.split('T')[0] : b.booking_date
      return bookingDate === dateStr
    })
  }

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const pendingCount = bookings.filter(b => b.status === 'pending').length
  const totalRevenue = bookings
    .filter(b => b.status === 'approved')
    .reduce((acc, b) => acc + parseFloat(b.total_price || b.price || 0), 0)

  const stats = useMemo(() => [
    { label: 'Total Bookings', value: bookings.length, icon: Calendar },
    { label: 'Pending Requests', value: pendingCount, icon: Calendar },
    { label: 'Total Revenue', value: `RM ${totalRevenue.toLocaleString()}`, icon: Wallet },
  ], [bookings, pendingCount, totalRevenue])

  const MenuItem = ({ item }) => {
    const isActive = activeLink === item.id
    return (
      <button
        onClick={() => setActiveLink(item.id)}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors ${
          isActive ? 'bg-pink-50 text-pink-600 font-medium border-l-2 border-pink-500' : 'text-neutral-600 hover:bg-neutral-100'
        }`}
      >
        <div className="flex items-center gap-3">
          <item.icon className="w-4 h-4" />
          <span className="text-sm">{item.label}</span>
        </div>
      </button>
    )
  }

  const DropdownItem = ({ item }) => {
    const isActive = activeLink === item.id
    return (
      <button
        onClick={() => setActiveLink(item.id)}
        className={`w-full flex items-center gap-3 pl-10 pr-4 py-2 rounded-lg transition-colors ${
          isActive ? 'bg-pink-50 text-pink-600 font-medium' : 'text-neutral-500 hover:bg-neutral-100'
        }`}
      >
        <item.icon className="w-4 h-4" />
        <span className="text-sm">{item.label}</span>
      </button>
    )
  }

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col">
        <div className="p-6 border-b border-neutral-100">
          <h1 className="text-xl font-bold"><span className="text-[#FF1493]">KaFlix</span> Admin</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <MenuItem item={sidebarLinks[0]} />
          
          <div>
            <button
              onClick={() => toggleDropdown('bookings')}
              className="w-full flex items-center justify-between px-4 py-2.5 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Bookings</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${openDropdowns.bookings ? 'rotate-180' : ''}`} />
            </button>
            {openDropdowns.bookings && (
              <div className="mt-2 space-y-1">
                <DropdownItem item={sidebarLinks[1]} />
                <DropdownItem item={sidebarLinks[2]} />
              </div>
            )}
          </div>

          <MenuItem item={sidebarLinks[3]} />
          <MenuItem item={sidebarLinks[4]} />

          <div>
            <button
              onClick={() => toggleDropdown('finance')}
              className="w-full flex items-center justify-between px-4 py-2.5 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Finance</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${openDropdowns.finance ? 'rotate-180' : ''}`} />
            </button>
            {openDropdowns.finance && (
              <div className="mt-2 space-y-1">
                <DropdownItem item={sidebarLinks[5]} />
                <DropdownItem item={sidebarLinks[6]} />
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-neutral-100">
          <a href="/" className="flex items-center gap-3 px-4 py-2.5 text-neutral-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Exit</span>
          </a>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900">
            {activeLink === 'all-bookings' ? 'Booking Management' : 'Calendar View'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-500 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-neutral-900 mt-1">{stat.value}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#FF1493]/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-[#FF1493]" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {activeLink === 'all-bookings' && (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
              </div>
            ) : bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <CalendarRange className="w-16 h-16 text-neutral-300 mb-4" />
                <p className="text-lg font-medium text-neutral-600">No bookings found</p>
                <p className="text-neutral-500 mt-1">Bookings will appear here once customers make reservations.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-600">Client Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-600">Space</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-600">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-600">Total Price</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-600">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-neutral-900">{booking.client_name}</td>
                        <td className="px-6 py-4 text-sm text-neutral-600">{booking.space_name}</td>
                        <td className="px-6 py-4 text-sm text-neutral-600">{booking.booking_date}</td>
                        <td className="px-6 py-4 text-sm text-neutral-900 font-medium">RM {booking.total_price}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            booking.status === 'approved' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {booking.status === 'pending' && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateStatus(booking.id, 'approved')}
                                className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition-colors"
                                title="Approve"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => updateStatus(booking.id, 'rejected')}
                                className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeLink === 'calendar' && (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900">Monthly Calendar</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={prevMonth}
                  className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-neutral-600" />
                </button>
                <span className="text-sm font-medium text-neutral-700 min-w-[140px] text-center">
                  {formatMonthYear(currentMonth)}
                </span>
                <button
                  onClick={nextMonth}
                  className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-neutral-600" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-px bg-neutral-200">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="bg-neutral-50 p-3 text-center text-sm font-medium text-neutral-500">
                  {day}
                </div>
              ))}
              {getDaysInMonth(currentMonth).map((date, idx) => {
                const dayBookings = getBookingsForDate(date)
                return (
                  <div
                    key={idx}
                    className={`bg-white min-h-[120px] p-2 ${!date ? 'bg-neutral-50' : ''}`}
                  >
                    {date && (
                      <>
                        <div className="text-sm font-medium text-neutral-500 mb-2">
                          {date.getDate()}
                        </div>
                        <div className="space-y-1">
                          {dayBookings.slice(0, 3).map((booking) => (
                            <div
                              key={booking.id}
                              className={`text-xs px-2 py-1 rounded truncate ${
                                booking.status === 'approved' ? 'bg-green-100 text-green-700' :
                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}
                            >
                              {booking.client_name} - {booking.space_name}
                            </div>
                          ))}
                          {dayBookings.length > 3 && (
                            <div className="text-xs text-neutral-500 pl-2">
                              +{dayBookings.length - 3} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}