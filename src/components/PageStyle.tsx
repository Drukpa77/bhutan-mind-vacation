/** Per-page document styles the prototypes set in their <helmet> (body background, link hover accent). */
export default function PageStyle({ bg, hover = '#e3a23a', lockScroll = false }: { bg: string; hover?: string; lockScroll?: boolean }) {
  const css = `body{background:${bg};${lockScroll ? 'overflow:hidden;' : ''}}:root{--link-hover:${hover}}`;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
