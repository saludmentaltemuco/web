import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const results: Record<string, any> = {
    env: {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseUrlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) || 'MISSING',
    },
    insertTest: null,
    insertError: null,
  };

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      results.insertError = 'Variables de entorno de Supabase no disponibles en runtime';
      return NextResponse.json(results);
    }

    const supabase = createClient(url, key);

    const { data, error } = await supabase
      .from('leads')
      .insert({
        name: 'TEST_DIAGNOSTICO',
        email: 'test@diagnostico.cl',
        phone: null,
        message: 'Test diagnóstico - puedes eliminar este registro',
        service_type: 'Diagnóstico',
        modality: 'presencial',
        source: 'website',
        status: 'new',
      })
      .select()
      .single();

    if (error) {
      results.insertError = {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      };
    } else {
      results.insertTest = { success: true, id: data?.id };
    }
  } catch (err: any) {
    results.insertError = { exception: err.message };
  }

  return NextResponse.json(results);
}
