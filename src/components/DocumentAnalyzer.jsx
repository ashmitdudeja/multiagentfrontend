import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, X, Loader2, Send } from 'lucide-react';

const ACCEPTED_TYPES = ['.pdf', '.doc', '.docx', '.txt'];

export default function DocumentAnalyzer({ onAnalyze, isAnalyzing }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) handleFile(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file && !isAnalyzing) {
      onAnalyze(file);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !isAnalyzing && inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 cursor-pointer transition-all duration-200 ${isDragging
              ? 'border-primary-400 bg-primary-500/10'
              : file
                ? 'border-success-400/40 bg-success-500/5'
                : 'border-white/10 hover:border-white/20 hover:bg-white/5'
            } ${isAnalyzing ? 'pointer-events-none opacity-60' : ''}`}
        >
          <input
            ref={inputRef}
            type="file"
            onChange={(e) => handleFile(e.target.files?.[0])}
            accept={ACCEPTED_TYPES.join(',')}
            className="hidden"
            disabled={isAnalyzing}
          />

          {file ? (
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="p-3 bg-success-500/10 rounded-xl">
                <FileText className="w-8 h-8 text-success-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-dark-100 truncate max-w-xs">{file.name}</p>
                <p className="text-xs text-dark-400 mt-1">{formatSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                className="text-xs text-danger-400 hover:text-danger-300 flex items-center gap-1 transition-colors"
              >
                <X className="w-3 h-3" />
                Remove
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="p-3 glass rounded-xl">
                <Upload className={`w-8 h-8 ${isDragging ? 'text-primary-400' : 'text-dark-400'}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-dark-200">
                  {isDragging ? 'Drop file here' : 'Drop a document or click to browse'}
                </p>
                <p className="text-xs text-dark-400 mt-1">
                  Supports {ACCEPTED_TYPES.join(', ')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!file || isAnalyzing}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing Document...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Analyze Document</span>
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
