import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const DEFAULT_HOST_PASSWORD = 'Quiz007!'

export async function GET() {
  const sitePassword =
    process.env.SITE_PASSWORD?.trim() || DEFAULT_HOST_PASSWORD

  const supabaseUrl = (
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    ''
  )
    .trim()
    .replace(/^["']|["']$/g, '')

  const supabaseAnonKey = (
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
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
  const sitePassword =
    process.env.SITE_PASSWORD?.trim() || DEFAULT_HOST_PASSWORD

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
