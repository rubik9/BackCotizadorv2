import { Resend } from "resend";
import { applyCors } from "../utils/applyCors";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  const corsHandled = applyCors(req, res);
  if (corsHandled) return;

  if (req.method !== "POST") {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
    return;
  }

  const { cotizacionId, pdfBase64, revisoresEmails, creador, revision } =
    req.body;

  console.log(
    `✅ Recibido create-cotizacion: ${cotizacionId} + ${creador} + ${revision}`
  );
  console.log(`📨 Revisores:`, revisoresEmails);

  if (revision === true) {
    try {
      const token = Buffer.from(`${cotizacionId}-mi-clave`).toString("base64");

      const approveLink = `${process.env.BACKEND_URL}/api/approve?id=${cotizacionId}&token=${token}`;
      const rejectLink = `${process.env.BACKEND_URL}/api/reject?id=${cotizacionId}&token=${token}`;

      await resend.emails.send({
        from: "cotizaciones@albapesa.com.mx",
        to: revisoresEmails,
        subject: `Cotización #${cotizacionId} pendiente de aprobación`,
        html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>📋 Cotización #${cotizacionId}</h2>
          <p>Se ha generado una nueva cotización por ${creador} y requiere su aprobación.</p>
          <p>
            <a href="${approveLink}" style="background-color: green; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">✅ Aprobar</a>
            &nbsp;
            <a href="${rejectLink}" style="background-color: red; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">❌ Rechazar</a>
          </p>
          <p>Gracias.</p>
        </div>
      `,
        attachments: [
          {
            filename: `Cotizacion_${cotizacionId}.pdf`,
            content: pdfBase64,
            encoding: "base64",
          },
        ],
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("❌ Error al enviar correo:", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  } else {
    try {
      await resend.emails.send({
        from: "cotizaciones@albapesa.com.mx",
        to: revisoresEmails,
        subject: `Cotización #${cotizacionId} `,
        html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>📋 Cotización #${cotizacionId}</h2>
          <p>Generaste tu nueva cotizacion ${creador} </p>
         
          <p>Gracias.</p>
        </div>
      `,
        attachments: [
          {
            filename: `Cotizacion_${cotizacionId}.pdf`,
            content: pdfBase64,
            encoding: "base64",
          },
        ],
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("❌ Error al enviar correo:", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
