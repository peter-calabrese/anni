import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import './fileupload.css'
import { apiClient } from '../../../lib/api';
import heic2any from "heic2any";

export const Route = createFileRoute('/_authenticated/fileupload/')({
  component: RouteComponent,
})
interface DataState {
  title: string,
  description: string,
  file: File | null
}

async function convertHeicToJpg(file: File): Promise<File> {
  const convertedBlob = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: 0.9, // optional
  });

  return new File(
    [convertedBlob as Blob],
    file.name.replace(/\.(heic|heif)$/i, ".jpg"),
    { type: "image/jpeg" }
  );
}
async function prepareFile(file: File): Promise<File> {
  if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
    console.log("converting")
    return await convertHeicToJpg(file);
  }
  return file;
}

function RouteComponent() {

  const [data, setData] = useState<DataState>({
    file: null,
    description: '',
    title: ''
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
    const uploadFile = await prepareFile(file);
    setData(prevState => (
      {
        ...prevState,
        file: uploadFile
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
        [JSON.stringify({ title: data.title, description: data.description })],
        { type: "application/json" }
      )
    );

    await apiClient('images', {
      method: "POST",
      body: formData
    })
  }
  return (
    <form className="uploader-container" onSubmit={handleSubmit} encType="multipart/form-data">
      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <input
          id="fileInput"
          type="file"
          multiple
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
          <span>{data.file.name}</span>
          <button onClick={() => { }}>Remove</button>
        </div>
      </div>
      }
      <input className='uploadInput' placeholder='Title' onChange={e => setData(prev => ({ ...prev, title: e.target.value }))} />
      <input className='uploadInput' placeholder='Description' name="description" onChange={e => setData(prev => ({ ...prev, description: e.target.value }))} />

      <button className="upload-btn">
        Upload Photo
      </button>
    </form>
  )

}
