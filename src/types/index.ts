// Image source types
export type ImageSource = string | File | Blob;

// Selection mode types
export type SelectionMode = 'point' | 'rectangle' | 'eraser';

// Grid cell coordinate
export interface GridCell {
  row: number;
  col: number;
}

// Selection data
export interface SelectionData {
  selectedCells: GridCell[];
  resolution: number;
  imageAspectRatio: { width: number; height: number };
  gridDimensions: { cols: number; rows: number };
  cellSize: { width: number; height: number };
  imageWidth: number;
  imageHeight: number;
  canvasWidth: number;
  canvasHeight: number;
}

// Component props interface (as specified in task)
export interface Props {
  image?: ImageSource; // Support multiple image input types
  resolution?: number; // Default to 1 (1x image aspect ratio)
  selectionMode: SelectionMode; // Default selection mode
  highlightColor?: string; // Color for selected grids
  gridColor?: string; // Color for grid lines
  layerColors?: string[]; // Array of hex colors for layers
  // Additional props for enhanced functionality
  canvasWidth?: number;
  canvasHeight?: number;
  hoverColor?: string;
  backgroundColor?: string;
  defaultBrushSize?: number;
  defaultBrushShape?: BrushShape;
}

// Extended marker props with all supported options
export interface MarkerProps extends Props {
  imageSource?: ImageSource; // Backward compatibility
}

// Events interface
export interface MarkerEvents {
  selectionChange: (selection: SelectionData) => void;
  modeChange: (mode: SelectionMode) => void;
  imageLoad: (image: HTMLImageElement) => void;
  imageError: (error: Error) => void;
  gridHover: (cell: GridCell | null) => void;
}

// Component state interface
export interface ComponentState {
  selectedGrids: Set<string>;
  currentMode: SelectionMode;
  imageLoaded: boolean;
  imageElement: HTMLImageElement | null;
  canvasElement: HTMLCanvasElement | null;
  isSelecting: boolean;
  hoveredCell: GridCell | null;
  lastSelectedCell: GridCell | null;
}

// Canvas manager options
export interface CanvasManagerOptions {
  canvas: HTMLCanvasElement;
  resolution: number;
  imageAspectRatio: { width: number; height: number };
  selectionColor?: string;
  hoverColor?: string;
  gridColor?: string;
  backgroundColor?: string;
}

// Utility types
export interface Point {
  x: number;
  y: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GridBounds {
  x: number;
  y: number;
  width: number;
  height: number;
  row: number;
  col: number;
}

// Grid calculation helpers
export interface GridDimensions {
  rows: number;
  cols: number;
  cellWidth: number;
  cellHeight: number;
}

// Selection operation types
export type SelectionOperation = 'select' | 'deselect' | 'toggle';

// Image aspect ratio interface
export interface AspectRatio {
  width: number;
  height: number;
}

// Grid calculation result interface
export interface GridCalculation {
  aspectRatio: AspectRatio;
  gridDimensions: { cols: number; rows: number };
  cellSize: { width: number; height: number };
}

// Color Layer System Types
export interface ColorLayer {
  color: string;
  selectedGrids: Set<string>;
  visible: boolean;
  name?: string; // Optional layer name
  opacity?: number; // Optional opacity (0-1), default 1
}

// Color layer export/import format
export interface ColorLayerExport {
  imageSize: { width: number; height: number };
  resolution: number;
  layers: Record<string, string[]>; // color -> grid keys array
}

// Percentage-based rectangle for resolution-independent export
export interface PercentRect {
  x: number; // 0-1
  y: number; // 0-1
  width: number; // 0-1
  height: number; // 0-1
}

// New export format using percentage-based rectangles
export interface PercentLayerExport {
  imageSize: { width: number; height: number };
  layers: Record<string, PercentRect[]>; // color -> PercentRect array
}

// New grid-based export format for data optimization
export interface GridLayerExport {
  metadata: {
    cols: number;
    rows: number;
  };
  layers: Record<string, Rectangle[]>; // color -> grid-based Rectangle array
}


// Color layer selection data for events
export interface LayerSelectionData {
  activeColor: string;
  layers: Array<{
    color: string;
    selectedCount: number;
    visible: boolean;
    name?: string;
  }>;
  totalSelected: number;
}

// Extended selection data with layer information
export interface ExtendedSelectionData extends SelectionData {
  layerData?: LayerSelectionData;
}

// Color layer management state
export interface ColorLayerState {
  colorLayers: Map<string, ColorLayer>;
  activeColorLayer: string;
  defaultColors: string[];
}

// Color layer event types
export interface ColorLayerEvents {
  layerChange: (layerData: LayerSelectionData) => void;
  activeLayerChange: (color: string) => void;
  layerVisibilityChange: (color: string, visible: boolean) => void;
  layerAdded: (color: string, layer: ColorLayer) => void;
  layerRemoved: (color: string) => void;
}

// Brush System Types
export type BrushShape = 'circle' | 'square';

export interface BrushOptions {
  size: number; // in grid cells
  shape: BrushShape;
} 