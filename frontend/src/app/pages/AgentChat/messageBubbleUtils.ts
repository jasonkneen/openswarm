import { AgentMessage } from '@/shared/state/agentsSlice';

export const ELEMENT_SEPARATOR = '\n\n---\nSelected UI Elements:\n';

export interface ParsedElement {
  label: string;
  selector: string;
  isSemantic?: boolean;
}

export function parseElementContext(text: string): { userMessage: string; elements: ParsedElement[] } {
  const sepIdx = text.indexOf(ELEMENT_SEPARATOR);
  if (sepIdx === -1) return { userMessage: text, elements: [] };

  const userMessage = text.slice(0, sepIdx);
  const elementSection = text.slice(sepIdx + ELEMENT_SEPARATOR.length);

  const elements: ParsedElement[] = [];
  const blocks = elementSection.split(/\n(?=\d+\.\s)/).filter(Boolean);
  for (const block of blocks) {
    const semanticMatch = block.match(/\d+\.\s+\[([^\]]+)\]\s*(.*)/);
    if (semanticMatch) {
      const typeLabel = semanticMatch[1];
      const rest = semanticMatch[2].trim();
      elements.push({
        label: `${typeLabel}: ${rest.split('\n')[0]}`,
        selector: typeLabel,
        isSemantic: true,
      });
      continue;
    }

    const labelMatch = block.match(/`([^`]+)`\s+\((\w+)\)/);
    const selectorMatch = block.match(/Selector:\s*(.+)/);
    if (labelMatch) {
      elements.push({
        label: labelMatch[1],
        selector: selectorMatch?.[1]?.trim() ?? labelMatch[1],
      });
    }
  }

  return { userMessage, elements };
}

export const SKILL_PILL_RE = /\{\{skill:([^}]+)\}\}/g;

export interface MessageBubbleProps {
  message: AgentMessage;
  editing?: boolean;
  onSaveEdit?: (messageId: string, newContent: string) => void;
  onCancelEdit?: () => void;
  isStreaming?: boolean;
}
