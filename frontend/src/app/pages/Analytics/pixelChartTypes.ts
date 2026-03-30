export const PALETTES = {
  salmon: ['#C46B57', '#D4795F', '#E8927A', '#F0A088', '#F5B49E'],
  blue: ['#445588', '#5577AA', '#6688BB', '#7799CC', '#88AADD'],
  coral: ['#993344', '#AA3D4E', '#BB4455', '#CC5566', '#DD6677'],
  green: ['#447755', '#558866', '#669977', '#77AA88', '#88BB99'],
  purple: ['#665588', '#7766AA', '#8877BB', '#9988CC', '#AA99DD'],
} as const;

export type PaletteKey = keyof typeof PALETTES;

export interface PixelChartProps {
  data: { label: string; value: number }[];
  palette?: PaletteKey;
  height?: number;
  pixelSize?: number;
  formatValue?: (v: number) => string;
  glow?: boolean;
  showXLabels?: boolean;
  showYScale?: boolean;
  mode?: 'bar' | 'area';
}

export interface ChartDrawParams {
  ctx: CanvasRenderingContext2D;
  data: { label: string; value: number }[];
  h: number;
  px: number;
  gridCols: number;
  gridRows: number;
  chartW: number;
  effectiveMax: number;
  yLabelWidth: number;
  progress: number;
  hoverIdx: number;
  colors: readonly string[];
  glow: boolean;
}
