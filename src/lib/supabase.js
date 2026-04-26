import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const bookingsTable = 'bookings'

export const getBookings = async () => {
  if (!supabase) return []
  const { data, error } = await supabase
    .from(bookingsTable)
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export const createBooking = async (booking) => {
  if (!supabase) {
    console.warn('Supabase not configured')
    return null
  }
  const { data, error } = await supabase
    .from(bookingsTable)
    .insert([{
      client_name: booking.clientName,
      client_email: booking.clientEmail || '',
      space_name: booking.spaceName,
      location: booking.location || '',
      booking_date: booking.bookingDate,
      time_range: booking.timeRange || '',
      usage_hours: booking.usageHours || 0,
      prep_hours: booking.prepHours || 1,
      total_booking_hours: booking.totalBookingHours || 0,
      total_price: booking.totalPrice,
      status: 'pending'
    }])
    .select()
  
  if (error) throw error
  return data[0]
}

export const updateBookingStatus = async (id, status) => {
  if (!supabase) return null
  const { data, error } = await supabase
    .from(bookingsTable)
    .update({ status })
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export const getBookingsByEmail = async (email) => {
  if (!supabase) return []
  const { data, error } = await supabase
    .from(bookingsTable)
    .select('*')
    .eq('client_email', email.toLowerCase())
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export const clientsTable = 'clients'

export const getClients = async () => {
  if (!supabase) return []
  const { data, error } = await supabase
    .from(clientsTable)
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export const getClientByEmail = async (email) => {
  if (!supabase) return null
  try {
    const { data, error } = await supabase
      .from(clientsTable)
      .select('*')
      .eq('email', email.toLowerCase())
      .single()
    
    if (error && error.code !== 'PGRST116') {
      console.warn('getClientByEmail error:', error)
      return null
    }
    return data || null
  } catch (err) {
    console.warn('getClientByEmail exception:', err)
    return null
  }
}

export const createOrUpdateClient = async (clientData) => {
  if (!supabase) return null
  
  try {
    const existing = await getClientByEmail(clientData.email)
    
    if (existing) {
      const { data, error } = await supabase
        .from(clientsTable)
        .update({
          total_bookings: existing.total_bookings + 1,
          total_spent: (parseFloat(existing.total_spent) || 0) + parseFloat(clientData.totalPrice),
          last_booking_date: new Date().toISOString().split('T')[0]
        })
        .eq('id', existing.id)
        .select()
      
      if (error) {
        console.warn('createOrUpdateClient update error:', error)
        return null
      }
      return data[0]
    }
    
    const { data, error } = await supabase
      .from(clientsTable)
      .insert([{
        full_name: clientData.name,
        email: clientData.email.toLowerCase(),
        phone: clientData.phone || '',
        total_bookings: 1,
        total_spent: clientData.totalPrice,
        last_booking_date: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString()
      }])
      .select()
    
    if (error) {
      console.warn('createOrUpdateClient insert error:', error)
      return null
    }
    return data[0]
  } catch (err) {
    console.warn('createOrUpdateClient exception:', err)
    return null
  }
}