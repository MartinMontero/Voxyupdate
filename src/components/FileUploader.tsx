import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, File, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatFileSize } from '../lib/utils';
import { Button } from './ui/Button';

interface FileUploaderProps {
  projectId: string;
}

export function FileUploader({ projectId }: FileUploaderProps) {
  const { addDocument, updateDocument, removeDocument, uploadProgress } = useStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const document = addDocument(projectId, file);
      
      // Simulate file upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          updateDocument(projectId, document.id, { 
            status: 'processing',
            uploadProgress: 100 
          });
          
          // Simulate processing
          setTimeout(() => {
            updateDocument(projectId, document.id, { 
              status: 'ready',
              content: `Processed content for ${file.name}`,
              preview: `This is a preview of ${file.name}. The document contains important information that will be used to generate engaging podcast discussions.`
            });
          }, 2000);
        } else {
          updateDocument(projectId, document.id, { uploadProgress: progress });
        }
      }, 200);
    });
  }, [projectId, addDocument, updateDocument]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/markdown': ['.md']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: true
  });

  const { currentProject } = useStore();
  const documents = currentProject?.documents || [];

  return (
    <div className="space-y-4">
      <motion.div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200
          ${isDragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
        `}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          {isDragActive ? 'Drop files here' : 'Upload your documents'}
        </p>
        <p className="text-gray-500 mb-4">
          Drag & drop files or click to browse
        </p>
        <p className="text-sm text-gray-400">
          Supports PDF, TXT, DOCX, MD • Max 50MB per file
        </p>
      </motion.div>

      {documents.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Uploaded Documents</h3>
          {documents.map(document => (
            <DocumentItem
              key={document.id}
              document={document}
              onRemove={() => removeDocument(projectId, document.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface DocumentItemProps {
  document: any;
  onRemove: () => void;
}

function DocumentItem({ document, onRemove }: DocumentItemProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploading': return 'text-blue-600';
      case 'processing': return 'text-yellow-600';
      case 'ready': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'uploading': return 'Uploading...';
      case 'processing': return 'Processing...';
      case 'ready': return 'Ready';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl"
    >
      <div className="flex items-center space-x-3">
        <File className="h-8 w-8 text-gray-400" />
        <div>
          <p className="font-medium text-gray-900">{document.name}</p>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>{formatFileSize(document.size)}</span>
            <span>•</span>
            <span className={getStatusColor(document.status)}>
              {getStatusText(document.status)}
            </span>
          </div>
          {document.status === 'uploading' && document.uploadProgress !== undefined && (
            <div className="mt-2 w-32 bg-gray-200 rounded-full h-1">
              <div 
                className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                style={{ width: `${document.uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="text-gray-400 hover:text-red-600"
      >
        <X className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}