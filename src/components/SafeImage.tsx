'use client';

import { isValidImageUrl } from '@/lib/validate-url';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrc?: string;
}

export default function SafeImage({ src, fallbackSrc = '/default-video-cover.png', alt, ...props }: SafeImageProps) {
  const safeSrc = isValidImageUrl(src) ? src : fallbackSrc;
  return <img src={safeSrc} alt={alt || ''} {...props} />;
}
