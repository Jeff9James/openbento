/**
 * Media Upload Utility
 * Handles frictionless file uploads with base64 encoding
 * Supports images, GIFs, and videos with validation and compression
 */

export type MediaType = 'image' | 'video';

export interface MediaUploadResult {
  success: boolean;
  dataUrl?: string;
  error?: string;
  mediaType?: MediaType;
  fileName?: string;
  originalSize?: number;
  compressedSize?: number;
}

export interface MediaUploadOptions {
  maxImageSize?: number; // in MB, default 5
  maxVideoSize?: number; // in MB, default 10
  compressImages?: boolean; // default true
  maxImageWidth?: number; // default 1920
  maxImageHeight?: number; // default 1080
  imageQuality?: number; // 0-1, default 0.85
}

const DEFAULT_OPTIONS: Required<MediaUploadOptions> = {
  maxImageSize: 5,
  maxVideoSize: 10,
  compressImages: true,
  maxImageWidth: 1920,
  maxImageHeight: 1080,
  imageQuality: 0.85,
};

// Supported MIME types
const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/avif',
];

const SUPPORTED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime', // .mov
];

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Detect media type from MIME type
 */
export function detectMediaType(mimeType: string): MediaType | null {
  if (SUPPORTED_IMAGE_TYPES.includes(mimeType)) return 'image';
  if (SUPPORTED_VIDEO_TYPES.includes(mimeType)) return 'video';
  return null;
}

/**
 * Compress an image before converting to base64
 */
function compressImage(
  file: File,
  options: Required<MediaUploadOptions>
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      // Calculate new dimensions while maintaining aspect ratio
      if (width > options.maxImageWidth || height > options.maxImageHeight) {
        const ratio = Math.min(
          options.maxImageWidth / width,
          options.maxImageHeight / height
        );
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }

      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // For PNG with transparency, use white background
      if (file.type === 'image/png') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }

      // Draw image
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to base64
      const outputType = file.type === 'image/webp' ? 'image/webp' : 'image/jpeg';
      const dataUrl = canvas.toDataURL(outputType, options.imageQuality);
      resolve(dataUrl);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Read file as base64 data URL
 */
function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Main media upload function
 * Handles validation, compression, and base64 conversion
 */
export async function uploadMedia(
  file: File,
  options: MediaUploadOptions = {}
): Promise<MediaUploadResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Detect media type
  const mediaType = detectMediaType(file.type);
  if (!mediaType) {
    return {
      success: false,
      error: `Unsupported file type: ${file.type}. Supported types: JPEG, PNG, GIF, WebP, SVG, AVIF, MP4, WebM, OGG, MOV`,
    };
  }

  const originalSize = file.size;

  // Validate file size
  if (mediaType === 'image') {
    const maxSizeBytes = opts.maxImageSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      // Try to compress if it's an image and compression is enabled
      if (opts.compressImages && file.type !== 'image/gif' && file.type !== 'image/svg+xml') {
        try {
          const compressedDataUrl = await compressImage(file, opts);
          const compressedSize = Math.round((compressedDataUrl.length * 3) / 4); // Approximate base64 size

          return {
            success: true,
            dataUrl: compressedDataUrl,
            mediaType: 'image',
            fileName: file.name,
            originalSize,
            compressedSize,
          };
        } catch {
          return {
            success: false,
            error: `Image is too large (${formatFileSize(file.size)}). Maximum size is ${opts.maxImageSize}MB.`,
          };
        }
      } else {
        return {
          success: false,
          error: `File is too large (${formatFileSize(file.size)}). Maximum size is ${opts.maxImageSize}MB for images.`,
        };
      }
    }
  } else if (mediaType === 'video') {
    const maxSizeBytes = opts.maxVideoSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return {
        success: false,
        error: `Video is too large (${formatFileSize(file.size)}). Maximum size is ${opts.maxVideoSize}MB for videos.`,
      };
    }
  }

  try {
    let dataUrl: string;

    if (mediaType === 'image' && opts.compressImages && file.type !== 'image/gif' && file.type !== 'image/svg+xml') {
      // Compress image before converting
      dataUrl = await compressImage(file, opts);
    } else {
      // Read as-is for videos, GIFs, and SVGs
      dataUrl = await readFileAsDataURL(file);
    }

    const compressedSize = Math.round((dataUrl.length * 3) / 4); // Approximate base64 size

    return {
      success: true,
      dataUrl,
      mediaType,
      fileName: file.name,
      originalSize,
      compressedSize: mediaType === 'image' ? compressedSize : originalSize,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process file',
    };
  }
}

/**
 * Check if a URL is a base64 data URL
 */
export function isBase64DataUrl(url: string): boolean {
  return url.startsWith('data:');
}

/**
 * Get media type from base64 data URL
 */
export function getMediaTypeFromDataUrl(url: string): MediaType | null {
  if (!isBase64DataUrl(url)) return null;

  if (url.startsWith('data:image')) return 'image';
  if (url.startsWith('data:video')) return 'video';

  return null;
}

/**
 * Extract file extension from MIME type
 */
export function getExtensionFromMimeType(mimeType: string): string {
  const extensions: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'image/avif': 'avif',
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'video/ogg': 'ogv',
    'video/quicktime': 'mov',
  };
  return extensions[mimeType] || 'bin';
}
