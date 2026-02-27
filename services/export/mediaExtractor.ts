/**
 * Extract base64 media (images and videos) from site data and prepare them for the zip
 */

import JSZip from 'jszip';
import { SiteData } from '../../types';
import { base64ToBlob, getExtensionFromMimeType } from './helpers';

export interface MediaMap {
  [key: string]: string;
}

/**
 * Extract mime type from base64 data URL
 */
function getMimeTypeFromDataUrl(dataUrl: string): string | null {
  const match = dataUrl.match(/^data:([^;]+);/);
  return match ? match[1] : null;
}

/**
 * Check if a data URL is a video
 */
function isVideoDataUrl(dataUrl: string): boolean {
  return dataUrl.startsWith('data:video');
}

/**
 * Check if a data URL is an image
 */
function isImageDataUrl(dataUrl: string): boolean {
  return dataUrl.startsWith('data:image');
}

/**
 * Extract all base64 media from SiteData and add them to a zip folder
 * Returns a mapping from media keys to their new paths
 */
export function extractMedia(data: SiteData, assetsFolder: JSZip | null): MediaMap {
  const mediaMap: MediaMap = {};

  // Extract avatar if it's a base64 image
  if (data.profile.avatarUrl?.startsWith('data:image')) {
    const blob = base64ToBlob(data.profile.avatarUrl);
    if (blob && assetsFolder) {
      assetsFolder.file('avatar.png', blob);
      mediaMap['profile_avatar'] = '/assets/avatar.png';
    }
  }

  // Extract background image if it's base64
  if (data.profile.backgroundImage?.startsWith('data:image')) {
    const blob = base64ToBlob(data.profile.backgroundImage);
    if (blob && assetsFolder) {
      assetsFolder.file('background.png', blob);
      mediaMap['profile_background'] = '/assets/background.png';
    }
  }

  // Extract OpenGraph image if it's base64
  if (data.profile.openGraph?.image?.startsWith('data:image')) {
    const blob = base64ToBlob(data.profile.openGraph.image);
    if (blob && assetsFolder) {
      assetsFolder.file('og-image.png', blob);
      mediaMap['og_image'] = '/assets/og-image.png';
    }
  }

  // Extract block media (images and videos)
  for (const block of data.blocks) {
    if (block.imageUrl?.startsWith('data:')) {
      const blob = base64ToBlob(block.imageUrl);
      if (blob && assetsFolder) {
        // Determine file extension based on mime type
        const mimeType = getMimeTypeFromDataUrl(block.imageUrl);
        const isVideo = isVideoDataUrl(block.imageUrl);
        const extension = mimeType ? getExtensionFromMimeType(mimeType) : (isVideo ? 'mp4' : 'png');

        const filename = `block-${block.id}.${extension}`;
        assetsFolder.file(filename, blob);
        mediaMap[`block_${block.id}`] = `/assets/${filename}`;
      }
    }
  }

  return mediaMap;
}

// Backward compatibility - keep old name as alias
export const extractImages = extractMedia;
