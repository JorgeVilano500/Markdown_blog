/** Strip Markdown syntax and return plain-text suitable for a meta description. */
export function extractDescription(markdown: string, maxLength = 155): string {
    const plain = markdown
        .replace(/!\[[^\]]*\]\([^)]*\)/g, '')    // remove images
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links → anchor text
        .replace(/^#{1,6}\s+/gm, '')              // headings
        .replace(/[*_`~]/g, '')                   // bold/italic/code/strikethrough
        .replace(/^>\s*/gm, '')                   // blockquotes
        .replace(/^[-*+]\s+/gm, '')               // list markers
        .replace(/\n+/g, ' ')                     // newlines → spaces
        .trim();

    if (plain.length <= maxLength) return plain;
    // trim at the last word boundary so we don't cut mid-word
    return plain.slice(0, maxLength).replace(/\s+\S*$/, '') + '…';
}

/** Return the URL of the first image found in a Markdown string, or null. */
export function extractFirstImage(markdown: string): string | null {
    // handles our custom ![alt|modifier](url) syntax — grab just the URL part
    const match = markdown.match(/!\[[^\]]*\]\(([^)\s]+)/);
    return match ? match[1] : null;
}
