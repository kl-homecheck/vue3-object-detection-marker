import type { ImageSource, Point, GridCell, Rectangle, AspectRatio, GridCalculation } from '../types';

/**
 * Load image from various sources
 */
export async function loadImage(source: ImageSource): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Handle CORS for URLs
    
    img.onload = () => resolve(img);
    img.onerror = reject;
    
    if (typeof source === 'string') {
      // Handle URL or Base64
      img.src = source;
    } else {
      // Handle File or Blob
      const url = URL.createObjectURL(source);
      img.src = url;
      // Store URL reference for cleanup
      (img as any)._objectUrl = url;
    }
  });
}

/**
 * Cleanup image resources
 */
export function cleanupImage(img: HTMLImageElement): void {
  if ((img as any)._objectUrl) {
    URL.revokeObjectURL((img as any)._objectUrl);
    delete (img as any)._objectUrl;
  }
}

/**
 * Convert screen coordinates to grid coordinates
 */
export function screenToGrid(
  screenX: number,
  screenY: number,
  gridSize: number,
  canvasWidth: number,
  canvasHeight: number
): GridCell {
  const cols = Math.floor(canvasWidth / gridSize);
  const rows = Math.floor(canvasHeight / gridSize);
  
  const col = Math.floor(screenX / gridSize);
  const row = Math.floor(screenY / gridSize);
  
  return {
    row: Math.max(0, Math.min(row, rows - 1)),
    col: Math.max(0, Math.min(col, cols - 1)),
  };
}

/**
 * Convert grid coordinates to screen bounds
 */
export function gridToScreen(
  gridRow: number,
  gridCol: number,
  gridSize: number
): Rectangle {
  return {
    x: gridCol * gridSize,
    y: gridRow * gridSize,
    width: gridSize,
    height: gridSize,
  };
}

/**
 * Get grid key for storage
 */
export function getGridKey(row: number, col: number): string {
  return `${row},${col}`;
}

/**
 * Parse grid key back to coordinates
 */
export function parseGridKey(key: string): GridCell {
  const [row, col] = key.split(',').map(Number);
  return { row, col };
}

/**
 * Calculate distance between two points
 */
