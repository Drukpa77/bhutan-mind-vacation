/** Per-page document styles the prototypes set in their <helmet> (body background, link hover accent).
 *  `focus` is the keyboard focus-ring colour; it defaults to the hover accent, which is chosen for contrast with `bg`. */
export default function PageStyle({ bg, hover = '#e3a23a', focus, lockScroll = false }: { bg: string; hover?: string; focus?: string; lockScroll?: boolean }) {
  const css = `body{background:${bg};${lockScroll ? 'overflow:hidden;' : ''}}:root{--link-hover:${hover};--focus:${focus ?? hover}}`;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
