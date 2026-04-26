import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const bookingsTable = 'bookings'

export const getBookings = async () => {
  const { data, error } = await supabase
    .from(bookingsTable)
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const createBooking = async (booking) => {
  const { data, error } = await supabase
    .from(bookingsTable)
    .insert([{
      client_name: booking.clientName,
      space_name: booking.spaceName,
      booking_date: booking.bookingDate,
      total_price: booking.totalPrice,
      status: 'pending'
    }])
    .select()
  
  if (error) throw error
  return data[0]
}

export const updateBookingStatus = async (id, status) => {
  const { data, error } = await supabase
    .from(bookingsTable)
    .update({ status })
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}