export function applyCors(req, res) {
  const allowedOrigins = [
    'http://localhost:3000' // tu dominio real
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Responder a preflight (OPTIONS) y terminar la respuesta
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true; // CORS handled
  }

  return false; // Continue with normal logic
}
