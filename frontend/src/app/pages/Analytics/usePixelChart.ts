import React, { useRef, useEffect, useCallback } from 'react';
import { useClaudeTokens } from '@/shared/styles/ThemeContext';
import { PALETTES, PixelChartProps } from './pixelChartTypes';
import { drawYAxis, drawGridDots, drawAreaChart, drawBarChart } from './pixelChartRenderers';

export function computeYTicks(maxVal: number): number[] {
  if (maxVal <= 0) return [0];
  const rawStep = maxVal / 3;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const normalised = rawStep / magnitude;
  let niceStep: number;
  if (normalised <= 1) niceStep = magnitude;
  else if (normalised <= 2) niceStep = 2 * magnitude;
  else if (normalised <= 5) niceStep = 5 * magnitude;
  else niceStep = 10 * magnitude;
  const ticks: number[] = [];
  for (let v = 0; v <= maxVal * 1.1; v += niceStep) {
    ticks.push(v);
  }
  if (ticks.length < 2) ticks.push(niceStep);
  return ticks;
}

export function computeXLabels(data: { label: string; value: number }[]): { idx: number; label: string }[] {
  if (data.length <= 1) return data.map((d, i) => ({ idx: i, label: d.label }));
  if (data.length <= 5) return data.map((d, i) => ({ idx: i, label: d.label }));
  const result: { idx: number; label: string }[] = [];
  result.push({ idx: 0, label: data[0].label });
  const step = Math.floor(data.length / 4);
  for (let i = 1; i <= 3; i++) {
    const idx = Math.min(i * step, data.length - 2);
    if (idx > 0 && idx < data.length - 1) {
      result.push({ idx, label: data[idx].label });
    }
  }
  result.push({ idx: data.length - 1, label: data[data.length - 1].label });
  return result;
}

type UsePixelChartProps = Required<Pick<PixelChartProps, 'data'>> &
  Pick<PixelChartProps, 'palette' | 'height' | 'pixelSize' | 'formatValue' | 'glow' | 'showYScale' | 'mode'>;

export function usePixelChart({
  data,
  palette = 'salmon',
  height = 140,
  pixelSize = 6,
  formatValue,
  glow = true,
  showYScale = true,
  mode = 'bar',
}: UsePixelChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef(0);
  const progressRef = useRef(0);
  const hoverIdxRef = useRef(-1);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const c = useClaudeTokens();
  const colors = PALETTES[palette];

  const maxVal = Math.max(...data.map((d) => d.value), 0.001);
  const yTicks = computeYTicks(maxVal);
  const xLabels = computeXLabels(data);
  const Y_LABEL_WIDTH = showYScale ? 80 : 0;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || data.length === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const totalW = container.clientWidth;
    const chartW = totalW - Y_LABEL_WIDTH;
    const h = height;
    canvas.width = totalW * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${totalW}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const px = pixelSize;
    const gridCols = Math.floor(chartW / px);
    const gridRows = Math.floor(h / px);
    const effectiveMax = yTicks[yTicks.length - 1] || maxVal;

    ctx.clearRect(0, 0, totalW, h);

    if (showYScale) {
      drawYAxis(ctx, yTicks, effectiveMax, h, px, Y_LABEL_WIDTH, totalW, formatValue, c.border.subtle, c.text.ghost);
    }
    drawGridDots(ctx, gridRows, gridCols, px, Y_LABEL_WIDTH, c.border.subtle);

    const progress = Math.min(progressRef.current, 1);
    const hoverIdx = hoverIdxRef.current;
    const params = { ctx, data, h, px, gridCols, gridRows, chartW, effectiveMax, yLabelWidth: Y_LABEL_WIDTH, progress, hoverIdx, colors, glow };

    if (mode === 'area') {
      drawAreaChart(params);
    } else {
      drawBarChart(params);
    }
  }, [data, height, pixelSize, c, colors, glow, maxVal, yTicks, showYScale, Y_LABEL_WIDTH, formatValue, mode]);

  useEffect(() => {
    progressRef.current = 0;
    let start: number | null = null;
    const animate = (ts: number) => {
      if (!start) start = ts;
      progressRef.current = Math.min(1, (ts - start) / 600);
      draw();
      if (progressRef.current < 1) animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [data, draw]);

  useEffect(() => {
    const handleResize = () => draw();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const canvas = canvasRef.current;
      const tooltip = tooltipRef.current;
      if (!canvas || !tooltip || data.length === 0) return;

      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left - Y_LABEL_WIDTH;
      if (mx < 0) { hoverIdxRef.current = -1; tooltip.style.opacity = '0'; draw(); return; }

      const chartW = rect.width - Y_LABEL_WIDTH;
      const gridCols = Math.floor(chartW / pixelSize);
      const totalBarPx = Math.max(1, Math.floor(gridCols / data.length));
      const idx = Math.floor(mx / (totalBarPx * pixelSize));

      if (idx >= 0 && idx < data.length) {
        hoverIdxRef.current = idx;
        const d = data[idx];
        const valStr = formatValue ? formatValue(d.value) : d.value.toFixed(2);
        tooltip.textContent = `${d.label}: ${valStr}`;
        tooltip.style.opacity = '1';
        tooltip.style.left = `${e.clientX - rect.left}px`;
        tooltip.style.top = `${e.clientY - rect.top - 28}px`;
      } else {
        hoverIdxRef.current = -1;
        tooltip.style.opacity = '0';
      }
      draw();
    },
    [data, pixelSize, draw, formatValue, Y_LABEL_WIDTH],
  );

  const handleMouseLeave = useCallback(() => {
    hoverIdxRef.current = -1;
    if (tooltipRef.current) tooltipRef.current.style.opacity = '0';
    draw();
  }, [draw]);

  return { canvasRef, containerRef, tooltipRef, xLabels, Y_LABEL_WIDTH, handleMouseMove, handleMouseLeave, c };
}
