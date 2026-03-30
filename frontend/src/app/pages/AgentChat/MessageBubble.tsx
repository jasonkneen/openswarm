import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useClaudeTokens } from '@/shared/styles/ThemeContext';
import { parseElementContext, MessageBubbleProps } from './messageBubbleUtils';
import UserBubbleContent from './UserBubbleContent';
import AssistantBubbleContent from './AssistantBubbleContent';
import ViewBubble from './ViewBubble';

const MessageBubble: React.FC<MessageBubbleProps> = React.memo(({ message, editing = false, onSaveEdit, onCancelEdit, isStreaming }) => {
  const c = useClaudeTokens();
  const { role, content } = message;

  if (role === 'system') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
        <Typography sx={{ color: c.text.ghost, fontSize: '0.8rem', fontStyle: 'italic' }}>
          {typeof content === 'string' ? content : JSON.stringify(content)}
        </Typography>
      </Box>
    );
  }

  if (role === 'tool_call') {
    const toolData = typeof content === 'object' ? content : {};
    const toolInput = toolData.input || {};
    if (toolData.tool === 'RenderOutput') {
      return <ViewBubble toolInput={toolInput} isStreaming={isStreaming} />;
    }
    return null;
  }

  if (role === 'tool_result') {
    let parsedContent: any = null;
    try { parsedContent = typeof content === 'string' ? JSON.parse(content) : content; } catch {}
    if (parsedContent?.output_id && parsedContent?.frontend_code) {
      return (
        <ViewBubble
          toolInput={{ output_id: parsedContent.output_id, input_data: parsedContent.input_data || {} }}
          toolResult={parsedContent}
        />
      );
    }
    return null;
  }

  const isUser = role === 'user';
  const rawText = typeof content === 'string' ? content : JSON.stringify(content);
  const { userMessage: displayText, elements: selectedElements } = isUser
    ? parseElementContext(rawText)
    : { userMessage: rawText, elements: [] };

  const truncatedContent = typeof content === 'string'
    ? content.slice(0, 200)
    : JSON.stringify(content).slice(0, 200);

  return (
    <Box
      data-select-type="message"
      data-select-id={message.id}
      data-select-meta={JSON.stringify({ role, content: truncatedContent })}
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        my: 0.75,
      }}
    >
      <Box
        sx={{
          maxWidth: '85%',
          minWidth: 0,
          bgcolor: isUser ? c.user.bubble : c.bg.surface,
          border: isUser ? 'none' : `1px solid ${c.border.subtle}`,
          borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          px: 2,
          py: 1.25,
          boxShadow: isUser ? 'none' : c.shadow.sm,
          overflow: 'hidden',
        }}
      >
        {isUser ? (
          <UserBubbleContent
            message={message}
            displayText={displayText}
            rawText={rawText}
            selectedElements={selectedElements}
            editing={editing}
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
          />
        ) : (
          <AssistantBubbleContent rawText={rawText} isStreaming={isStreaming} />
        )}
      </Box>
    </Box>
  );
});

export default MessageBubble;
