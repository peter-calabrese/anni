import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import './fileupload.css'
import { apiClient } from '../../../lib/api';
import { heicTo } from 'heic-to';
import ExifReader from 'exifreader';
export const Route = createFileRoute('/_authenticated/fileupload/')({
  component: RouteComponent,
})
interface DataState {
  title: string,
  description: string,
  file: File | null
  fileName: string
  imageDate: String
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

  const [data, setData] = useState<DataState>({
    file: null,
    description: '',
    title: '',
    fileName: '',
    imageDate: ''
  })
  const [isDragging, setIsDragging] = useState(false);

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
    handleFile(e.dataTransfer.files[0])
  }

  const handleFile = async (file: File) => {
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

    let uploadFile = await prepareFile(file);

    setData(prevState => (
      {
        ...prevState,
        file: uploadFile,
        fileName: crypto.randomUUID(),
        imageDate: isoStringInput
      }
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (data.file == null || data.title == null || data.description == null) return
    const formData = new FormData();
    formData.append("file", data.file)
    formData.append(
      "meta",
      new Blob(
        [JSON.stringify({ title: data.title, description: data.description, fileName: data.fileName, imageDate: data.imageDate })],
        { type: "application/json" }
      )
    );

    await apiClient('images', {
      method: "POST",
      body: formData
    }).then(() => setData({
      description: "",
      file: null,
      fileName: "",
      imageDate: "",
      title: ""
    }))


  }
  return (
    <form className="uploader-container" onSubmit={handleSubmit} >
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
          onChange={e => {
            const { files } = e.target
            if (files == null) return;
            handleFile(files[0])
          }}
          style={{ display: 'none' }}
        />
        <p>Drag and drop files here or click to browse</p>
      </div>
      {data.file && <div className="file-list">
        <h3>Selected Files:</h3>
        <div className="file-item">
          <span>{data.file.name} - {data.imageDate}</span>
          <button onClick={() => {
            if (!fileInputRef.current) return
            fileInputRef.current.value = ""
            setData(prev => ({ ...prev, file: null }))
          }}>Remove</button>
        </div>
      </div>
      }
      <input className='uploadInput' placeholder='File Name' onChange={e => setData(prev => ({ ...prev, fileName: e.target.value }))} value={data.fileName} />

      <input className='uploadInput' placeholder='Title' onChange={e => setData(prev => ({ ...prev, title: e.target.value }))} value={data.title} />
      <input className='uploadInput' placeholder='Description' name="description" onChange={e => setData(prev => ({ ...prev, description: e.target.value }))} value={data.description} />

      <button className="upload-btn">
        Upload Photo
      </button>
    </form>
  )

}
