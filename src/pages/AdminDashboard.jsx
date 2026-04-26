import { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Calendar, ChevronDown, Users, Home, Wallet, TrendingUp, CheckCircle, XCircle, LogOut, CreditCard, BarChart3, CalendarDays, Loader2, ChevronLeft, ChevronRight, CalendarRange, Search, User, Mail, Phone } from 'lucide-react'
import { supabase, getBookings, updateBookingStatus as supabaseUpdateStatus, getClients } from '../lib/supabase'

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
      console.log('Bookings loaded:', data)
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
    
    console.log('Target date:', targetDate, '| Checking against:', bookings.map(b => b.booking_date))
    
    return bookings.filter(b => {
      const raw = b.booking_date || ''
      const storedDate = raw.split('T')[0].trim()
      const matches = storedDate === targetDate
      if (matches) console.log('Match found:', b.client_name, storedDate)
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter
      return matches && matchesStatus
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
            {activeLink === 'all-bookings' ? 'Booking Management' : activeLink === 'calendar' ? 'Calendar View' : 'Clients'}
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

        {activeLink === 'calendar' && (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900">Monthly Calendar</h3>
              <div className="flex items-center gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
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

        {activeLink === 'clients' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-500 text-sm">Total Unique Clients</p>
                    <p className="text-2xl font-bold text-neutral-900 mt-1">{clients.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[#FF1493]/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#FF1493]" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-500 text-sm">Top Spender</p>
                    <p className="text-xl font-bold text-neutral-900 mt-1">
                      {topSpender?.full_name || '-'}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      RM {topSpender ? parseFloat(topSpender.total_spent || 0).toLocaleString() : 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Search className="w-5 h-5 text-neutral-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
              {clientsLoading ? (
                <div className="flex items-center justify-center p-12">
                  <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
                </div>
              ) : clients.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <User className="w-16 h-16 text-neutral-300 mb-4" />
                  <p className="text-lg font-medium text-neutral-600">No clients yet</p>
                  <p className="text-neutral-500 mt-1">Clients will appear here once they make their first booking.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-600">Client Name</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-600">Contact</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-600">Total Bookings</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-600">Total Spent</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-600">Join Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {clients
                        .filter(c => 
                          !clientSearch || 
                          c.full_name?.toLowerCase().includes(clientSearch.toLowerCase()) ||
                          c.email?.toLowerCase().includes(clientSearch.toLowerCase())
                        )
                        .map((client) => (
                          <tr key={client.id} className="hover:bg-neutral-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                                  <span className="text-pink-600 font-medium">
                                    {client.full_name?.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <span className="text-sm text-neutral-900 font-medium">{client.full_name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-neutral-600">
                                  <Mail className="w-4 h-4 text-neutral-400" />
                                  {client.email}
                                </div>
                                {client.phone && (
                                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                                    <Phone className="w-4 h-4 text-neutral-400" />
                                    {client.phone}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-neutral-900">{client.total_bookings}</td>
                            <td className="px-6 py-4 text-sm text-neutral-900 font-medium">RM {parseFloat(client.total_spent || 0).toLocaleString()}</td>
                            <td className="px-6 py-4 text-sm text-neutral-600">
                              {client.created_at ? new Date(client.created_at).toLocaleDateString('en-GB') : '-'}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}