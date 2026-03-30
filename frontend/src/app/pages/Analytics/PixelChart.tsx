import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { PixelChartProps } from './pixelChartTypes';
import { usePixelChart } from './usePixelChart';

const PixelChart: React.FC<PixelChartProps> = ({
  data,
  palette = 'salmon',
  height = 140,
  pixelSize = 6,
  formatValue,
  glow = true,
  showXLabels = true,
  showYScale = true,
  mode = 'bar',
}) => {
  const {
    canvasRef, containerRef, tooltipRef,
    xLabels, Y_LABEL_WIDTH,
    handleMouseMove, handleMouseLeave, c,
  } = usePixelChart({ data, palette, height, pixelSize, formatValue, glow, showYScale, mode });

  return (
    <Box ref={containerRef} sx={{ position: 'relative', width: '100%' }}>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ display: 'block', width: '100%', imageRendering: 'pixelated', cursor: 'crosshair' }}
      />
      {showXLabels && data.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5, pl: `${Y_LABEL_WIDTH}px` }}>
          {xLabels.map((xl) => (
            <Typography
              key={xl.idx}
              sx={{
                color: c.text.ghost,
                fontSize: '0.58rem',
                fontFamily: c.font.mono,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: 60,
              }}
            >
              {xl.label}
            </Typography>
          ))}
        </Box>
      )}
      <Box
        ref={tooltipRef}
        sx={{
          position: 'absolute',
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 0.12s',
          bgcolor: c.bg.inverse,
          color: c.text.inverse,
          fontSize: '0.7rem',
          fontFamily: c.font.mono,
          fontWeight: 500,
          px: 1,
          py: 0.35,
          borderRadius: 0.75,
          whiteSpace: 'nowrap',
          transform: 'translateX(-50%)',
          zIndex: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}
      />
    </Box>
  );
};

export default PixelChart;
