import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const DEFAULT_HOST_PASSWORD = 'Quiz007!'

/**
 * Mot de passe des parties solo et du tableau des scores (D65) :
 * `SOLO_PASSWORD` s'il est défini, sinon le mot de passe du Studio (`SITE_PASSWORD`).
 * Il tient les inconnus à l'écart ; ce n'est pas une protection des données.
 */
function soloPassword(): string {
  const env = process.env as Record<string, string | undefined>
  return (
    env['SOLO_PASSWORD']?.trim() ||
    env['SITE_PASSWORD']?.trim() ||
    DEFAULT_HOST_PASSWORD
  )
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const candidate =
      typeof body?.password === 'string' ? body.password.trim() : ''
    if (candidate && candidate === soloPassword()) {
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
