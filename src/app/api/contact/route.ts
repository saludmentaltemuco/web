import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { DEFAULT_SETTINGS } from '@/types';

// Create a singleton of Resend only if the API key exists
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, phone, message, service_type, modality, source = 'website' } = data;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos (nombre o correo)' },
        { status: 400 }
      );
    }

    if (!resend) {
      console.warn('RESEND_API_KEY no está configurada. Saltando envío de email.');
      return NextResponse.json({ success: true, warning: 'No API key configured' });
    }

    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || DEFAULT_SETTINGS.site_name;
    const fromAddress = process.env.EMAIL_FROM || `${siteName} <onboarding@resend.dev>`;
    const adminRecipient = process.env.NOTIFICATION_EMAIL || DEFAULT_SETTINGS.contact_email;

    const adminSubject = `[Nueva Consulta Clínica] ${name} — ${service_type || 'Salud Mental'}`;

    // 1. Email para el Equipo de Admisión / Psicólogos
    const adminHtmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #043F83; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 20px;">${siteName}</h1>
          <p style="color: #b4d3f2; margin: 6px 0 0 0; font-size: 13px;">Nueva Solicitud de Cita / Consulta Recibida</p>
        </div>
        <div style="padding: 24px; line-height: 1.6;">
          <p style="margin: 8px 0;"><strong>Paciente:</strong> ${name}</p>
          <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #043F83;">${email}</a></p>
          <p style="margin: 8px 0;"><strong>Teléfono / WhatsApp:</strong> ${phone || 'No especificado'}</p>
          <p style="margin: 8px 0;"><strong>Especialidad:</strong> <span style="background-color: #eef5fc; padding: 3px 8px; border-radius: 6px; font-weight: bold; color: #043F83;">${service_type || 'Consulta General'}</span></p>
          <p style="margin: 8px 0;"><strong>Modalidad:</strong> ${modality === 'online' ? 'Online (Telepsicología)' : 'Presencial en Temuco'}</p>
          <p style="margin: 8px 0;"><strong>Canal:</strong> ${source}</p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
          
          <p style="margin: 8px 0 4px 0; font-weight: bold;">Mensaje / Motivo de Consulta:</p>
          <div style="background-color: #f8fafc; padding: 16px; border-left: 4px solid #08A2D6; border-radius: 6px; font-size: 13px; color: #334155; white-space: pre-wrap;">${message || 'Sin mensaje adicional'}</div>
        </div>
        <div style="background-color: #f1f5f9; padding: 12px 24px; text-align: center; font-size: 11px; color: #64748b;">
          Puedes responder directamente a este correo para comunicarte con ${name}.
        </div>
      </div>
    `;

    let adminEmailData = null;
    try {
      const adminRes = await resend.emails.send({
        from: fromAddress,
        to: [adminRecipient],
        subject: adminSubject,
        html: adminHtmlContent,
        reply_to: email,
      });
      adminEmailData = adminRes.data;
    } catch (err: any) {
      console.error('Error enviando email a administración:', err);
    }

    // 2. Email de Confirmación para el Paciente
    let leadEmailData = null;
    try {
      const leadSubject = `Hemos recibido tu solicitud de atención — ${siteName}`;

      const leadHtmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #043F83; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 20px;">${siteName}</h1>
            <p style="color: #b4d3f2; margin: 6px 0 0 0; font-size: 13px;">Confirmación de Solicitud de Cita</p>
          </div>
          <div style="padding: 24px; line-height: 1.6;">
            <h2 style="color: #0f172a; font-size: 17px; margin-top: 0;">Hola ${name},</h2>
            <p style="font-size: 14px; color: #475569;">
              Hemos recibido tu solicitud de atención de manera confidencial. Nuestro equipo clínico se pondrá en contacto contigo a la brevedad para coordinar la fecha, hora y modalidad de tu sesión.
            </p>
            
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px; margin: 18px 0; font-size: 13px; color: #166534;">
              ✓ <strong>Solicitud registrada.</strong> Recuerda que emitimos boleta de honorarios para reembolso en Isapre y Seguros Complementarios.
            </div>

            <p style="font-size: 13px; color: #475569; margin-bottom: 4px;"><strong>Especialidad seleccionada:</strong> ${service_type || 'Psicología'}</p>
            <p style="font-size: 13px; color: #475569; margin-top: 0;"><strong>Modalidad:</strong> ${modality === 'online' ? 'Online' : 'Presencial en Temuco'}</p>

            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />

            <p style="font-size: 13px; color: #475569; margin-bottom: 8px;">¿Deseas una respuesta más rápida?</p>
            <div>
              ${DEFAULT_SETTINGS.contact_whatsapp ? `
                <a href="https://wa.me/${DEFAULT_SETTINGS.contact_whatsapp.replace(/\D/g, '')}" style="display: inline-block; background-color: #16a34a; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 8px; font-size: 13px; font-weight: bold;">
                  Escríbenos por WhatsApp
                </a>
              ` : ''}
            </div>
          </div>
          <div style="background-color: #f8fafc; padding: 14px 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #64748b;">
            ${siteName} — Temuco, Chile
          </div>
        </div>
      `;

      const leadRes = await resend.emails.send({
        from: fromAddress,
        to: [email],
        subject: leadSubject,
        html: leadHtmlContent,
      });
      leadEmailData = leadRes.data;
    } catch (err: any) {
      console.warn('Confirmación al paciente omitida:', err.message);
    }

    return NextResponse.json({
      success: true,
      adminEmail: adminEmailData,
      leadEmail: leadEmailData,
    });
  } catch (error: any) {
    console.error('Error procesando request de contacto:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
