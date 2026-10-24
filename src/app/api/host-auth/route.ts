import { NextResponse } from 'next/server'

const DEFAULT_HOST_PASSWORD = 'Quiz007!'

export async function GET() {
  const sitePassword =
    process.env.SITE_PASSWORD?.trim() || DEFAULT_HOST_PASSWORD
  return NextResponse.json({
    ok: true,
    passwordRequired: Boolean(sitePassword),
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
