/**
 * File validation helpers.
 * Verifies files by magic bytes to reduce the risk of spoofed extensions/MIME types.
 */

export const IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;

export const DOCUMENT_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

export const VIDEO_MIME_TYPES = [
  'video/mp4',
  'video/webm',
] as const;

function matchesMagicBytes(buffer: Uint8Array, mimeType: string): boolean {
  if (buffer.length < 8) return false;

  switch (mimeType) {
    case 'image/jpeg':
      return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    case 'image/png':
      return (
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4e &&
        buffer[3] === 0x47 &&
        buffer[4] === 0x0d &&
        buffer[5] === 0x0a &&
        buffer[6] === 0x1a &&
        buffer[7] === 0x0a
      );
    case 'image/webp':
      // RIFF....WEBP
      if (buffer.length < 12) return false;
      return (
        buffer[0] === 0x52 &&
        buffer[1] === 0x49 &&
        buffer[2] === 0x46 &&
        buffer[3] === 0x46 &&
        buffer[8] === 0x57 &&
        buffer[9] === 0x45 &&
        buffer[10] === 0x42 &&
        buffer[11] === 0x50
      );
    case 'image/gif':
      return (
        buffer[0] === 0x47 &&
        buffer[1] === 0x49 &&
        buffer[2] === 0x46 &&
        buffer[3] === 0x38
      );
    case 'application/pdf':
      return (
        buffer[0] === 0x25 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x44 &&
        buffer[3] === 0x46
      );
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      // DOCX is a ZIP archive (PK)
      return (
        buffer[0] === 0x50 &&
        buffer[1] === 0x4b &&
        buffer[2] === 0x03 &&
        buffer[3] === 0x04
      );
    case 'video/mp4':
      // ftyp or moov signature at offset 4
      if (buffer.length < 12) return false;
      return (
        (buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70) ||
        (buffer[4] === 0x6d && buffer[5] === 0x6f && buffer[6] === 0x6f && buffer[7] === 0x76)
      );
    case 'video/webm':
      // EBML header
      return (
        buffer[0] === 0x1a &&
        buffer[1] === 0x45 &&
        buffer[2] === 0xdf &&
        buffer[3] === 0xa3
      );
    default:
      return false;
  }
}

export function validateFileMagicBytes(
  buffer: ArrayBuffer | Uint8Array,
  allowedMimeTypes: string[]
): boolean {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  for (const mime of allowedMimeTypes) {
    if (matchesMagicBytes(bytes, mime)) return true;
  }
  return false;
}

export function getExtensionFromMimeType(mimeType: string): string | null {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'application/pdf': 'pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'video/mp4': 'mp4',
    'video/webm': 'webm',
  };
  return map[mimeType] || null;
}
