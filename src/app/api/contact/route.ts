import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { DEFAULT_SETTINGS } from '@/types';
import { createClient } from '@supabase/supabase-js';

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

    // ─── 1. Guardar lead en Supabase (siempre, antes de intentar emails) ───────
    let savedLead = null;
    let leadSaveError = null;
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Variables de Supabase no configuradas (URL o ANON_KEY)');
      }

      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data: insertedLead, error: dbError } = await supabase
        .from('leads')
        .insert({
          name,
          email,
          phone: phone || null,
          message: message || null,
          service_type: service_type || null,
          modality: modality || 'presencial',
          source,
          status: 'new',
        })
        .select()
        .single();

      if (dbError) {
        console.error('❌ Error guardando lead en Supabase:', dbError);
        leadSaveError = dbError.message;
      } else {
        savedLead = insertedLead;
        console.log('✅ Lead guardado en Supabase con ID:', insertedLead?.id);
      }
    } catch (err: any) {
      console.error('❌ Excepción guardando lead en Supabase:', err.message);
      leadSaveError = err.message;
    }

    // ─── 2. Enviar emails vía Resend ──────────────────────────────────────────
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('⚠️ [API Contact] RESEND_API_KEY no configurada. Lead guardado en Supabase igualmente.');
      return NextResponse.json({
        success: true,
        savedToDatabase: !!savedLead,
        warning: 'RESEND_API_KEY no configurada. El lead fue guardado en la base de datos.',
      });
    }

    const resend = new Resend(apiKey);
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || DEFAULT_SETTINGS.site_name;
    const fromAddress = process.env.EMAIL_FROM || `${siteName} <onboarding@resend.dev>`;
    const adminRecipient = process.env.NOTIFICATION_EMAIL || DEFAULT_SETTINGS.contact_email;

    const adminSubject = `[Nueva Consulta Clínica] ${name} — ${service_type || 'Salud Mental'}`;

    // 2a. Email para el Equipo de Admisión / Psicólogos
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
          ${savedLead?.id ? `<p style="margin: 8px 0; font-size: 11px; color: #94a3b8;"><strong>ID interno:</strong> ${savedLead.id}</p>` : ''}
          
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
    let adminError = null;
    try {
      const adminRes = await resend.emails.send({
        from: fromAddress,
        to: [adminRecipient],
        subject: adminSubject,
        html: adminHtmlContent,
        reply_to: email,
      });

      if (adminRes.error) {
        console.error('❌ Error de Resend enviando email a administración:', adminRes.error);
        adminError = adminRes.error;
      } else {
        adminEmailData = adminRes.data;
        console.log('✅ Email enviado a administración con éxito:', adminRes.data?.id);
      }
    } catch (err: any) {
      console.error('❌ Excepción enviando email a administración:', err);
      adminError = err.message;
    }

    // 2b. Email de Confirmación para el Paciente
    let leadEmailData = null;
    let leadError = null;
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

      if (leadRes.error) {
        console.warn('⚠️ Nota sobre confirmación al paciente (puede requerir dominio verificado):', leadRes.error);
        leadError = leadRes.error;
      } else {
        leadEmailData = leadRes.data;
        console.log('✅ Email de confirmación enviado al paciente:', leadRes.data?.id);
      }
    } catch (err: any) {
      console.warn('⚠️ Confirmación al paciente omitida:', err.message);
      leadError = err.message;
    }

    return NextResponse.json({
      success: true,
      savedToDatabase: !!savedLead,
      leadId: savedLead?.id || null,
      adminEmail: adminEmailData,
      leadEmail: leadEmailData,
      adminError,
      leadError,
      dbError: leadSaveError,
    });
  } catch (error: any) {
    console.error('Error procesando request de contacto:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
