import React, { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { useClaudeTokens } from '@/shared/styles/ThemeContext';

const ImageLightbox: React.FC<{
  open: boolean;
  src: string;
  onClose: () => void;
  c: ReturnType<typeof useClaudeTokens>;
}> = ({ open, src, onClose, c }) => (
  <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Box
      onClick={onClose}
      sx={{
        position: 'relative',
        outline: 'none',
        maxWidth: '90vw',
        maxHeight: '90vh',
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: -16,
          right: -16,
          bgcolor: c.bg.surface,
          border: `1px solid ${c.border.medium}`,
          color: c.text.secondary,
          width: 32,
          height: 32,
          zIndex: 1,
          '&:hover': { bgcolor: c.bg.secondary },
          boxShadow: c.shadow.md,
        }}
      >
        <CloseIcon sx={{ fontSize: 16 }} />
      </IconButton>
      <img
        src={src}
        alt=""
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '90vw',
          maxHeight: '90vh',
          borderRadius: 8,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          display: 'block',
        }}
      />
    </Box>
  </Modal>
);

interface Props {
  images: Array<{ data: string; media_type: string }>;
  c: ReturnType<typeof useClaudeTokens>;
}

const MessageImageThumbnails: React.FC<Props> = ({ images, c }) => {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      <Box sx={{ display: 'flex', gap: 0.75, mb: 1, flexWrap: 'wrap' }}>
        {images.map((img, idx) => {
          const src = `data:${img.media_type};base64,${img.data}`;
          return (
            <Box
              key={idx}
              onClick={() => setLightboxSrc(src)}
              sx={{
                width: 64,
                height: 64,
                flexShrink: 0,
                borderRadius: '8px',
                overflow: 'hidden',
                border: `1px solid ${c.border.subtle}`,
                cursor: 'pointer',
                transition: 'opacity 0.15s, transform 0.15s',
                '&:hover': { opacity: 0.85, transform: 'scale(1.04)' },
              }}
            >
              <img
                src={src}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </Box>
          );
        })}
      </Box>
      <ImageLightbox
        open={!!lightboxSrc}
        src={lightboxSrc || ''}
        onClose={() => setLightboxSrc(null)}
        c={c}
      />
    </>
  );
};

export default MessageImageThumbnails;