export function getDistance(point1: Point, point2: Point): number {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Check if point is inside rectangle
 */
export function isPointInRectangle(point: Point, rect: Rectangle): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

/**
 * Get all grid cells within a rectangle
 */
export function getGridCellsInRectangle(
  startPoint: Point,
  endPoint: Point,
  gridSize: number,
  canvasWidth: number,
  canvasHeight: number
): GridCell[] {
  const startGrid = screenToGrid(startPoint.x, startPoint.y, gridSize, canvasWidth, canvasHeight);
  const endGrid = screenToGrid(endPoint.x, endPoint.y, gridSize, canvasWidth, canvasHeight);
  
  const minRow = Math.min(startGrid.row, endGrid.row);
  const maxRow = Math.max(startGrid.row, endGrid.row);
  const minCol = Math.min(startGrid.col, endGrid.col);
  const maxCol = Math.max(startGrid.col, endGrid.col);
  
  const cells: GridCell[] = [];
  
  for (let row = minRow; row <= maxRow; row++) {
    for (let col = minCol; col <= maxCol; col++) {
      cells.push({ row, col });
    }
  }
  
  return cells;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// === RESOLUTION-BASED GRID FUNCTIONS ===

/**
 * Calculate the greatest common divisor
 */
export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * Calculate simplified aspect ratio from image dimensions
 */
export function calculateAspectRatio(width: number, height: number): AspectRatio {
  const divisor = gcd(width, height);
  return {
    width: width / divisor,
    height: height / divisor
  };
}

/**
 * Calculate grid dimensions based on aspect ratio and resolution
 */
export function calculateGridDimensions(aspectRatio: AspectRatio, resolution: number): { cols: number; rows: number } {
  return {
    cols: aspectRatio.width * resolution,
    rows: aspectRatio.height * resolution
  };
}

/**
 * Calculate cell size based on canvas dimensions and grid count
 */
export function calculateCellSize(
  canvasWidth: number,
  canvasHeight: number,
  gridCols: number,
  gridRows: number
): { width: number; height: number } {
  return {
    width: canvasWidth / gridCols,
    height: canvasHeight / gridRows
  };
}

/**
 * Complete grid calculation for resolution-based system
 */
export function calculateGridFromResolution(
  imageWidth: number,
  imageHeight: number,
  canvasWidth: number,
  canvasHeight: number,
  resolution: number
): GridCalculation {
  const aspectRatio = calculateAspectRatio(imageWidth, imageHeight);
  const gridDimensions = calculateGridDimensions(aspectRatio, resolution);
  const cellSize = calculateCellSize(canvasWidth, canvasHeight, gridDimensions.cols, gridDimensions.rows);
  
  return {
    aspectRatio,
    gridDimensions,
    cellSize
  };
}

/**
 * Convert screen coordinates to grid coordinates (resolution-based)
 */
export function screenToGridResolution(
  screenX: number,
  screenY: number,
  cellWidth: number,
  cellHeight: number,
  gridCols: number,
  gridRows: number
): GridCell {
  const col = Math.floor(screenX / cellWidth);
  const row = Math.floor(screenY / cellHeight);
  
  return {
    row: Math.max(0, Math.min(row, gridRows - 1)),
    col: Math.max(0, Math.min(col, gridCols - 1)),
  };
}

/**
 * Convert grid coordinates to screen bounds (resolution-based)
 */
export function gridToScreenResolution(
  gridRow: number,
  gridCol: number,
  cellWidth: number,
  cellHeight: number
): Rectangle {
  return {
    x: gridCol * cellWidth,
    y: gridRow * cellHeight,
    width: cellWidth,
    height: cellHeight,
  };
}

/**
 * Get all grid cells within a rectangle (resolution-based)
 */
export function getGridCellsInRectangleResolution(
  startPoint: Point,
  endPoint: Point,
  cellWidth: number,
  cellHeight: number,
  gridCols: number,
  gridRows: number
): GridCell[] {
  const startGrid = screenToGridResolution(startPoint.x, startPoint.y, cellWidth, cellHeight, gridCols, gridRows);
  const endGrid = screenToGridResolution(endPoint.x, endPoint.y, cellWidth, cellHeight, gridCols, gridRows);
  
  const minRow = Math.min(startGrid.row, endGrid.row);
  const maxRow = Math.max(startGrid.row, endGrid.row);
  const minCol = Math.min(startGrid.col, endGrid.col);
  const maxCol = Math.max(startGrid.col, endGrid.col);
  
  const cells: GridCell[] = [];
  
  for (let row = minRow; row <= maxRow; row++) {
    for (let col = minCol; col <= maxCol; col++) {
      cells.push({ row, col });
    }
  }
  
  return cells;
}

/**
 * Merges a set of selected grid cells into the minimum number of larger rectangles.
 * This is a greedy algorithm.
 */
export function mergeGridsToRects(selectedGrids: Set<string>, totalCols: number, totalRows: number): Rectangle[] {
  const rects: Rectangle[] = [];
  const visited = new Set<string>();

  for (let r = 0; r < totalRows; r++) {
    for (let c = 0; c < totalCols; c++) {
      const currentKey = getGridKey(r, c);
      if (!selectedGrids.has(currentKey) || visited.has(currentKey)) {
        continue;
      }

      // Find the max width for this starting point
      let width = 1;
      while (c + width < totalCols && selectedGrids.has(getGridKey(r, c + width)) && !visited.has(getGridKey(r, c + width))) {
        width++;
      }

      // Find the max height for this starting point and width
      let height = 1;
      let canExpandDown = true;
      while (r + height < totalRows && canExpandDown) {
        for (let i = 0; i < width; i++) {
          if (!selectedGrids.has(getGridKey(r + height, c + i)) || visited.has(getGridKey(r + height, c + i))) {
            canExpandDown = false;
            break;
          }
        }
        if (canExpandDown) {
          height++;
        }
      }

      // Mark all cells in the new rectangle as visited
      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          visited.add(getGridKey(r + i, c + j));
        }
      }

      rects.push({ x: c, y: r, width, height });
    }
  }

  return rects;
} 