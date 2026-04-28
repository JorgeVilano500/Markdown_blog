import { Marked } from 'marked';

// Supports modifiers in the alt text after a pipe:
//   ![caption|right](url)    — float right, text wraps left  (defaults to 40% width)
//   ![caption|left](url)     — float left, text wraps right  (defaults to 40% width)
//   ![caption|center](url)   — centered block, no text wrap
//   ![caption|small](url)    — 180 px wide
//   ![caption|medium](url)   — 380 px wide
//   ![caption|large](url)    — 640 px wide
//   ![caption|250](url)      — exact pixel width
//   Modifiers combine: ![caption|right|small](url)
export const marked = new Marked({
    renderer: {
        image({ href, title, text }) {
            const [alt, ...mods] = text.split('|');

            let float = '';
            let maxWidth = '';
            let block = false;

            for (const raw of mods) {
                const mod = raw.trim().toLowerCase();
                if      (mod === 'right')  { float = 'right'; }
                else if (mod === 'left')   { float = 'left'; }
                else if (mod === 'center') { block = true; }
                else if (mod === 'small')  { maxWidth = '180px'; }
                else if (mod === 'medium') { maxWidth = '380px'; }
                else if (mod === 'large')  { maxWidth = '640px'; }
                else if (/^\d+$/.test(mod)) { maxWidth = `${mod}px`; }
            }

            // Floated images need a constrained width so text has room to flow beside them.
            // Non-floated images default to full width.
            if (!maxWidth) maxWidth = float ? '40%' : '100%';

            const styles: string[] = [`max-width: ${maxWidth}`, 'height: auto'];

            if (float === 'right') {
                styles.push('float: right', 'margin: 0.25rem 0 1rem 1.5rem');
            } else if (float === 'left') {
                styles.push('float: left', 'margin: 0.25rem 1.5rem 1rem 0');
            } else if (block) {
                styles.push('display: block', 'margin: 1rem auto');
            }

            const titleAttr = title ? ` title="${title}"` : '';
            return `<img src="${href}" alt="${alt}"${titleAttr} style="${styles.join('; ')}">`;
        }
    }
});
