import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from 'react'
import { Upload } from 'lucide-react'

interface FileDropzoneProps {
  onFileSelect: (file: File) => void
  acceptedTypes?: string[]
}

export default function FileDropzone({
  onFileSelect,
  acceptedTypes = ['.dxf', '.svg', '.ai', '.eps', '.dwg', '.step'],
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    (file: File) => {
      setSelectedFile(file)
      onFileSelect(file)
    },
    [onFileSelect],
  )

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const file = e.dataTransfer.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={[
        'relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-10 cursor-pointer transition-colors duration-200',
        isDragging
          ? 'border-primary bg-blue-50'
          : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100',
      ].join(' ')}
    >
      <input
        ref={inputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleInputChange}
        className="hidden"
      />

      <Upload
        className={'w-10 h-10 ' + (isDragging ? 'text-primary' : 'text-gray-400')}
      />

      {selectedFile ? (
        <div className="text-center">
          <p className="font-sans text-sm font-semibold text-charcoal">
            {selectedFile.name}
          </p>
          <p className="font-serif text-xs text-gray-500 mt-1">
            {formatFileSize(selectedFile.size)}
          </p>
          <p className="font-serif text-xs text-primary mt-2 underline">
            Click or drop to replace
          </p>
        </div>
      ) : (
        <div className="text-center">
          <p className="font-sans text-sm font-semibold text-charcoal">
            Drag &amp; drop your file here
          </p>
          <p className="font-serif text-xs text-gray-500 mt-1">
            or click to browse
          </p>
          <p className="font-serif text-xs text-gray-400 mt-2">
            Accepted formats: {acceptedTypes.join(', ')}
          </p>
        </div>
      )}
    </div>
  )
}
