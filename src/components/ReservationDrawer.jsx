import { X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useReservation } from '../context/ReservationContext'

export default function ReservationDrawer() {
  const navigate = useNavigate()
  const { cart, removeFromCart, isOpen, setIsOpen, total } = useReservation()

  if (!isOpen) return null

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={() => setIsOpen(false)}
      />
      <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
        <div className="flex items-center justify-between border-b border-neutral-100 p-6">
          <h2 className="text-xl font-bold text-neutral-900">Your Reservation</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors"
          >
            <X className="w-5 h-5 text-neutral-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center text-neutral-500 py-12">
              Your reservation list is empty.
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.cartId} className="border border-neutral-200 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-neutral-900">{item.spaceName}</h3>
                    <button 
                      onClick={() => removeFromCart(item.cartId)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-sm text-neutral-600 mb-2">
                    {item.date} • {item.timeRange}
                  </p>
                  <div className="text-xs text-neutral-500 mb-2">
                    {item.usageHours} hr usage + {item.prepHours} hr prep = {item.totalBookingHours} hrs total
                  </div>
                  {item.addons && item.addons.length > 0 && (
                    <ul className="text-sm text-neutral-500 mb-2">
                      {item.addons.map((addon, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span>• {addon.name}</span>
                          <span>x{addon.qty}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="text-right font-semibold text-pink-600">
                    RM{item.totalPrice}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-neutral-100 p-6 bg-white">
          <div className="flex justify-between items-center mb-4">
            <span className="text-neutral-600">Estimated Total</span>
            <span className="text-2xl font-bold text-neutral-900">RM{total}</span>
          </div>
          <button 
            onClick={() => { setIsOpen(false); navigate('/checkout'); }}
            className="w-full bg-[#FF1493] text-white rounded-lg py-4 hover:opacity-90 transition-colors font-semibold"
          >
            Confirm & Checkout
          </button>
        </div>
      </div>
    </>
  )
}