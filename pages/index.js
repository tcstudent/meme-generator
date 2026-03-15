import { useState, useEffect } from 'react'
import UploadArea from '../components/UploadArea'

export default function Home() {
  const [imageSrc, setImageSrc] = useState(null)
  const [objectUrl, setObjectUrl] = useState(null)

  const [topText, setTopText] = useState('TOP TEXT')
  const [bottomText, setBottomText] = useState('BOTTOM TEXT')
  const [topSize, setTopSize] = useState(48)
  const [bottomSize, setBottomSize] = useState(48)

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [objectUrl])

  const handleImageSelect = (url, file) => {
    if (objectUrl) URL.revokeObjectURL(objectUrl)
    setObjectUrl(url)
    setImageSrc(url)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-start p-8">
      <div className="w-full max-w-5xl">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Meme Generator — Upload</h1>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-3">
            <label className="block text-sm text-gray-300">Top text</label>
            <input value={topText} onChange={(e) => setTopText(e.target.value)} className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white" />
            <div className="flex items-center gap-3 meme-controls">
              <label className="text-sm text-gray-300">Size</label>
              <input type="range" min="12" max="120" value={topSize} onChange={(e) => setTopSize(Number(e.target.value))} />
              <div className="text-sm text-gray-300 w-12 text-right">{topSize}px</div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm text-gray-300">Bottom text</label>
            <input value={bottomText} onChange={(e) => setBottomText(e.target.value)} className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white" />
            <div className="flex items-center gap-3 meme-controls">
              <label className="text-sm text-gray-300">Size</label>
              <input type="range" min="12" max="120" value={bottomSize} onChange={(e) => setBottomSize(Number(e.target.value))} />
              <div className="text-sm text-gray-300 w-12 text-right">{bottomSize}px</div>
            </div>
          </div>
        </section>

        <div className="mb-4 flex items-center gap-3">
          <UploadArea
            imageSrc={imageSrc}
            onImageSelect={handleImageSelect}
            topText={topText}
            bottomText={bottomText}
            topSize={topSize}
            bottomSize={bottomSize}
          />

          {imageSrc && (
            <div className="flex flex-col gap-2">
              <button
                onClick={async () => {
                  try {
                    const html2canvas = (await import('html2canvas')).default
                    const el = document.querySelector('.w-full.max-w-3xl > div')
                    if (!el) return
                    const canvas = await html2canvas(el, { backgroundColor: null, useCORS: true, scale: 2 })
                    canvas.toBlob((blob) => {
                      if (!blob) return
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = 'meme.png'
                      document.body.appendChild(a)
                      a.click()
                      a.remove()
                      URL.revokeObjectURL(url)
                    })
                  } catch (err) {
                    console.error('Capture failed', err)
                  }
                }}
                className="px-4 py-2 rounded bg-primary text-white font-semibold shadow"
              >
                Download Meme
              </button>

              <button
                onClick={() => {
                  setTopText('')
                  setBottomText('')
                }}
                className="px-3 py-2 rounded border border-gray-700 text-gray-200 text-sm"
              >
                Clear Text
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
