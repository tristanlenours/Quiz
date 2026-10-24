import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const DEFAULT_HOST_PASSWORD = 'Quiz007!'

export async function GET() {
  const env = process.env as Record<string, string | undefined>
  const sitePassword = env['SITE_PASSWORD']?.trim() || DEFAULT_HOST_PASSWORD

  const supabaseUrl = (
    env['SUPABASE_URL'] ||
    env['NEXT_PUBLIC_SUPABASE_URL'] ||
    ''
  )
    .trim()
    .replace(/^["']|["']$/g, '')

  const supabaseAnonKey = (
    env['SUPABASE_ANON_KEY'] ||
    env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] ||
    ''
  )
    .trim()
    .replace(/^["']|["']$/g, '')

  return NextResponse.json({
    ok: true,
    passwordRequired: Boolean(sitePassword),
    supabaseConfigured: Boolean(supabaseUrl && supabaseAnonKey),
    supabaseUrl,
    supabaseAnonKey,
  })
}

export async function POST(request: Request) {
  const env = process.env as Record<string, string | undefined>
  const sitePassword = env['SITE_PASSWORD']?.trim() || DEFAULT_HOST_PASSWORD

  try {
    const body = await request.json()
    const candidate =
      typeof body?.password === 'string' ? body.password.trim() : ''
    if (candidate === sitePassword) {
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json(
      { ok: false, error: 'Mot de passe incorrect' },
      { status: 401 }
    )
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Requête invalide' },
      { status: 400 }
    )
  }
}
