import { ChartDrawParams } from './pixelChartTypes';

export function drawYAxis(
  ctx: CanvasRenderingContext2D,
  yTicks: number[],
  effectiveMax: number,
  h: number,
  px: number,
  yLabelWidth: number,
  totalW: number,
  formatValue: ((v: number) => string) | undefined,
  borderSubtle: string,
  textGhost: string,
) {
  ctx.font = '10px monospace';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';

  for (const tick of yTicks) {
    const yNorm = effectiveMax > 0 ? tick / effectiveMax : 0;
    const yPx = h - yNorm * (h - px);

    ctx.strokeStyle = borderSubtle;
    ctx.lineWidth = 0.5;
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    ctx.moveTo(yLabelWidth, yPx);
    ctx.lineTo(totalW, yPx);
    ctx.stroke();
    ctx.setLineDash([]);

    const label = formatValue ? formatValue(tick) : (tick % 1 === 0 ? String(tick) : tick.toFixed(1));
    ctx.fillStyle = textGhost;
    ctx.fillText(label, yLabelWidth - 8, yPx);
  }
}

export function drawGridDots(
  ctx: CanvasRenderingContext2D,
  gridRows: number,
  gridCols: number,
  px: number,
  yLabelWidth: number,
  borderSubtle: string,
) {
  ctx.fillStyle = borderSubtle;
  for (let gy = 0; gy < gridRows; gy += 5) {
    for (let gx = 0; gx < gridCols; gx += 5) {
      ctx.fillRect(yLabelWidth + gx * px, gy * px, 1, 1);
    }
  }
}

export function drawAreaChart(p: ChartDrawParams) {
  const { ctx, data, h, px, chartW, effectiveMax, yLabelWidth, progress, hoverIdx, colors, glow } = p;
  const usableH = h - px * 2;
  const points: { x: number; y: number }[] = [];

  for (let i = 0; i < data.length; i++) {
    const val = data[i].value;
    const norm = effectiveMax > 0 ? val / effectiveMax : 0;
    const x = yLabelWidth + (i / Math.max(data.length - 1, 1)) * chartW;
    const y = h - px - norm * usableH * progress;
    points.push({ x, y });
  }

  if (points.length === 0) return;

  const gradient = ctx.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, colors[colors.length - 1] + '60');
  gradient.addColorStop(0.5, colors[Math.floor(colors.length / 2)] + '30');
  gradient.addColorStop(1, colors[0] + '08');

  ctx.beginPath();
  ctx.moveTo(points[0].x, h);
  for (let i = 0; i < points.length; i++) {
    if (i === 0) {
      ctx.lineTo(points[i].x, points[i].y);
    } else {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx = (prev.x + curr.x) / 2;
      ctx.bezierCurveTo(cpx, prev.y, cpx, curr.y, curr.x, curr.y);
    }
  }
  ctx.lineTo(points[points.length - 1].x, h);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.beginPath();
  for (let i = 0; i < points.length; i++) {
    if (i === 0) {
      ctx.moveTo(points[i].x, points[i].y);
    } else {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx = (prev.x + curr.x) / 2;
      ctx.bezierCurveTo(cpx, prev.y, cpx, curr.y, curr.x, curr.y);
    }
  }
  ctx.strokeStyle = colors[colors.length - 1];
  ctx.lineWidth = 2;
  ctx.stroke();

  if (glow) {
    ctx.shadowColor = colors[colors.length - 1];
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  for (let i = 0; i < points.length; i++) {
    if (data[i].value > 0) {
      const isHov = i === hoverIdx;
      ctx.beginPath();
      ctx.arc(points[i].x, points[i].y, isHov ? 4 : 2.5, 0, Math.PI * 2);
      ctx.fillStyle = isHov ? colors[colors.length - 1] : colors[Math.floor(colors.length / 2)];
      ctx.fill();
      if (isHov) {
        ctx.strokeStyle = colors[colors.length - 1];
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }
  }

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const steps = Math.ceil((p2.x - p1.x) / px);
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const x = p1.x + t * (p2.x - p1.x);
      const lineY = p1.y + t * (p2.y - p1.y);
      for (let py = lineY + px * 2; py < h - px; py += px * 2) {
        if (Math.random() > 0.65) {
          const depth = (py - lineY) / (h - lineY);
          const ci = Math.max(0, Math.floor((1 - depth) * (colors.length - 1)));
          ctx.globalAlpha = 0.15 + (1 - depth) * 0.2;
          ctx.fillStyle = colors[ci];
          ctx.fillRect(Math.floor(x / px) * px, Math.floor(py / px) * px, px - 1, px - 1);
        }
      }
    }
  }
  ctx.globalAlpha = 1;
}

export function drawBarChart(p: ChartDrawParams) {
  const { ctx, data, gridRows, gridCols, effectiveMax, yLabelWidth, px, progress, hoverIdx, colors, glow } = p;
  const barSlots = data.length;
  const totalBarPx = Math.max(1, Math.floor(gridCols / barSlots));
  const barW = Math.max(1, totalBarPx - 1);

  for (let i = 0; i < data.length; i++) {
    const val = data[i].value;
    const normalised = effectiveMax > 0 ? val / effectiveMax : 0;
    const usableRows = gridRows - 2;
    const targetH = Math.max(normalised > 0 ? 1 : 0, Math.round(normalised * usableRows));
    const barH = Math.round(targetH * progress);
    const barX = i * totalBarPx;
    const isHovered = i === hoverIdx;

    for (let row = 0; row < barH; row++) {
      const y = gridRows - 1 - row;
      const colorIdx = Math.min(colors.length - 1, Math.floor((row / Math.max(barH - 1, 1)) * (colors.length - 1)));
      const baseColor = isHovered ? colors[Math.min(colorIdx + 1, colors.length - 1)] : colors[colorIdx];

      for (let col = 0; col < barW; col++) {
        ctx.fillStyle = baseColor;
        ctx.fillRect(yLabelWidth + (barX + col) * px, y * px, px - 1, px - 1);
      }
    }

    if (glow && barH > 0) {
      const topY = (gridRows - 1 - barH + 1) * px;
      ctx.shadowColor = colors[colors.length - 1];
      ctx.shadowBlur = 6;
      ctx.fillStyle = colors[colors.length - 1];
      for (let col = 0; col < barW; col++) {
        ctx.fillRect(yLabelWidth + (barX + col) * px, topY, px - 1, px - 1);
      }
      ctx.shadowBlur = 0;
    }
  }
}
