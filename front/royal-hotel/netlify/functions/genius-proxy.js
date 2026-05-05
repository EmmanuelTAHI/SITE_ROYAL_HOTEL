// netlify/functions/genius-proxy.js
// Proxy serverless GeniusPay — auth injectée côté serveur (jamais côté client)
//
// En production Netlify : définir les variables d'env dans
//   Site Settings > Environment Variables :
//   GENIUS_PUBLIC_KEY = pk_live_...
//   GENIUS_SECRET_KEY = sk_live_...

const GENIUS_BASE = 'https://pay.genius.ci'

exports.handler = async (event) => {
  const cors = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
  }

  // Preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' }
  }

  const isSandbox = (process.env.GENIUS_MODE || 'production') === 'sandbox'
  const publicKey = isSandbox
    ? (process.env.GENIUS_SANDBOX_PUBLIC_KEY || process.env.VITE_GENIUS_SANDBOX_PUBLIC_KEY)
    : (process.env.GENIUS_PUBLIC_KEY || process.env.VITE_GENIUS_PUBLIC_KEY)
  const secretKey = isSandbox
    ? (process.env.GENIUS_SANDBOX_SECRET_KEY || process.env.GENIUS_SECRET_KEY)
    : process.env.GENIUS_SECRET_KEY

  if (!publicKey || !secretKey) {
    return {
      statusCode: 500,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: { code: 'CONFIG_ERROR', message: 'Clés GeniusPay non configurées sur le serveur.' },
      }),
    }
  }

  // Reconstruit le chemin cible :
  // /api/genius/api/v1/merchant/payments → /api/v1/merchant/payments
  const targetPath = event.path
    .replace(/^\/.netlify\/functions\/genius-proxy/, '')
    .replace(/^\/api\/genius/, '')

  const qs  = event.rawQuery ? `?${event.rawQuery}` : ''
  const url = `${GENIUS_BASE}${targetPath}${qs}`

  try {
    const response = await fetch(url, {
      method:  event.httpMethod,
      headers: {
        'Content-Type':  'application/json',
        'Accept':        'application/json',
        'X-API-Key':     publicKey,
        'X-API-Secret':  secretKey,
      },
      body: event.body && event.httpMethod !== 'GET' ? event.body : undefined,
    })

    const ct   = response.headers.get('content-type') || 'application/json'
    const body = await response.text()

    return {
      statusCode: response.status,
      headers:    { ...cors, 'Content-Type': ct },
      body,
    }
  } catch (err) {
    console.error('[genius-proxy]', err.message)
    return {
      statusCode: 502,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: { code: 'PROXY_ERROR', message: 'Erreur de connexion au service de paiement.' },
      }),
    }
  }
}
