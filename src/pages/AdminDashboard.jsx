import { useState } from 'react'
import { LayoutDashboard, Calendar, DollarSign, Clock, CheckCircle, XCircle, LogOut, Users } from 'lucide-react'

const initialBookings = [
  { id: 1, clientName: 'Ahmad Razak', space: 'Grand Seminar Hall', date: '2026-05-15', price: 'RM 450', status: 'pending' },
  { id: 2, clientName: 'Sarah Chen', space: 'Executive Boardroom', date: '2026-05-10', price: 'RM 240', status: 'approved' },
  { id: 3, clientName: 'TechCorp Sdn Bhd', space: 'Tech Innovation Lab', date: '2026-05-08', price: 'RM 360', status: 'rejected' },
  { id: 4, clientName: 'Jennifer Lee', space: 'Creative Workshop', date: '2026-05-20', price: 'RM 180', status: 'pending' },
  { id: 5, clientName: 'Digital Solutions', space: 'Pitching Theatre', date: '2026-05-12', price: 'RM 330', status: 'approved' },
  { id: 6, clientName: 'Mark Tan', space: 'Podcast Studio', date: '2026-05-18', price: 'RM 120', status: 'pending' },
]

export default function AdminDashboard() {
  const [bookings, setBookings] = useState(initialBookings)
  const [activeTab, setActiveTab] = useState('bookings')

  const updateStatus = (id, newStatus) => {
    setBookings(bookings.map(booking => 
      booking.id === id ? { ...booking, status: newStatus } : booking
    ))
  }

  const pendingCount = bookings.filter(b => b.status === 'pending').length
  const totalRevenue = bookings.filter(b => b.status === 'approved').reduce((acc, b) => acc + parseInt(b.price.replace(/[^0-9]/g, '')), 0)

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: Calendar },
    { label: 'Pending Requests', value: pendingCount, icon: Clock },
    { label: 'Total Revenue', value: `RM ${totalRevenue.toLocaleString()}`, icon: DollarSign },
  ]

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <aside className="w-64 bg-white border-r border-neutral-200 p-6">
        <div className="mb-8">
          <h1 className="text-xl font-bold"><span className="text-[#FF1493]">KaFlix</span> Admin</h1>
        </div>
        
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'bookings' ? 'bg-[#FF1493]/10 text-[#FF1493]' : 'text-neutral-600 hover:bg-neutral-100'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Bookings
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-[#FF1493]/10 text-[#FF1493]' : 'text-neutral-600 hover:bg-neutral-100'}`}
          >
            <Users className="w-5 h-5" />
            Dashboard
          </button>
        </nav>

        <div className="absolute bottom-6">
          <a href="/" className="flex items-center gap-3 px-4 py-3 text-neutral-600 hover:text-red-500 transition-colors">
            <LogOut className="w-5 h-5" />
            Exit
          </a>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900">Booking Management</h2>
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

        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
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
                    <td className="px-6 py-4 text-sm text-neutral-900">{booking.clientName}</td>
                    <td className="px-6 py-4 text-sm text-neutral-600">{booking.space}</td>
                    <td className="px-6 py-4 text-sm text-neutral-600">{booking.date}</td>
                    <td className="px-6 py-4 text-sm text-neutral-900 font-medium">{booking.price}</td>
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
        </div>
      </main>
    </div>
  )
}