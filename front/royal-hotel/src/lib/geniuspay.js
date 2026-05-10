// lib/geniuspay.js — Intégration GeniusPay directe (Wave)
// Doc : https://pay.genius.ci/docs/api
//
// GeniusPay configure CORS (Access-Control-Allow-Origin: *)
// → l'API peut être appelée directement depuis le navigateur avec la clé publique.
// La clé secrète (sk_) reste uniquement pour les webhooks côté serveur.

// En dev : Vite proxy /api/genius/* → https://pay.genius.ci/*
// En prod (Netlify) : redirect /api/genius/* → /.netlify/functions/genius-proxy
const IS_SANDBOX = (import.meta.env.VITE_GENIUS_MODE || 'production') === 'sandbox'
const BASE_URL   = '/api/genius/api/v1/merchant'
const PUBLIC_KEY = IS_SANDBOX
  ? import.meta.env.VITE_GENIUS_SANDBOX_PUBLIC_KEY
  : import.meta.env.VITE_GENIUS_PUBLIC_KEY

export const paymentMode = IS_SANDBOX ? 'sandbox' : 'production'

// ─── Création d'un paiement Wave ──────────────────────────────────────────────
// POST /api/v1/merchant/payments
// Retourne : { success, data: { reference, checkout_url, payment_url, status } }
export async function createPaymentSession({
  amount,
  description,
  customerName,
  customerPhone,
  successUrl,
  errorUrl,
}) {
  const payload = {
    amount,
    currency:       'XOF',
    payment_method: 'wave',
    description:    description || 'Réservation Royal Hotel',
    customer: {
      name:    customerName,
      phone:   customerPhone,
      country: 'CI',
    },
    success_url: successUrl,
    error_url:   errorUrl,
    metadata: {
      source:       'royal_hotel_website',
      merchant_ref: `RH-${Date.now()}`,
    },
  }

  try {
    const res = await fetch(`${BASE_URL}/payments`, {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept':       'application/json',
        'X-API-Key':    PUBLIC_KEY,
      },
      body: JSON.stringify(payload),
    })

    // Lire le corps comme texte d'abord pour détecter les erreurs HTML (Imunify360, etc.)
    const rawText = await res.text()

    // Détecter une réponse HTML (firewall, bot-protection, etc.)
    if (rawText.trim().startsWith('<') || rawText.includes('Imunify360') || rawText.includes('bot-protection')) {
      return {
        success: false,
        error:   IS_SANDBOX
          ? 'Le sandbox GeniusPay est temporairement indisponible (protection anti-bot). Réessayez dans quelques minutes ou contactez-nous directement.'
          : 'Le service de paiement est momentanément inaccessible. Veuillez réessayer ou nous contacter.',
        sandboxBlocked: IS_SANDBOX,
      }
    }

    let data
    try { data = JSON.parse(rawText) } catch {
      return { success: false, error: 'Réponse inattendue du service de paiement.' }
    }

    if (res.ok && data.success) {
      const paymentUrl =
        data.data?.payment_url  ||
        data.data?.checkout_url ||
        null

      if (paymentUrl) {
        return { success: true, paymentUrl, reference: data.data?.reference || null }
      }

      return { success: false, error: "Le service de paiement n'a pas retourné d'URL. Réessayez." }
    }

    return {
      success: false,
      error:   data.error?.message || data.message || "Erreur lors de l'initialisation du paiement.",
    }
  } catch (err) {
    // Erreur réseau
    const isOffline = !navigator.onLine
    return {
      success: false,
      error: isOffline
        ? 'Pas de connexion internet. Vérifiez votre réseau et réessayez.'
        : 'Impossible de contacter le service de paiement. Vérifiez votre connexion.',
    }
  }
}

// ─── Vérification du statut d'un paiement ────────────────────────────────────
// GET /api/v1/merchant/payments/{reference}
// Statuts : pending | processing | completed | failed | cancelled | refunded | expired
export async function getPaymentStatus(reference) {
  if (!reference) return { success: false, error: 'Référence manquante.' }

  try {
    const res  = await fetch(`${BASE_URL}/payments/${reference}`, {
      headers: { 'Accept': 'application/json', 'X-API-Key': PUBLIC_KEY },
    })
    const data = await res.json()

    if (res.ok && data.success) {
      const status = (data.data?.status || '').toLowerCase()
      return {
        success:   true,
        status,
        paid:      status === 'completed',
        failed:    ['failed', 'cancelled', 'expired'].includes(status),
        reference: data.data?.reference,
        amount:    data.data?.amount,
        netAmount: data.data?.net_amount,
      }
    }

    return { success: false, error: data.error?.message || 'Statut introuvable.' }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

// ─── Parse les paramètres de retour GeniusPay ────────────────────────────────
export function parsePaymentReturn() {
  const p = new URLSearchParams(window.location.search)
  return {
    status:    p.get('payment'),
    reference: p.get('reference') || p.get('transaction_ref') || null,
    txStatus:  p.get('status')    || null,
  }
}

// ─── Nettoie les paramètres de paiement de l'URL ─────────────────────────────
export function clearPaymentParams() {
  const url = new URL(window.location.href)
  ;['payment', 'reference', 'transaction_ref', 'status'].forEach(k =>
    url.searchParams.delete(k)
  )
  window.history.replaceState({}, '', url.toString())
}
