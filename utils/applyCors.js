export function applyCors(req, res) {
  const allowedOrigins = [
    'http://localhost:3000',
    'https://cotizador.albapesamascotas.net',
   // https://cotizador.albapesamascotas.net/
    // Si usas un dominio de pruebas, lo puedes agregar aquí:
    // 'https://test-cotizador.albapesamascotas.net',
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true; // CORS handled, detener el handler
  }

  return false; // CORS no bloqueó, continuar con el handler
}
