
import React, { useState, useRef } from 'react';

interface DropZoneProps {
  onFilesAdded: (files: File[]) => void;
  accept: string;
  multiple?: boolean;
  maxSizeMB?: number;
}

const DropZone: React.FC<DropZoneProps> = ({ onFilesAdded, accept, multiple = false, maxSizeMB = 10 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Explicitly cast to File[] to resolve unknown[] type inference error
    const files = Array.from(e.dataTransfer.files) as File[];
    validateAndAdd(files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Explicitly cast to File[] to resolve unknown[] type inference error
      validateAndAdd(Array.from(e.target.files) as File[]);
    }
  };

  const validateAndAdd = (files: File[]) => {
    const validFiles = files.filter(file => {
      const sizeValid = file.size <= maxSizeMB * 1024 * 1024;
      if (!sizeValid) alert(`${file.name} exceeds ${maxSizeMB}MB limit.`);
      return sizeValid;
    });
    if (validFiles.length > 0) {
      onFilesAdded(multiple ? validFiles : [validFiles[0]]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer bg-white group
        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`}
      onClick={() => inputRef.current?.click()}
    >
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
      />
      
      <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      </div>

      <h3 className="text-xl font-bold text-slate-800 mb-2">Select {multiple ? 'Files' : 'File'}</h3>
      <p className="text-slate-500 text-center max-w-xs">
        or drag and drop here. <br />
        <span className="text-xs mt-2 block font-medium">Max file size: {maxSizeMB}MB</span>
      </p>
    </div>
  );
};

export default DropZone;
