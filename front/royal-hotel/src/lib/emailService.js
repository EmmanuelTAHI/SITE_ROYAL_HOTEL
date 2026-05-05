// lib/emailService.js — Confirmation de réservation par email (EmailJS)
//
// ─── Configuration EmailJS (dashboard : https://www.emailjs.com) ───────────────
//
// 1. Créer un compte EmailJS et connecter un service email (Gmail, etc.)
// 2. Créer un template avec ces variables :
//
//    {{to_name}}         → Nom du client
//    {{to_email}}        → Email du client (destination)
//    {{room_type}}       → Type de chambre
//    {{checkin_date}}    → Date d'arrivée
//    {{checkout_date}}   → Date de départ
//    {{nights}}          → Nombre de nuits
//    {{persons}}         → Nombre de personnes
//    {{total_price}}     → Montant total (ex : "12 000 FCFA")
//    {{customer_phone}}  → Téléphone du client
//    {{hotel_name}}      → Royal Hotel
//    {{hotel_phone}}     → +225 07 04 63 63 63
//    {{hotel_email}}     → royalhotelgb@gmail.com
//    {{hotel_address}}   → Grand-Bassam, Côte d'Ivoire
//
// 3. Copier vos identifiants dans .env :
//    VITE_EMAILJS_PUBLIC_KEY  → Account > API Keys
//    VITE_EMAILJS_SERVICE_ID  → Email Services > Service ID
//    VITE_EMAILJS_TEMPLATE_ID → Email Templates > Template ID

import emailjs from '@emailjs/browser'

const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID

const isConfigured = () => !!(PUBLIC_KEY && SERVICE_ID && TEMPLATE_ID
  && !PUBLIC_KEY.startsWith('votre_')
  && !SERVICE_ID.startsWith('votre_'))

const fmtDate = (s) => {
  if (!s) return ''
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

const fmtPrice = (n) =>
  typeof n === 'number' ? n.toLocaleString('fr-FR') + ' FCFA' : String(n)

export async function sendReservationConfirmation(data) {
  if (!data?.email) return { success: false, reason: 'no_email' }

  if (!isConfigured()) {
    console.warn('[emailService] EmailJS non configuré — ajoutez les clés dans .env')
    return { success: false, reason: 'not_configured' }
  }

  const params = {
    to_name:        data.name       || '',
    to_email:       data.email      || '',
    customer_phone: data.phone      || '',
    room_type:      data.roomLabel  || '',
    checkin_date:   fmtDate(data.checkin),
    checkout_date:  fmtDate(data.checkout),
    nights:         String(data.nights    ?? ''),
    persons:        String(data.persons   ?? ''),
    total_price:    fmtPrice(data.finalPrice),
    hotel_name:     'Royal Hotel',
    hotel_phone:    '+225 07 04 63 63 63 / +225 01 51 81 92 14',
    hotel_email:    'royalhotelgb@gmail.com',
    hotel_address:  'Grand-Bassam, Côte d\'Ivoire',
  }

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, params, PUBLIC_KEY)
    return { success: true }
  } catch (err) {
    console.error('[emailService] Erreur envoi email :', err)
    return { success: false, reason: 'send_error' }
  }
}
