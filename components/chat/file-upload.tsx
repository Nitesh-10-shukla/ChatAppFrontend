"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { 
  Paperclip, 
  Image, 
  FileText, 
  Camera,
  Video,
  Music,
  X
} from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File, type: string) => void;
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (acceptedTypes: string, fileType: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = acceptedTypes;
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Simulate upload progress
        setUploadProgress(0);
        const interval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev === null || prev >= 100) {
              clearInterval(interval);
              setTimeout(() => setUploadProgress(null), 1000);
              return 100;
            }
            return prev + 10;
          });
        }, 100);
        
        onFileSelect(file, fileType);
        setIsOpen(false);
      }
    };
    input.click();
  };

  const fileOptions = [
    {
      icon: Image,
      label: "Photo",
      accept: "image/*",
      type: "image",
      color: "text-green-600"
    },
    {
      icon: Video,
      label: "Video",
      accept: "video/*",
      type: "video",
      color: "text-red-600"
    },
    {
      icon: FileText,
      label: "Document",
      accept: ".pdf,.doc,.docx,.txt",
      type: "document",
      color: "text-blue-600"
    },
    {
      icon: Music,
      label: "Audio",
      accept: "audio/*",
      type: "audio",
      color: "text-purple-600"
    },
    {
      icon: Camera,
      label: "Camera",
      accept: "image/*",
      type: "camera",
      color: "text-gray-600"
    }
  ];

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-gray-100 rounded-full">
            <Paperclip className="h-5 w-5 text-gray-600" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2" side="top" align="start">
          <div className="space-y-1">
            {fileOptions.map((option) => (
              <Button
                key={option.type}
                variant="ghost"
                className="w-full justify-start h-12 px-3"
                onClick={() => handleFileSelect(option.accept, option.type)}
              >
                <option.icon className={`h-5 w-5 mr-3 ${option.color}`} />
                <span className="text-sm font-medium">{option.label}</span>
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {uploadProgress !== null && (
        <div className="fixed bottom-20 left-4 right-4 bg-white border rounded-lg shadow-lg p-4 z-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Uploading file...</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setUploadProgress(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Progress value={uploadProgress} className="h-2" />
          <span className="text-xs text-gray-500 mt-1">{uploadProgress}%</span>
        </div>
      )}
    </>
  );
}