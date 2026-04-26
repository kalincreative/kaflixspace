import { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Calendar, ChevronDown, Users, Home, Wallet, TrendingUp, CheckCircle, XCircle, LogOut, CreditCard, BarChart3, CalendarDays, Loader2, ChevronLeft, ChevronRight, CalendarRange, Search, User, Mail, Phone, Wrench, AlertCircle } from 'lucide-react'
import { supabase, getBookings, updateBookingStatus as supabaseUpdateStatus, getClients } from '../lib/supabase'

const adminSpaces = [
  { id: 1, name: 'Grand Seminar Hall', capacity: 120, price: 'RM150', image: '/Spaces/Grand Seminar Hall.png' },
  { id: 2, name: 'Tech Innovation Lab', capacity: 40, price: 'RM120', image: '/Spaces/Tech Innovation Lab.png' },
  { id: 3, name: 'Executive Boardroom', capacity: 20, price: 'RM100', image: '/Spaces/Executive Boardroom.png' },
  { id: 4, name: 'Creative Workshop', capacity: 30, price: 'RM90', image: '/Spaces/Creative Workshop.png' },
  { id: 5, name: 'Pitching Theatre', capacity: 50, price: 'RM110', image: '/Spaces/Pitching Theatre.png' },
  { id: 6, name: 'Podcast & Media Studio', capacity: 4, price: 'RM80', image: '/Spaces/Podcast & Media Studio.png' },
  { id: 7, name: 'Agile Sprint Room', capacity: 15, price: 'RM70', image: '/Spaces/Agile Sprint Room.png' },
  { id: 8, name: 'Strategy War Room', capacity: 10, price: 'RM60', image: '/Spaces/Strategy War Room.png' },
  { id: 9, name: 'Focus Pod', capacity: 6, price: 'RM40', image: '/Spaces/Focus Pod.png' },
  { id: 10, name: 'Zen Huddle Space', capacity: 8, price: 'RM45', image: '/Spaces/Zen Huddle Space.png' },
]

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
  const location = useLocation()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [clientsLoading, setClientsLoading] = useState(true)
  const [openDropdowns, setOpenDropdowns] = useState({ bookings: true, finance: false })
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [statusFilter, setStatusFilter] = useState('all')
  const [clientSearch, setClientSearch] = useState('')
  const [spaces, setSpaces] = useState(() => {
    const stored = localStorage.getItem('kaflix_spaces_maintenance')
    return stored ? JSON.parse(stored) : {}
  })

  const getActiveLinkFromPath = (path) => {
    if (path.includes('/calendar')) return 'calendar'
    if (path.includes('/clients')) return 'clients'
    if (path.includes('/spaces')) return 'spaces'
    if (path.includes('/bookings')) return 'all-bookings'
    if (path.includes('/finance/payment')) return 'payment'
    if (path.includes('/finance/report')) return 'report'
    return 'all-bookings'
  }

  const [activeLink, setActiveLink] = useState(getActiveLinkFromPath(location.pathname))

  useEffect(() => {
    fetchBookings()
    fetchClients()
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

  const fetchClients = async () => {
    try {
      const data = await getClients()
      setClients(data)
    } catch (error) {
      console.error('Error fetching clients:', error)
    } finally {
      setClientsLoading(false)
    }
  }

  const toggleMaintenance = (spaceId) => {
    const updated = { ...spaces, [spaceId]: !spaces[spaceId] }
    setSpaces(updated)
    localStorage.setItem('kaflix_spaces_maintenance', JSON.stringify(updated))
  }

  const getRevenueByMonth = () => {
    const last5Months = []
    const today = new Date()
    for (let i = 4; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const month = date.toLocaleDateString('en-US', { month: 'short' })
      const year = date.getFullYear()
      const monthKey = `${year}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      const revenue = bookings
        .filter(b => b.status === 'approved' && b.booking_date?.startsWith(monthKey))
        .reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0)
      
      last5Months.push({ month, revenue })
    }
    return last5Months
  }

  const approvedBookings = useMemo(() => {
    return bookings.filter(b => b.status === 'approved')
  }, [bookings])

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

  const normalizeDate = (dateStr) => {
    if (!dateStr) return ''
    const raw = dateStr.split('T')[0].trim()
    if (raw.includes('-')) {
      const parts = raw.split('-')
      if (parts[0].length === 4) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`
      }
      return raw
    }
    return raw
  }

  const getBookingsForDate = (date) => {
    if (!date) return []
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const targetDate = `${year}-${month}-${day}`
    
    return bookings.filter(b => {
      const raw = b.booking_date || ''
      const storedDate = raw.split('T')[0].trim()
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter
      return storedDate === targetDate && matchesStatus
    })
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const raw = dateStr.split('T')[0]
    if (raw.includes('-')) {
      const parts = raw.split('-')
      if (parts[0].length === 4) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`
      }
      return raw
    }
    return raw
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

  const pendingCount = bookings.filter(b => b.status === 'pending').length
  const totalRevenue = bookings
    .filter(b => b.status === 'approved')
    .reduce((acc, b) => acc + parseFloat(b.total_price || b.price || 0), 0)

  const stats = useMemo(() => [
    { label: 'Total Bookings', value: bookings.length, icon: Calendar },
    { label: 'Pending Requests', value: pendingCount, icon: Calendar },
    { label: 'Total Revenue', value: `RM ${totalRevenue.toLocaleString()}`, icon: Wallet },
  ], [bookings, pendingCount, totalRevenue])

  const topSpender = useMemo(() => {
    if (clients.length === 0) return null
    return clients.reduce((max, c) => parseFloat(c.total_spent || 0) > parseFloat(max.total_spent || 0) ? c : max, clients[0])
  }, [clients])

  const handleMenuClick = (item) => {
    setActiveLink(item.id)
    navigate(item.path)
  }

  const MenuItem = ({ item }) => {
    const isActive = activeLink === item.id
    return (
      <button
        onClick={() => handleMenuClick(item)}
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
        onClick={() => handleMenuClick(item)}
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
            {activeLink === 'all-bookings' ? 'Booking Management' : 
             activeLink === 'calendar' ? 'Calendar View' :
             activeLink === 'clients' ? 'Clients' :
             activeLink === 'spaces' ? 'Spaces Management' :
             activeLink === 'payment' ? 'Payment History' :
             activeLink === 'report' ? 'Revenue Report' : 'Dashboard'}
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
                        <td className="px-6 py-4 text-sm text-neutral-600">{formatDate(booking.booking_date)}</td>
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

        {activeLink === 'spaces' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminSpaces.map((space) => (
                <div 
                  key={space.id} 
                  className={`bg-white rounded-2xl border overflow-hidden transition-all ${spaces[space.id] ? 'opacity-50 border-red-200' : 'border-neutral-100 shadow-sm hover:shadow-md'}`}
                >
                  <div className="relative aspect-video">
                    <img src={space.image} alt={space.name} className="w-full h-full object-cover" />
                    {spaces[space.id] && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                          <Wrench className="w-4 h-4" />
                          Under Maintenance
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-neutral-900">{space.name}</h3>
                    <div className="flex items-center gap-2 mt-2 text-neutral-500 text-sm">
                      <Users className="w-4 h-4" />
                      <span>{space.capacity} Pax</span>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-neutral-100">
                      <div>
                        <span className="font-bold text-neutral-900">{space.price}</span>
                        <span className="text-neutral-500 text-sm">/hr</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-neutral-500">
                          {spaces[space.id] ? 'Unavailable' : 'Available'}
                        </span>
                        <button
                          onClick={() => toggleMaintenance(space.id)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${spaces[space.id] ? 'bg-red-500' : 'bg-green-500'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${spaces[space.id] ? 'translate-x-7' : 'translate-x-1'}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeLink === 'payment' && (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
            {approvedBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <CreditCard className="w-16 h-16 text-neutral-300 mb-4" />
                <p className="text-lg font-medium text-neutral-600">No approved bookings</p>
                <p className="text-neutral-500 mt-1">Approved bookings will appear here for payment tracking.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-600">Client</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-600">Space</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-600">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-600">Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {approvedBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-neutral-900">{booking.client_name}</td>
                        <td className="px-6 py-4 text-sm text-neutral-600">{booking.space_name}</td>
                        <td className="px-6 py-4 text-sm text-neutral-600">{formatDate(booking.booking_date)}</td>
                        <td className="px-6 py-4 text-sm text-neutral-900 font-medium">RM {booking.total_price}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            Paid
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeLink === 'report' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
              <h3 className="text-lg font-semibold text-neutral-900 mb-6">Revenue Overview (Last 5 Months)</h3>
              <div className="space-y-4">
                {getRevenueByMonth().map((item, idx) => {
                  const maxRevenue = Math.max(...getRevenueByMonth().map(m => m.revenue), 1)
                  const percentage = (item.revenue / maxRevenue) * 100
                  return (
                    <div key={idx} className="flex items-center gap-4">
                      <span className="w-16 text-sm font-medium text-neutral-600">{item.month}</span>
                      <div className="flex-1 bg-neutral-100 rounded-full h-8 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                          style={{ width: `${Math.max(percentage, 5)}%` }}
                        >
                          <span className="text-white text-sm font-medium">
                            {item.revenue > 0 ? `RM ${item.revenue.toLocaleString()}` : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-6 pt-6 border-t border-neutral-100 flex justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    RM {approvedBookings.reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Approved Bookings</p>
                  <p className="text-2xl font-bold text-neutral-900">{approvedBookings.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}