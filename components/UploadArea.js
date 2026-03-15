import { useRef, useState, useCallback, useEffect } from 'react'

function clamp(v, a = 0, b = 1) {
  return Math.max(a, Math.min(b, v))
}

export default function UploadArea({ onImageSelect, imageSrc, topText = '', bottomText = '', topSize = 48, bottomSize = 48 }) {
  const inputRef = useRef(null)
  const containerRef = useRef(null)
  const draggingRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const [topPos, setTopPos] = useState({ x: 0.5, y: 0.12 })
  const [bottomPos, setBottomPos] = useState({ x: 0.5, y: 0.88 })

  const handleFiles = useCallback(
    (files) => {
      const file = files && files[0]
      if (!file) return
      if (!file.type.startsWith('image/')) return
      const url = URL.createObjectURL(file)
      onImageSelect(url, file)
    },
    [onImageSelect]
  )

  const onDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const onDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isDragging) setIsDragging(true)
  }

  const onDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  useEffect(() => {
    // Reset positions when a new image is loaded
    if (imageSrc) {
      setTopPos({ x: 0.5, y: 0.12 })
      setBottomPos({ x: 0.5, y: 0.88 })
    }
  }, [imageSrc])

  const onOverlayPointerDown = (e, which) => {
    e.stopPropagation()
    e.currentTarget.setPointerCapture && e.currentTarget.setPointerCapture(e.pointerId)
    draggingRef.current = which
  }

  const onContainerPointerMove = (e) => {
    if (!draggingRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clamp((e.clientX - rect.left) / rect.width)
    const y = clamp((e.clientY - rect.top) / rect.height)
    if (draggingRef.current === 'top') setTopPos({ x, y })
    if (draggingRef.current === 'bottom') setBottomPos({ x, y })
  }

  const onContainerPointerUp = (e) => {
    if (!draggingRef.current) return
    try {
      e.currentTarget.releasePointerCapture && e.currentTarget.releasePointerCapture(e.pointerId)
    } catch (err) {}
    draggingRef.current = null
  }

  return (
    <div className="w-full max-w-3xl">
      <div
        ref={containerRef}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragEnter={onDragOver}
        onDragLeave={onDragLeave}
        onPointerMove={onContainerPointerMove}
        onPointerUp={onContainerPointerUp}
        className={`relative w-full min-h-[18rem] rounded-xl border-2 border-dashed border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 transition overflow-hidden ${
          isDragging ? 'dropzone-dragover bg-gray-800/80' : ''
        }`}
        role="button"
        onClick={() => inputRef.current && inputRef.current.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {imageSrc ? (
          <>
            <img src={imageSrc} alt="Preview" className="w-full h-full object-contain bg-black" />

            {/* Top meme text (draggable) */}
            <div
              role="button"
              aria-label="Top text"
              onPointerDown={(e) => onOverlayPointerDown(e, 'top')}
              className="meme-text absolute select-none cursor-grab"
              style={{
                left: `${topPos.x * 100}%`,
                top: `${topPos.y * 100}%`,
                transform: 'translate(-50%, -50%)',
                fontSize: `${topSize}px`,
                textAlign: 'center',
                whiteSpace: 'pre'
              }}
            >
              {topText}
            </div>

            {/* Bottom meme text (draggable) */}
            <div
              role="button"
              aria-label="Bottom text"
              onPointerDown={(e) => onOverlayPointerDown(e, 'bottom')}
              className="meme-text absolute select-none cursor-grab"
              style={{
                left: `${bottomPos.x * 100}%`,
                top: `${bottomPos.y * 100}%`,
                transform: 'translate(-50%, -50%)',
                fontSize: `${bottomSize}px`,
                textAlign: 'center',
                whiteSpace: 'pre'
              }}
            >
              {bottomText}
            </div>

            <div className="pointer-events-none absolute inset-0 flex items-start justify-end p-3">
              <div className="bg-black/40 text-xs text-gray-100 px-2 py-1 rounded">Click to replace</div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 text-center p-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            <div className="text-lg font-semibold">Drop an image here or click to upload</div>
            <div className="text-sm text-gray-400">PNG, JPG, GIF — anything works</div>
          </div>
        )}
      </div>
    </div>
  )
}
