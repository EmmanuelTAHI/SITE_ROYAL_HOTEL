// api/genius-proxy.js — Proxy Vercel pour GeniusPay
const GENIUS_BASE = 'https://pay.genius.ci'

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  const isSandbox = (process.env.GENIUS_MODE || 'production') === 'sandbox'
  const publicKey = isSandbox
    ? (process.env.GENIUS_SANDBOX_PUBLIC_KEY || process.env.VITE_GENIUS_SANDBOX_PUBLIC_KEY)
    : (process.env.GENIUS_PUBLIC_KEY || process.env.VITE_GENIUS_PUBLIC_KEY)
  const secretKey = isSandbox
    ? process.env.GENIUS_SANDBOX_SECRET_KEY
    : process.env.GENIUS_SECRET_KEY

  if (!publicKey || !secretKey) {
    return res.status(500).json({
      success: false,
      error: { code: 'CONFIG_ERROR', message: 'Clés GeniusPay non configurées.' },
    })
  }

  // /api/genius-proxy/api/v1/merchant/payments → /api/v1/merchant/payments
  const targetPath = req.url.replace(/^\/api\/genius-proxy/, '').replace(/^\/api\/genius/, '')
  const url = `${GENIUS_BASE}${targetPath}`

  try {
    const body = req.method !== 'GET' && req.body
      ? JSON.stringify(req.body)
      : undefined

    const response = await fetch(url, {
      method:  req.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept':       'application/json',
        'X-API-Key':    publicKey,
        'X-API-Secret': secretKey,
      },
      body,
    })

    const ct   = response.headers.get('content-type') || 'application/json'
    const text = await response.text()

    res.setHeader('Content-Type', ct)
    return res.status(response.status).send(text)
  } catch (err) {
    console.error('[genius-proxy]', err.message)
    return res.status(502).json({
      success: false,
      error: { code: 'PROXY_ERROR', message: 'Erreur de connexion au service de paiement.' },
    })
  }
}
