import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import './fileupload.css'
import { apiClient } from '../../../lib/api';
import { heicTo } from 'heic-to';
import ExifReader from 'exifreader';

export const Route = createFileRoute('/_authenticated/fileupload/')({
  component: RouteComponent,
})

interface FileEntry {
  id: string
  file: File
  fileName: string
  title: string
  description: string
  imageDate: string
  previewUrl: string
}

async function prepareFile(file: File): Promise<File> {
  if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
    const jpeg = await heicTo({
      blob: file,
      type: "image/jpeg",
      quality: 1
    })
    return new File(
      [jpeg as Blob],
      file.name.replace(/\.(heic|heif)$/i, ".jpg"),
      { type: "image/jpeg" }
    );
  }
  return file;
}

function RouteComponent() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(Array.from(e.dataTransfer.files));
  }

  const handleFiles = async (newFiles: File[]) => {
    const entries: FileEntry[] = await Promise.all(
      newFiles.map(async (file) => {
        const tags = await ExifReader.load(file);
        const imageDate = tags['DateTimeOriginal']?.description;
        let isoStringInput = new Date().toISOString();

        const parts = imageDate?.split(' ');
        if (parts && parts.length > 1) {
          const datePart = parts[0].replace(/:/g, '-');
          const timePart = parts[1];
          isoStringInput = `${datePart}T${timePart}Z`;
        } else if (parts && parts.length == 1) {
          isoStringInput = parts[0] + 'Z'
        }

        const uploadFile = await prepareFile(file);
        const previewUrl = URL.createObjectURL(uploadFile);

        return {
          id: crypto.randomUUID(),
          file: uploadFile,
          fileName: crypto.randomUUID(),
          title: '',
          description: '',
          imageDate: isoStringInput,
          previewUrl
        };
      })
    );

    setFiles(prev => [...prev, ...entries]);
  }

  const updateFileEntry = (id: string, field: keyof FileEntry, value: string) => {
    setFiles(prev => prev.map(entry =>
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  }

  const removeFile = (id: string) => {
    setFiles(prev => {
      const entry = prev.find(e => e.id === id);
      if (entry) {
        URL.revokeObjectURL(entry.previewUrl);
      }
      return prev.filter(e => e.id !== id);
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;

    setIsUploading(true);

    for (const entry of files) {
      const formData = new FormData();
      formData.append("file", entry.file);
      formData.append(
        "meta",
        new Blob(
          [JSON.stringify({
            title: entry.title,
            description: entry.description,
            fileName: entry.fileName,
            imageDate: entry.imageDate
          })],
          { type: "application/json" }
        )
      );

      await apiClient('images', {
        method: "POST",
        body: formData
      });
    }

    files.forEach(entry => URL.revokeObjectURL(entry.previewUrl));
    setFiles([]);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <form className="uploader-container" onSubmit={handleSubmit}>
      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <input
          ref={fileInputRef}
          id="fileInput"
          type="file"
          multiple
          accept="image/*"
          onChange={e => {
            const { files: selectedFiles } = e.target;
            if (selectedFiles == null) return;
            handleFiles(Array.from(selectedFiles));
          }}
          style={{ display: 'none' }}
        />
        <p>Drag and drop files here or click to browse</p>
      </div>

      {files.length > 0 && (
        <div className="file-list">
          <h3>Selected Files ({files.length}):</h3>
          {files.map(entry => (
            <div key={entry.id} className="file-entry">
              <div className="file-preview">
                <img src={entry.previewUrl} alt={entry.file.name} />
              </div>
              <div className="file-details">
                <div className="file-header">
                  <span className="original-filename">{entry.file.name}</span>
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeFile(entry.id)}
                  >
                    Remove
                  </button>
                </div>
                <input
                  className="uploadInput"
                  placeholder="File Name"
                  value={entry.fileName}
                  onChange={e => updateFileEntry(entry.id, 'fileName', e.target.value)}
                />
                <input
                  className="uploadInput"
                  placeholder="Title"
                  value={entry.title}
                  onChange={e => updateFileEntry(entry.id, 'title', e.target.value)}
                />
                <input
                  className="uploadInput"
                  placeholder="Description"
                  value={entry.description}
                  onChange={e => updateFileEntry(entry.id, 'description', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="upload-btn" disabled={files.length === 0 || isUploading}>
        {isUploading ? 'Uploading...' : `Upload ${files.length} Photo${files.length !== 1 ? 's' : ''}`}
      </button>
    </form>
  )
}
