export const OVERLAY_ID = '__clawd-select-overlay__';
export const LABEL_ID = '__clawd-select-label__';
export const STYLE_ID = '__clawd-select-style__';

export const HIGHLIGHT_COLOR = '#3b82f6';
export const HIGHLIGHT_BG = 'rgba(59, 130, 246, 0.08)';
export const FLASH_COLOR = 'rgba(59, 130, 246, 0.25)';
export const SELECTED_CLASS = '__clawd-selected__';

const KEY_CSS_PROPS = [
  'display', 'position', 'width', 'height', 'margin', 'padding',
  'color', 'background', 'backgroundColor', 'border', 'borderRadius',
  'fontSize', 'fontFamily', 'fontWeight', 'lineHeight', 'textAlign',
  'flexDirection', 'justifyContent', 'alignItems', 'gap', 'gridTemplateColumns',
  'overflow', 'opacity', 'zIndex', 'boxShadow',
];

export function buildSelectorPath(el: Element): string {
  const parts: string[] = [];
  let current: Element | null = el;

  while (current && current !== current.ownerDocument.documentElement) {
    let selector = current.tagName.toLowerCase();

    if (current.id) {
      selector += `#${current.id}`;
      parts.unshift(selector);
      break;
    }

    const classes = Array.from(current.classList).filter((c) => !c.startsWith('__clawd'));
    if (classes.length > 0) {
      selector += '.' + classes.slice(0, 2).join('.');
    } else {
      const parent = current.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter((c) => c.tagName === current!.tagName);
        if (siblings.length > 1) {
          const idx = siblings.indexOf(current) + 1;
          selector += `:nth-child(${idx})`;
        }
      }
    }

    parts.unshift(selector);
    current = current.parentElement;
  }

  return parts.join(' > ');
}

export function getKeyStyles(el: Element): Record<string, string> {
  const computed = el.ownerDocument.defaultView?.getComputedStyle(el);
  if (!computed) return {};

  const styles: Record<string, string> = {};
  for (const prop of KEY_CSS_PROPS) {
    const val = computed.getPropertyValue(prop);
    if (val && val !== 'none' && val !== 'normal' && val !== 'auto' && val !== '0px' && val !== 'rgba(0, 0, 0, 0)') {
      styles[prop] = val;
    }
  }
  return styles;
}

export function truncateHTML(html: string, max = 5000): string {
  if (html.length <= max) return html;
  return html.slice(0, max) + '\n<!-- ... truncated -->';
}

export async function captureScreenshot(
  el: Element,
  iframeDoc: Document,
): Promise<string | undefined> {
  try {
    const win = iframeDoc.defaultView;
    if (!win) return undefined;

    if (!(win as any).html2canvas) {
      await new Promise<void>((resolve, reject) => {
        const script = iframeDoc.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load html2canvas'));
        iframeDoc.head.appendChild(script);
      });
    }

    const h2c = (win as any).html2canvas;
    if (!h2c) return undefined;

    const canvas = await h2c(el, {
      backgroundColor: null,
      scale: 1,
      logging: false,
      useCORS: true,
    });
    return canvas.toDataURL('image/png');
  } catch {
    return undefined;
  }
}
