import React, { useRef, useState } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  id: string;
  label: string;
  onImageUpload: (file: File, previewUrl: string) => void;
  previewUrl?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, onImageUpload, previewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      onImageUpload(file, preview);
    }
  };

  const handleDragEvents = (e: React.DragEvent<HTMLLabelElement>, dragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    handleDragEvents(e, false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      onImageUpload(file, preview);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 shadow-lg">
      <p className="text-lg font-semibold mb-4 text-center">{label}</p>
      <label
        htmlFor={id}
        onClick={(e) => {
          // prevent double file dialog on click
          if ((e.target as HTMLElement).tagName !== 'INPUT') {
            e.preventDefault();
            handleClick();
          }
        }}
        onDragEnter={(e) => handleDragEvents(e, true)}
        onDragLeave={(e) => handleDragEvents(e, false)}
        onDragOver={(e) => handleDragEvents(e, true)}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${
          isDragging ? 'border-purple-500 bg-gray-700/50' : 'border-gray-600 hover:border-gray-500'
        }`}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Náhled" className="object-cover w-full h-full rounded-lg" />
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400">
            <UploadIcon />
            <p className="mb-2 text-sm">
              <span className="font-semibold">Klikněte pro nahrání</span> nebo přetáhněte soubor
            </p>
            <p className="text-xs">PNG, JPG nebo WEBP</p>
          </div>
        )}
        <input
          id={id}
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};