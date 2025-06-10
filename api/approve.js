import { applyCors } from '../utils/applyCors';
export default async function handler(req, res) {
  const corsHandled = applyCors(req, res);
  if (corsHandled) return;

  if (req.method !== 'GET') {
    res.status(405).end();
    return;
  }

  const { id, token } = req.query;
  const expectedToken = Buffer.from(`${id}-mi-clave`).toString('base64');

  if (token !== expectedToken) {
    console.log(`❌ Intento de aprobar cotización ${id} con token inválido`);
    res.status(400).send('<h1>❌ Token inválido</h1>');
    return;
  }

  console.log(`✅ Cotización ${id} aprobada por revisor`);

  res.send(`
    <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 100px;">
      <h1 style="color: green;">✅ Cotización ${id} aprobada.</h1>
      <p>Gracias por su revisión.</p>
    </div>
  `);
}