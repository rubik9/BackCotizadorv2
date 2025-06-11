import { applyCors } from '../utils/applyCors';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  const corsHandled = applyCors(req, res);
  if (corsHandled) return;

  if (req.method !== 'GET') {
    res.status(405).end();
    return;
  }

  const { id, token } = req.query;

  // Decodificamos el token (esperamos un objeto JSON codificado en base64)
  let tokenData;
  try {
    tokenData = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
  } catch (err) {
    console.log('❌ Token inválido: formato incorrecto');
    return res.status(400).send('<h1>❌ Token inválido</h1>');
  }

  const { cotizacionId, usuarioEmail, usuarioNombre } = tokenData;

  // Validación básica por seguridad
  if (cotizacionId !== id || !usuarioEmail || !usuarioNombre) {
    console.log('❌ Token inválido: datos no coinciden');
    return res.status(400).send('<h1>❌ Token inválido</h1>');
  }

  console.log(`✅ Cotización ${cotizacionId} aprobada por revisor`);

  // Enviar correo al usuario que generó la cotización
  try {
    await resend.emails.send({
      from: 'cotizaciones@albapesa.com.mx',
      to: usuarioEmail,
      subject: `Cotización ${cotizacionId} APROBADA`,
      html: `
        <p>Hola ${usuarioNombre},</p>
        <p>La cotización <strong>${cotizacionId}</strong> ha sido <strong>APROBADA</strong> por el revisor.</p>
        <p>Gracias.</p>
      `,
    });
  } catch (err) {
    console.error('❌ Error al enviar correo de aprobación:', err);
    return res.status(500).send('<h1>Error al notificar al usuario</h1>');
  }

  // Mostrar mensaje de éxito en navegador
  res.send(`
    <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 100px;">
      <h1 style="color: green;">✅ Cotización ${cotizacionId} aprobada.</h1>
      <p>Se ha notificado a <strong>${usuarioEmail}</strong>.</p>
    </div>
  `);
}
