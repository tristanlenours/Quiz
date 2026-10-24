import { NextResponse } from 'next/server'

export interface MusicTrackResult {
  trackId: number
  title: string
  artist: string
  album: string
  previewUrl: string
  coverUrl: string
  releaseYear: string
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')?.trim()

  if (!query) {
    return NextResponse.json({ tracks: [] })
  }

  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
      query
    )}&media=music&entity=song&limit=12&country=FR`

    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) {
      return NextResponse.json(
        { error: 'Erreur lors de la recherche musicale' },
        { status: 502 }
      )
    }

    const data = await res.json()
    const tracks: MusicTrackResult[] = (data.results || [])
      .filter((item: any) => Boolean(item.previewUrl))
      .map((item: any) => ({
        trackId: item.trackId,
        title: item.trackName,
        artist: item.artistName,
        album: item.collectionName || '',
        previewUrl: item.previewUrl,
        coverUrl: (item.artworkUrl100 || '').replace('100x100bb', '400x400bb'),
        releaseYear: item.releaseDate
          ? new Date(item.releaseDate).getFullYear().toString()
          : '',
      }))

    return NextResponse.json({ tracks })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Erreur réseau iTunes API' },
      { status: 500 }
    )
  }
}
