import { Link } from 'next-view-transitions';
import type { AnchorHTMLAttributes, ReactNode, Ref } from 'react';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children?: ReactNode; 'data-cursor'?: string; ref?: Ref<HTMLAnchorElement> };

/** Internal routes go through next-view-transitions' Link (shared-element transitions);
 *  in-page anchors, mailto:, tel: and external URLs stay plain <a>. */
export default function TLink({ href, children, ...rest }: Props) {
  const internal = href.startsWith('/') && !href.startsWith('//');
  if (!internal) return <a href={href} {...rest}>{children}</a>;
  return <Link href={href} {...rest}>{children}</Link>;
}
