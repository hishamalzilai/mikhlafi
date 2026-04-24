import imageCompression from 'browser-image-compression';
import { supabase } from '@/lib/supabase';

const BUCKET_NAME = 'archive-media';

// Compression options
const IMAGE_OPTIONS = {
  maxSizeMB: 0.5,          // Max 500KB
  maxWidthOrHeight: 1920,  // Max dimension
  useWebWorker: true,
  fileType: 'image/webp' as const,
};

const THUMBNAIL_OPTIONS = {
  maxSizeMB: 0.1,          // Max 100KB for thumbnails
  maxWidthOrHeight: 600,
  useWebWorker: true,
  fileType: 'image/webp' as const,
};

export interface UploadResult {
  url: string;
  thumbnailUrl?: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

export type UploadProgress = {
  stage: 'compressing' | 'uploading' | 'done' | 'error';
  percent: number;
  message: string;
};

/**
 * Compress and upload an image to Supabase Storage
 */
export async function uploadImage(
  file: File,
  folder: string = 'photos',
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  const originalSize = file.size;
  
  // Stage 1: Compress
  onProgress?.({ stage: 'compressing', percent: 10, message: 'جاري ضغط الصورة...' });
  
  const compressedFile = await imageCompression(file, IMAGE_OPTIONS);
  const compressedSize = compressedFile.size;
  const compressionRatio = Math.round((1 - compressedSize / originalSize) * 100);
  
  onProgress?.({ stage: 'compressing', percent: 40, message: `تم ضغط الصورة بنسبة ${compressionRatio}%` });
  
  // Generate unique filename
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  const ext = 'webp';
  const fileName = `${folder}/${timestamp}_${randomId}.${ext}`;
  
  // Stage 2: Upload compressed image
  onProgress?.({ stage: 'uploading', percent: 50, message: 'جاري رفع الصورة...' });
  
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, compressedFile, {
      contentType: 'image/webp',
      upsert: false,
    });
  
  if (error) throw new Error(`فشل رفع الصورة: ${error.message}`);
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);
  
  onProgress?.({ stage: 'done', percent: 100, message: `تم الرفع! (${formatSize(compressedSize)})` });
  
  return {
    url: urlData.publicUrl,
    originalSize,
    compressedSize,
    compressionRatio,
  };
}

/**
 * Compress and upload a video to Supabase Storage (no compression, just upload)
 */
export async function uploadVideo(
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  const originalSize = file.size;
  
  onProgress?.({ stage: 'uploading', percent: 20, message: 'جاري رفع الفيديو...' });
  
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  const ext = file.name.split('.').pop() || 'mp4';
  const fileName = `videos/${timestamp}_${randomId}.${ext}`;
  
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    });
  
  if (error) throw new Error(`فشل رفع الفيديو: ${error.message}`);
  
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);
  
  onProgress?.({ stage: 'done', percent: 100, message: `تم الرفع! (${formatSize(originalSize)})` });
  
  return {
    url: urlData.publicUrl,
    originalSize,
    compressedSize: originalSize,
    compressionRatio: 0,
  };
}

/**
 * Upload a document (PDF, etc.) to Supabase Storage
 */
export async function uploadDocument(
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  const originalSize = file.size;
  
  onProgress?.({ stage: 'uploading', percent: 20, message: 'جاري رفع الوثيقة...' });
  
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  const ext = file.name.split('.').pop() || 'pdf';
  const fileName = `documents/${timestamp}_${randomId}.${ext}`;
  
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    });
  
  if (error) throw new Error(`فشل رفع الوثيقة: ${error.message}`);
  
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);
  
  onProgress?.({ stage: 'done', percent: 100, message: `تم الرفع! (${formatSize(originalSize)})` });
  
  return {
    url: urlData.publicUrl,
    originalSize,
    compressedSize: originalSize,
    compressionRatio: 0,
  };
}

/**
 * Smart upload based on file type
 */
export async function uploadFile(
  file: File,
  archiveType: 'photo' | 'document' | 'video',
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  if (archiveType === 'photo' || file.type.startsWith('image/')) {
    return uploadImage(file, 'photos', onProgress);
  } else if (archiveType === 'video' || file.type.startsWith('video/')) {
    return uploadVideo(file, onProgress);
  } else {
    return uploadDocument(file, onProgress);
  }
}

// Helper to format file sizes
export function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
