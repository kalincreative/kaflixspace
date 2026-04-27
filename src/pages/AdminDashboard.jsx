import { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Calendar, ChevronDown, Users, Home, Wallet, TrendingUp, CheckCircle, XCircle, LogOut, CreditCard, BarChart3, CalendarDays, Loader2, ChevronLeft, ChevronRight, CalendarRange, Search, User, Mail, Phone, Wrench, AlertCircle, Filter, CheckSquare, Square, Trash2, ArrowUpRight, ArrowDownRight, Clock, TrendingUp as TrendingUpIcon, CalendarCheck, DollarSign, Clock3, Menu, X, ChevronRight as ChevronRightIcon } from 'lucide-react'
import { supabase, getBookings, updateBookingStatus as supabaseUpdateStatus, getClients } from '../lib/supabase'
import { ToastContainer, useToast } from '../components/Toast'

const ITEMS_PER_PAGE = 10

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
    if (path === '/admin/dashboard' || path === '/admin/dashboard/') return 'dashboard'
    if (path.includes('/calendar')) return 'calendar'
    if (path.includes('/clients')) return 'clients'
    if (path.includes('/spaces')) return 'spaces'
    if (path.includes('/bookings')) return 'all-bookings'
    if (path.includes('/finance/payment')) return 'payment'
    if (path.includes('/finance/report')) return 'report'
    return 'dashboard'
  }

  const [activeLink, setActiveLink] = useState(getActiveLinkFromPath(location.pathname))

  // Search, filter, pagination states
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedBookings, setSelectedBookings] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  // Toast notifications
  const { toasts, removeToast, toast } = useToast()

  // Mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
    window.dispatchEvent(new Event('kaflix_spaces_updated'))
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

  // Filtered and paginated bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      // Search filter
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch = !searchQuery ||
        booking.client_name?.toLowerCase().includes(searchLower) ||
        booking.space_name?.toLowerCase().includes(searchLower) ||
        booking.email?.toLowerCase().includes(searchLower)

      // Status filter
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter

      // Date range filter
      const bookingDate = booking.booking_date?.split('T')[0] || ''
      const matchesDateFrom = !dateFrom || bookingDate >= dateFrom
      const matchesDateTo = !dateTo || bookingDate <= dateTo

      return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo
    })
  }, [bookings, searchQuery, statusFilter, dateFrom, dateTo])

  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE)
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredBookings.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredBookings, currentPage])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, dateFrom, dateTo])

  const toggleDropdown = (dropdown) => {
    setOpenDropdowns(prev => ({ ...prev, [dropdown]: !prev[dropdown] }))
  }

  const updateStatus = async (id, newStatus) => {
    try {
      await supabaseUpdateStatus(id, newStatus)
      setBookings(bookings.map(booking =>
        booking.id === id ? { ...booking, status: newStatus } : booking
      ))
      toast.success(`Booking ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully`)
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update booking status')
    }
  }

  // Bulk selection functions
  const toggleSelectAll = () => {
    if (selectedBookings.length === paginatedBookings.length) {
      setSelectedBookings([])
    } else {
      setSelectedBookings(paginatedBookings.map(b => b.id))
    }
  }

  const toggleSelectBooking = (id) => {
    setSelectedBookings(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const bulkApprove = async () => {
    for (const id of selectedBookings) {
      await updateStatus(id, 'approved')
    }
    setSelectedBookings([])
    toast.success(`${selectedBookings.length} bookings approved successfully`)
  }

  const bulkReject = async () => {
    for (const id of selectedBookings) {
      await updateStatus(id, 'rejected')
    }
    setSelectedBookings([])
    toast.success(`${selectedBookings.length} bookings rejected`)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setDateFrom('')
    setDateTo('')
  }

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || dateFrom || dateTo

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
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-neutral-200"
      >
        <Menu className="w-6 h-6 text-neutral-600" />
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:relative z-50 lg:z-auto w-64 h-screen bg-white border-r border-neutral-200 flex flex-col transform transition-transform duration-300 lg:transform-none ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-neutral-100">
          <h1 className="text-xl font-bold"><span className="text-[#FF1493]">KaFlix</span> Admin</h1>
          <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-neutral-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block p-6 border-b border-neutral-100">
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

      <main className="flex-1 p-4 md:p-8 lg:p-8">
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        
        {/* Breadcrumbs */}
        <div className="mb-4 lg:mb-6 flex items-center gap-2 text-sm text-neutral-500">
          <a href="/admin/dashboard" className="hover:text-pink-600 transition-colors">Admin</a>
          <ChevronRightIcon className="w-4 h-4" />
          <span className="text-neutral-900 font-medium">
            {activeLink === 'dashboard' ? 'Dashboard' :
             activeLink === 'all-bookings' ? 'Bookings' :
             activeLink === 'calendar' ? 'Calendar' :
             activeLink === 'clients' ? 'Clients' :
             activeLink === 'spaces' ? 'Spaces' :
             activeLink === 'payment' ? 'Payments' :
             activeLink === 'report' ? 'Reports' : 'Dashboard'}
          </span>
        </div>

        {/* Page Header */}
        <div className="mb-6 lg:mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-neutral-900">
            {activeLink === 'all-bookings' ? 'Booking Management' : 
             activeLink === 'calendar' ? 'Calendar View' :
             activeLink === 'clients' ? 'Clients' :
             activeLink === 'spaces' ? 'Spaces Management' :
             activeLink === 'payment' ? 'Payment History' :
             activeLink === 'report' ? 'Revenue Report' : 'Dashboard'}
          </h2>
          <p className="text-neutral-500 mt-1">
            {activeLink === 'dashboard' ? 'Overview of your business performance' : ''}
          </p>
        </div>

        {/* Dashboard Home View */}
        {activeLink === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards with Trends */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Bookings */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-neutral-500 text-sm font-medium">Total Bookings</p>
                    <p className="text-3xl font-bold text-neutral-900 mt-2">{bookings.length}</p>
                    <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                      <ArrowUpRight className="w-4 h-4" />
                      <span>+12% from last month</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <CalendarCheck className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Pending Requests */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-neutral-500 text-sm font-medium">Pending Requests</p>
                    <p className="text-3xl font-bold text-neutral-900 mt-2">{pendingCount}</p>
                    <div className="flex items-center gap-1 mt-2 text-yellow-600 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>Needs attention</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                    <Clock3 className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              {/* Total Revenue */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-neutral-500 text-sm font-medium">Total Revenue</p>
                    <p className="text-3xl font-bold text-neutral-900 mt-2">RM {totalRevenue.toLocaleString()}</p>
                    <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                      <TrendingUpIcon className="w-4 h-4" />
                      <span>+8% from last month</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Approved Rate */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-neutral-500 text-sm font-medium">Approval Rate</p>
                    <p className="text-3xl font-bold text-neutral-900 mt-2">
                      {bookings.length > 0 
                        ? Math.round((approvedBookings.length / bookings.length) * 100)
                        : 0}%
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                      <ArrowUpRight className="w-4 h-4" />
                      <span>+5% from last month</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-pink-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Chart & Quick Actions Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue Overview Chart */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">Revenue Overview</h3>
                    <p className="text-sm text-neutral-500">Last 6 months performance</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-sm bg-pink-50 text-pink-600 rounded-lg font-medium">Monthly</button>
                    <button className="px-3 py-1.5 text-sm text-neutral-500 hover:bg-neutral-50 rounded-lg">Weekly</button>
                  </div>
                </div>
                
                {/* Simple Bar Chart */}
                <div className="flex items-end justify-between h-48 gap-4">
                  {getRevenueByMonth().map((item, idx) => {
                    const maxRevenue = Math.max(...getRevenueByMonth().map(m => m.revenue), 1)
                    const height = item.revenue > 0 ? (item.revenue / maxRevenue) * 100 : 5
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full flex flex-col items-center justify-end h-36">
                          <div 
                            className="w-full max-w-12 bg-gradient-to-t from-pink-500 to-pink-400 rounded-t-lg transition-all duration-500 hover:from-pink-600 hover:to-pink-500"
                            style={{ height: `${height}%` }}
                          />
                        </div>
                        <span className="text-xs text-neutral-500 font-medium">{item.month}</span>
                        <span className="text-xs font-semibold text-neutral-700">
                          {item.revenue > 0 ? `RM ${(item.revenue / 1000).toFixed(1)}k` : 'RM 0'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Quick Actions & Recent Activity */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => handleMenuClick(sidebarLinks[1])}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-neutral-900">View All Bookings</p>
                      <p className="text-xs text-neutral-500">{bookings.length} total bookings</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => handleMenuClick(sidebarLinks[3])}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-neutral-900">Manage Clients</p>
                      <p className="text-xs text-neutral-500">{clients.length} registered clients</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => handleMenuClick(sidebarLinks[6])}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-neutral-900">View Reports</p>
                      <p className="text-xs text-neutral-500">Revenue analytics</p>
                    </div>
                  </button>
                </div>

                {/* Recent Activity */}
                <div className="mt-6 pt-6 border-t border-neutral-100">
                  <h4 className="text-sm font-semibold text-neutral-900 mb-4">Recent Bookings</h4>
                  <div className="space-y-3">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          booking.status === 'approved' ? 'bg-green-500' :
                          booking.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900 truncate">{booking.client_name}</p>
                          <p className="text-xs text-neutral-500">{booking.space_name}</p>
                        </div>
                        <span className="text-xs text-neutral-400">{formatDate(booking.booking_date)}</span>
                      </div>
                    ))}
                    {bookings.length === 0 && (
                      <p className="text-sm text-neutral-500 text-center py-4">No recent bookings</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Status Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Status Breakdown */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                <h3 className="text-lg font-semibold text-neutral-900 mb-6">Booking Status Breakdown</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Approved', count: approvedBookings.length, color: 'bg-green-500', percent: bookings.length > 0 ? (approvedBookings.length / bookings.length) * 100 : 0 },
                    { label: 'Pending', count: pendingCount, color: 'bg-yellow-500', percent: bookings.length > 0 ? (pendingCount / bookings.length) * 100 : 0 },
                    { label: 'Rejected', count: bookings.filter(b => b.status === 'rejected').length, color: 'bg-red-500', percent: bookings.length > 0 ? (bookings.filter(b => b.status === 'rejected').length / bookings.length) * 100 : 0 },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-4">
                      <div className="w-24 text-sm font-medium text-neutral-700">{item.label}</div>
                      <div className="flex-1 bg-neutral-100 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-full ${item.color} rounded-full transition-all duration-500`}
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                      <div className="w-16 text-sm text-neutral-600 text-right">{item.count}</div>
                      <div className="w-12 text-sm text-neutral-500 text-right">{Math.round(item.percent)}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Spaces */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                <h3 className="text-lg font-semibold text-neutral-900 mb-6">Popular Spaces</h3>
                <div className="space-y-4">
                  {adminSpaces.slice(0, 5).map((space, idx) => {
                    const spaceBookings = bookings.filter(b => b.space_name === space.name).length
                    const maxBookings = Math.max(...adminSpaces.slice(0, 5).map(s => bookings.filter(b => b.space_name === s.name).length), 1)
                    return (
                      <div key={space.id} className="flex items-center gap-4">
                        <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 text-sm font-semibold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-neutral-900">{space.name}</p>
                          <p className="text-xs text-neutral-500">{space.capacity} pax • {space.price}/hr</p>
                        </div>
                        <div className="w-20 bg-neutral-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full bg-pink-500 rounded-full"
                            style={{ width: `${(spaceBookings / maxBookings) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-neutral-600 w-16 text-right">{spaceBookings} bookings</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

{activeLink === 'all-bookings' && (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
              </div>
            ) : (
              <>
                {/* Search and Filters */}
                <div className="p-4 border-b border-neutral-100 space-y-4">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Search by name, space, or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                    />
                  </div>

                  {/* Filter Row */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-neutral-400" />
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>

                    {/* Date Range */}
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                        placeholder="From date"
                      />
                      <span className="text-neutral-400">-</span>
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                        placeholder="To date"
                      />
                    </div>

                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="px-3 py-2 text-sm text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                      >
                        Clear Filters
                      </button>
                    )}

                    <div className="ml-auto text-sm text-neutral-500">
                      {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''} found
                    </div>
                  </div>

                  {/* Bulk Actions */}
                  {selectedBookings.length > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
                      <span className="text-sm font-medium text-pink-700">
                        {selectedBookings.length} selected
                      </span>
                      <button
                        onClick={bulkApprove}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve All
                      </button>
                      <button
                        onClick={bulkReject}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject All
                      </button>
                      <button
                        onClick={() => setSelectedBookings([])}
                        className="ml-auto text-sm text-neutral-500 hover:text-neutral-700"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {filteredBookings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-12 text-center">
                    <CalendarRange className="w-16 h-16 text-neutral-300 mb-4" />
                    <p className="text-lg font-medium text-neutral-600">No bookings found</p>
                    <p className="text-neutral-500 mt-1">
                      {hasActiveFilters ? 'Try adjusting your filters.' : 'Bookings will appear here once customers make reservations.'}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-neutral-50">
                          <tr>
                            <th className="px-6 py-4 text-left">
                              <button
                                onClick={toggleSelectAll}
                                className="text-neutral-500 hover:text-neutral-700"
                              >
                                {selectedBookings.length === paginatedBookings.length && paginatedBookings.length > 0 ? (
                                  <CheckSquare className="w-5 h-5 text-pink-500" />
                                ) : (
                                  <Square className="w-5 h-5" />
                                )}
                              </button>
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-600">Client Name</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-600">Space</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-600">Date</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-600">Total Price</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-600">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-600">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {paginatedBookings.map((booking) => (
                            <tr key={booking.id} className={`hover:bg-neutral-50 transition-colors ${selectedBookings.includes(booking.id) ? 'bg-pink-50/50' : ''}`}>
                              <td className="px-6 py-4">
                                <button
                                  onClick={() => toggleSelectBooking(booking.id)}
                                  className="text-neutral-400 hover:text-neutral-600"
                                >
                                  {selectedBookings.includes(booking.id) ? (
                                    <CheckSquare className="w-5 h-5 text-pink-500" />
                                  ) : (
                                    <Square className="w-5 h-5" />
                                  )}
                                </button>
                              </td>
                              <td className="px-6 py-4">
                                <div>
                                  <p className="text-sm font-medium text-neutral-900">{booking.client_name}</p>
                                  <p className="text-xs text-neutral-500">{booking.email}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-neutral-600">{booking.space_name}</td>
                              <td className="px-6 py-4 text-sm text-neutral-600">{formatDate(booking.booking_date)}</td>
                              <td className="px-6 py-4 text-sm font-medium text-neutral-900">RM {booking.total_price}</td>
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

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="px-6 py-4 border-t border-neutral-100 flex items-center justify-between">
                        <p className="text-sm text-neutral-500">
                          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredBookings.length)} of {filteredBookings.length}
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                currentPage === page
                                  ? 'bg-pink-500 text-white'
                                  : 'text-neutral-600 hover:bg-neutral-100'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                          <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
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

        {activeLink === 'clients' && (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
            {clientsLoading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
              </div>
            ) : clients.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <Users className="w-16 h-16 text-neutral-300 mb-4" />
                <p className="text-lg font-medium text-neutral-600">No clients found</p>
                <p className="text-neutral-500 mt-1">Clients will appear here once they make bookings.</p>
              </div>
            ) : (
              <>
                {/* Client Search */}
                <div className="p-4 border-b border-neutral-100">
                  <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Search clients..."
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-600">Client</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-600">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-600">Phone</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-600">Total Spent</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-600">Bookings</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {clients
                        .filter(c => !clientSearch || 
                          c.name?.toLowerCase().includes(clientSearch.toLowerCase()) ||
                          c.email?.toLowerCase().includes(clientSearch.toLowerCase()))
                        .map((client) => (
                        <tr key={client.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                                <span className="text-pink-600 font-semibold">
                                  {client.name?.charAt(0)?.toUpperCase() || '?'}
                                </span>
                              </div>
                              <span className="text-sm font-medium text-neutral-900">{client.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-neutral-600">{client.email}</td>
                          <td className="px-6 py-4 text-sm text-neutral-600">{client.phone || '-'}</td>
                          <td className="px-6 py-4 text-sm font-medium text-neutral-900">
                            RM {parseFloat(client.total_spent || 0).toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              {client.booking_count || 0}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
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