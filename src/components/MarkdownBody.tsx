import type { ReactNode } from 'react';
import Markdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { slugify } from '../lib/slugify';

interface MarkdownBodyProps {
  children: string;
}

/** Walk a ReactNode tree and extract its plain-text content. */
function extractText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (typeof node === 'object' && 'props' in node) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return extractText((node as any).props?.children);
  }
  return '';
}

/**
 * Heading renderer factory: returns an h2/h3 with an id derived from the
 * heading text plus a hover-revealed `#` anchor link for deep-linking.
 *
 * Wrap-only — no behavior change for headings without text content.
 */
function makeHeading(Tag: 'h2' | 'h3') {
  // react-markdown passes (props) — we only need children.
  function HeadingComponent({ children }: { children?: ReactNode }) {
    const text = extractText(children).trim();
    const id = text ? slugify(text) : undefined;
    return (
      <Tag id={id} className="group/heading scroll-mt-24">
        {children}
        {id && (
          <a
            href={`#${id}`}
            aria-label="Link to this section"
            className="ml-2 text-orange-500/40 hover:text-orange-600 no-underline opacity-0 group-hover/heading:opacity-100 transition-opacity"
          >
            #
          </a>
        )}
      </Tag>
    );
  }
  HeadingComponent.displayName = `MarkdownHeading(${Tag})`;
  return HeadingComponent;
}

const components: Components = {
  h2: makeHeading('h2'),
  h3: makeHeading('h3'),
};

/**
 * Markdown renderer with deep-linkable headings.
 *
 * Drop-in replacement for `<Markdown>` in PostDetail — every h2/h3 in the
 * post body now has an `id` and a `#` anchor visible on row hover. Click
 * the `#` to jump (URL hash updates, scrolls smoothly via the global
 * `scroll-behavior: smooth` rule).
 */
export function MarkdownBody({ children }: MarkdownBodyProps) {
  return <Markdown components={components}>{children}</Markdown>;
}
