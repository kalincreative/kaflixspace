import { createContext, useContext, useState, useEffect } from 'react'

const ReservationContext = createContext()

export function ReservationProvider({ children }) {
  const [cart, setCart] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kaflix_reservation')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('kaflix_reservation', JSON.stringify(cart))
  }, [cart])

  const addToCart = (item) => {
    setCart(prev => [...prev, { ...item, cartId: Date.now() }])
  }

  const removeFromCart = (cartId) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId))
  }

  const clearCart = () => {
    setCart([])
  }

  const total = cart.reduce((sum, item) => sum + item.totalPrice, 0)

  return (
    <ReservationContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, isOpen, setIsOpen, total }}>
      {children}
    </ReservationContext.Provider>
  )
}

export function useReservation() {
  const context = useContext(ReservationContext)
  if (!context) {
    throw new Error('useReservation must be used within ReservationProvider')
  }
  return context
}