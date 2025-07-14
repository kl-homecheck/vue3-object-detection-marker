# Vue 3 Object Detection Marker

A powerful Vue 3 component for object detection marking with multi-layer support, grid-based selection, and resolution-independent data handling.

## 🚀 Demo

[Live Demo](https://homecheck.github.io/hck-marker/)

## ✨ Features

- **Multi-layer Support**: Work with multiple color-coded layers simultaneously
- **Multiple Selection Modes**: Point, rectangle, and eraser tools
- **Brush System**: Configurable brush size and shape (circle/square)
- **Resolution Independent**: Percentage-based coordinates for cross-resolution compatibility
- **Touch Support**: Full mobile and tablet compatibility
- **TypeScript**: Full TypeScript support with comprehensive type definitions
- **Export/Import**: Multiple data formats (grid, optimized, percentage-based)
- **Preview Component**: Read-only component for displaying marked data

## 📦 Installation

```bash
npm install vue3-object-detection-marker
```

## 🛠️ Usage

### Basic Usage

```vue
<template>
  <div>
    <ObjectDetectionMarker
      ref="markerRef"
      :image="imageUrl"
      :canvas-width="800"
      :canvas-height="600"
      :resolution="10"
      selection-mode="point"
    />
    
    <ObjectDetectionPreview
      :image="imageUrl"
      :selection-data="previewData"
      object-fit-mode="contain"
      render-mode="grid"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ObjectDetectionMarker, ObjectDetectionPreview } from 'vue3-object-detection-marker'
import type { GridLayerExport } from 'vue3-object-detection-marker'

const markerRef = ref()
const imageUrl = ref('your-image-url.jpg')
const previewData = ref<GridLayerExport | null>(null)

const exportData = () => {
  if (markerRef.value) {
    const data = markerRef.value.exportOptimizedLayers()
    previewData.value = data
    console.log('Exported data:', data)
  }
}
</script>
```

### Advanced Usage with External Controls

```vue
<template>
  <div class="marker-container">
    <!-- External Controls -->
    <div class="controls">
      <button @click="switchMode('point')">Point Mode</button>
      <button @click="switchMode('rectangle')">Rectangle Mode</button>
      <button @click="switchMode('eraser')">Eraser Mode</button>
      
      <button @click="setActiveLayer('#ff0000')">Red Layer</button>
      <button @click="setActiveLayer('#00ff00')">Green Layer</button>
      
      <input 
        type="range" 
        min="1" 
        max="10" 
        v-model="brushSize" 
        @input="updateBrushSize"
      />
    </div>
    
    <!-- Marker Component -->
    <ObjectDetectionMarker
      ref="markerRef"
      :image="imageUrl"
      :canvas-width="800"
      :canvas-height="600"
      :resolution="resolution"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ObjectDetectionMarker } from 'vue3-object-detection-marker'

const markerRef = ref()
const brushSize = ref(3)

const switchMode = (mode: 'point' | 'rectangle' | 'eraser') => {
  markerRef.value?.switchMode(mode)
}

const setActiveLayer = (color: string) => {
  markerRef.value?.setActiveColorLayer(color)
}

const updateBrushSize = () => {
  markerRef.value?.setBrushSize(brushSize.value)
}
</script>
```

## 📋 Props

### ObjectDetectionMarker

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `image` | `string` | `''` | Image URL to load |
| `canvasWidth` | `number` | `800` | Canvas width in pixels |
| `canvasHeight` | `number` | `600` | Canvas height in pixels |
| `resolution` | `number` | `10` | Grid resolution (cells per dimension) |
| `selectionMode` | `'point' \| 'rectangle' \| 'eraser'` | `'point'` | Initial selection mode |
| `layerColors` | `string[]` | `['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']` | Available layer colors |
| `defaultBrushSize` | `number` | `3` | Initial brush size |
| `defaultBrushShape` | `'circle' \| 'square'` | `'circle'` | Initial brush shape |

### ObjectDetectionPreview

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `image` | `string` | `''` | Image URL to display |
| `selectionData` | `GridLayerExport \| null` | `null` | Selection data to render |
| `objectFitMode` | `'contain' \| 'cover'` | `'contain'` | Image fit mode |
| `renderMode` | `'grid' \| 'rect'` | `'grid'` | Rendering mode |

## 🔧 Methods

### ObjectDetectionMarker Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `exportGridLayers()` | - | `ColorLayerExport` | Export raw grid data |
| `exportOptimizedLayers()` | - | `GridLayerExport` | Export optimized data |
| `getSelectionAsPercentRects()` | - | `PercentRect[]` | Export as percentage rectangles |
| `importGridLayers(data)` | `ColorLayerExport` | `void` | Import grid data |
| `importOptimizedLayers(data)` | `GridLayerExport` | `void` | Import optimized data |
| `switchMode(mode)` | `SelectionMode` | `void` | Change selection mode |
| `setActiveColorLayer(color)` | `string` | `void` | Set active layer color |
| `setBrushSize(size)` | `number` | `void` | Set brush size |
| `setBrushShape(shape)` | `BrushShape` | `void` | Set brush shape |

## 📊 Data Formats

### Grid Layer Export
```typescript
interface GridLayerExport {
  layers: LayerData[]
  metadata: {
    resolution: number
    canvasWidth: number
    canvasHeight: number
    imageUrl: string
    totalSelected: number
  }
}
```

### Percentage Rectangle Export
```typescript
interface PercentRect {
  x: number      // 0-100
  y: number      // 0-100
  width: number  // 0-100
  height: number // 0-100
  color: string
}
```

## 🎨 Styling

The component uses scoped CSS and can be customized by overriding CSS variables or using deep selectors:

```css
/* Custom canvas border */
:deep(.marker-canvas) {
  border: 2px solid #007bff;
  border-radius: 8px;
}

/* Custom loading indicator */
:deep(.loading-indicator) {
  background: rgba(0, 123, 255, 0.1);
  color: #007bff;
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [GitHub Repository](https://github.com/kl-homecheck/vue3-object-detection-marker)
- [Live Demo](https://kl-homecheck.github.io/vue3-object-detection-marker/)
- [npm Package](https://www.npmjs.com/package/vue3-object-detection-marker) 