import React, { useRef, useState } from 'react';

const UploadArea = ({ onUpload }) => {
  const fileInputRef = useRef(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onUpload(Array.from(e.target.files));
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={onButtonClick}
      className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
        isDragActive
          ? 'border-primary-500 bg-primary-500/10'
          : 'border-dark-700 hover:border-dark-600 bg-dark-800/20'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleChange}
        className="hidden"
        accept="image/jpeg,image/png,model/gltf-binary,model/gltf+json,video/mp4"
      />
      <div className="space-y-4">
        <div className="text-5xl">📁</div>
        <div>
          <p className="text-lg font-medium text-gray-300">
            {isDragActive ? 'Drop your files here' : 'Drag & drop or click to upload'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            JPG, PNG, GLTF, GLB, MP4 · Max 10MB
          </p>
        </div>
        <div className="flex justify-center gap-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
          <span className="px-3 py-1 rounded-full bg-dark-700">Logo</span>
          <span className="px-3 py-1 rounded-full bg-dark-700">Images</span>
          <span className="px-3 py-1 rounded-full bg-dark-700">3D Models</span>
        </div>
      </div>
    </div>
  );
};

export default UploadArea;
