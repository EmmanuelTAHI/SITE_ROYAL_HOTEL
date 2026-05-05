// lib/supabase.js — Client Supabase + sauvegarde des réservations
import { createClient } from '@supabase/supabase-js'
import { paymentMode } from './geniuspay'

const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ─── Sauvegarde une réservation confirmée ─────────────────────────────────────
export async function saveReservation(data) {
  console.log('[supabase] saveReservation → tentative insert:', data)
  const { error } = await supabase.from('reservations').insert({
    name:         data.name,
    email:        data.email   || null,
    phone:        data.phone   || null,
    room_label:   data.roomLabel,
    checkin:      data.checkin,
    checkout:     data.checkout,
    nights:       data.nights,
    persons:      data.persons,
    total_price:  data.finalPrice,
    payment_mode: paymentMode,
    status:       'confirmed',
  })
  if (error) {
    console.error('[supabase] saveReservation ERREUR:', error.message, error)
  } else {
    console.log('[supabase] saveReservation → succès ✓')
  }
  return !error
}
