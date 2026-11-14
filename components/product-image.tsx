'use client';
import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

export function ProductPhoto({ src, alt, ...props }: Omit<ImageProps, 'src'> & { src: string }) {
  const [failed, setFailed] = useState(false);
  return <Image {...props} src={failed ? '/chigo-logo.png' : src} alt={alt} onError={() => setFailed(true)}/>;
}
