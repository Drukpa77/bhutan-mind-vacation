import Image from 'next/image';
import type { CSSProperties } from 'react';

interface Props {
  src: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  /** view-transition-name for shared-element page transitions ('none' to opt out). */
  vt?: string;
  sizes?: string;
  priority?: boolean;
}

/** A cover-cropped photo: a positioned wrapper (which carries transforms, filters and transitions)
 *  holding a next/image with fill + object-fit: cover. Replaces the prototypes' background-image divs. */
export default function Photo({ src, alt = '', className, style, vt, sizes = '100vw', priority }: Props) {
  const s: CSSProperties = vt ? { ...style, viewTransitionName: vt } : style ?? {};
  return (
    <div className={className ? `bmv-photo ${className}` : 'bmv-photo'} style={s}>
      {src ? <Image src={src} alt={alt} fill sizes={sizes} priority={priority} style={{ objectFit: 'cover' }} /> : null}
    </div>
  );
}
