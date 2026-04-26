import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, CreditCard, Building, X, CheckCircle } from 'lucide-react'
import { useReservation } from '../context/ReservationContext'
import { createBooking, createOrUpdateClient } from '../lib/supabase'

export default function Checkout() {
  const navigate = useNavigate()
  const { cart, clearCart, total } = useReservation()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    requirements: '',
    paymentMethod: 'credit_card',
  })
  const [errors, setErrors] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)

  const validate = () => {
    const newErrors = {}
    if (!formData.name) newErrors.name = 'Name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email'
    if (!formData.company) newErrors.company = 'Company name is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    
    try {
      let totalSpent = 0
      for (const item of cart) {
        const dateStr = item.date
        const [year, month, day] = dateStr.split('-')
        const formattedDate = `${day}-${month}-${year}`
        
        await createBooking({
          clientName: formData.name,
          spaceName: item.spaceName,
          bookingDate: formattedDate,
          totalPrice: item.totalPrice
        })
        totalSpent += item.totalPrice
      }
      
      await createOrUpdateClient({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        totalPrice: totalSpent
      })
      
      clearCart()
      setShowSuccess(true)
    } catch (error) {
      console.error('Error creating booking:', error)
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-neutral-50">
        <div className="text-center bg-white rounded-2xl shadow-xl p-12 max-w-md mx-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Booking Confirmed!</h2>
          <p className="text-neutral-600 mb-6">
            Your reservation has been submitted. We'll send a confirmation email shortly.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-[#FF1493] text-white rounded-lg hover:opacity-90 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-neutral-900 mb-4">Your cart is empty</h2>
          <Link to="/spaces" className="text-pink-500 hover:underline">
            Browse Spaces
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 bg-neutral-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-neutral-900">Booking Summary</h2>
            {cart.map(item => (
              <div key={item.cartId} className="bg-white rounded-xl p-6 border border-neutral-200">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-neutral-900">{item.spaceName}</h3>
                    <p className="text-sm text-neutral-500">{item.location}</p>
                  </div>
                  <span className="font-semibold text-pink-600">RM{item.totalPrice}</span>
                </div>
                <p className="text-sm text-neutral-600 mb-2">
                  {item.date} • {item.timeSlot}
                </p>
                {item.addons && item.addons.length > 0 && (
                  <div className="text-sm text-neutral-500">
                    <span className="font-medium">Add-ons:</span>
                    <ul className="mt-1 ml-2">
                      {item.addons.map((addon, idx) => (
                        <li key={idx}>• {addon.name} x{addon.qty}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
            <div className="bg-white rounded-xl p-6 border border-neutral-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-neutral-900">Grand Total</span>
                <span className="text-2xl font-bold text-neutral-900">RM{total}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-neutral-900">Personal & Corporate Details</h2>
            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border border-neutral-200 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#FF1493]/50 ${errors.name ? 'border-red-500' : 'border-neutral-200'}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Corporate Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#FF1493]/50 ${errors.email ? 'border-red-500' : 'border-neutral-200'}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+60 1X XXX XXXX"
                  className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#FF1493]/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Company Name</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#FF1493]/50 ${errors.company ? 'border-red-500' : 'border-neutral-200'}`}
                />
                {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Special Requirements</label>
                <textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  rows={4}
                  placeholder="Any special requests or requirements..."
                  className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#FF1493]/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-3">Payment Method</label>
                <div className="space-y-3">
                  <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${formData.paymentMethod === 'credit_card' ? 'border-pink-500 bg-pink-50' : 'border-neutral-200'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={formData.paymentMethod === 'credit_card'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="hidden"
                    />
                    <CreditCard className="w-5 h-5 text-neutral-600" />
                    <span className="flex-1">Credit Card</span>
                    {formData.paymentMethod === 'credit_card' && <Check className="w-5 h-5 text-pink-500" />}
                  </label>
                  <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${formData.paymentMethod === 'corporate_billing' ? 'border-pink-500 bg-pink-50' : 'border-neutral-200'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="corporate_billing"
                      checked={formData.paymentMethod === 'corporate_billing'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="hidden"
                    />
                    <Building className="w-5 h-5 text-neutral-600" />
                    <span className="flex-1">Corporate Billing</span>
                    {formData.paymentMethod === 'corporate_billing' && <Check className="w-5 h-5 text-pink-500" />}
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#FF1493] text-white rounded-lg hover:opacity-90 transition-colors font-semibold text-lg"
              >
                Complete Booking
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}