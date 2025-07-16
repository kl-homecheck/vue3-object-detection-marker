# Vue 3 Object Detection Marker

Vue 3를 위한 강력한 객체 감지 마킹 컴포넌트입니다. 멀티 레이어 지원, 그리드 기반 선택, 해상도 독립적 데이터 처리 기능을 제공합니다.

## 🚀 데모

[라이브 데모](https://kl-homecheck.github.io/vue3-object-detection-marker/)

## ✨ 주요 기능

### 🎨 멀티 레이어 시스템
- **다중 색상 레이어**: 동시에 여러 색상 레이어로 작업
- **레이어 가시성 제어**: 각 레이어의 표시/숨김 제어
- **레이어별 투명도**: 각 레이어의 투명도 개별 설정
- **활성 레이어 전환**: 실시간 레이어 간 전환

### 🖱️ 다양한 선택 모드
- **포인트 모드**: 개별 그리드 셀 선택
- **사각형 모드**: 드래그로 영역 선택
- **지우개 모드**: 선택된 영역 제거
- **브러시 시스템**: 크기 및 모양(원형/사각형) 조절 가능

### 📐 해상도 독립적 설계
- **백분율 기반 좌표**: 다양한 해상도에서 일관된 결과
- **종횡비 자동 계산**: 이미지 비율에 따른 자동 그리드 조정
- **스케일링 지원**: 캔버스 크기 변경에 따른 자동 스케일링

### 📱 터치 지원
- **모바일 호환**: 터치 이벤트 완전 지원
- **태블릿 최적화**: 터치 드래그 및 제스처 지원
- **반응형 디자인**: 다양한 화면 크기 대응

### 📊 다양한 데이터 형식
- **그리드 내보내기**: 원시 그리드 데이터 형식
- **최적화된 내보내기**: 사각형으로 병합된 최적화 형식
- **백분율 내보내기**: 해상도 독립적 백분율 형식
- **렌더링 모드**: 그리드/사각형 렌더링 모드 지원

## 📦 설치

```bash
npm install @homecheck/vue3-object-detection-marker
```

## 🛠️ 사용법

### 기본 사용법

```vue
<template>
  <div>
    <!-- 마킹 컴포넌트 -->
    <ObjectDetectionMarker
      ref="markerRef"
      :image="imageUrl"
      :canvas-width="800"
      :canvas-height="600"
      :resolution="10"
      selection-mode="point"
      @selection-change="handleSelectionChange"
      @layer-change="handleLayerChange"
    />
    
    <!-- 미리보기 컴포넌트 -->
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
import { ObjectDetectionMarker, ObjectDetectionPreview } from '@homecheck/vue3-object-detection-marker'
import type { GridLayerExport, ExtendedSelectionData, LayerSelectionData } from '@homecheck/vue3-object-detection-marker'

const markerRef = ref()
const imageUrl = ref('your-image-url.jpg')
const previewData = ref<GridLayerExport | null>(null)

const handleSelectionChange = (data: ExtendedSelectionData) => {
  console.log('선택 변경:', data)
}

const handleLayerChange = (data: LayerSelectionData) => {
  console.log('레이어 변경:', data)
}

const exportData = () => {
  if (markerRef.value) {
    const data = markerRef.value.exportOptimizedLayers()
    previewData.value = data
    console.log('내보낸 데이터:', data)
  }
}
</script>
```

### 고급 사용법 - 외부 컨트롤

```vue
<template>
  <div class="marker-container">
    <!-- 외부 컨트롤 -->
    <div class="controls">
      <!-- 모드 전환 -->
      <div class="mode-controls">
        <button @click="switchMode('point')" :class="{ active: currentMode === 'point' }">
          포인트 모드
        </button>
        <button @click="switchMode('rectangle')" :class="{ active: currentMode === 'rectangle' }">
          사각형 모드
        </button>
        <button @click="switchMode('eraser')" :class="{ active: currentMode === 'eraser' }">
          지우개 모드
        </button>
      </div>
      
      <!-- 레이어 선택 -->
      <div class="layer-controls">
        <button 
          v-for="color in layerColors" 
          :key="color"
          @click="setActiveLayer(color)"
          :class="{ active: activeLayer === color }"
          :style="{ backgroundColor: color }"
        >
          {{ getColorName(color) }}
        </button>
      </div>
      
      <!-- 브러시 설정 -->
      <div class="brush-controls">
        <label>브러시 크기: {{ brushSize }}</label>
        <input 
          type="range" 
          min="1" 
          max="10" 
          v-model="brushSize" 
          @input="updateBrushSize"
        />
        
        <label>브러시 모양:</label>
        <select v-model="brushShape" @change="updateBrushShape">
          <option value="circle">원형</option>
          <option value="square">사각형</option>
        </select>
      </div>
    </div>
    
    <!-- 마커 컴포넌트 -->
    <ObjectDetectionMarker
      ref="markerRef"
      :image="imageUrl"
      :canvas-width="800"
      :canvas-height="600"
      :resolution="resolution"
      :layer-colors="layerColors"
      :default-brush-size="brushSize"
      :default-brush-shape="brushShape"
      @layer-change="handleLayerChange"
      @active-layer-change="handleActiveLayerChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ObjectDetectionMarker } from '@homecheck/vue3-object-detection-marker'
import type { SelectionMode, BrushShape, LayerSelectionData } from '@homecheck/vue3-object-detection-marker'

const markerRef = ref()
const currentMode = ref<SelectionMode>('point')
const activeLayer = ref('#ff0000')
const brushSize = ref(3)
const brushShape = ref<BrushShape>('circle')
const layerColors = ref(['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'])

const switchMode = (mode: SelectionMode) => {
  currentMode.value = mode
  markerRef.value?.switchMode(mode)
}

const setActiveLayer = (color: string) => {
  activeLayer.value = color
  markerRef.value?.setActiveColorLayer(color)
}

const updateBrushSize = () => {
  markerRef.value?.setBrushSize(brushSize.value)
}

const updateBrushShape = () => {
  markerRef.value?.setBrushShape(brushShape.value)
}

const getColorName = (color: string) => {
  const names: Record<string, string> = {
    '#ff0000': '빨강',
    '#00ff00': '초록',
    '#0000ff': '파랑',
    '#ffff00': '노랑',
    '#ff00ff': '마젠타'
  }
  return names[color.toLowerCase()] || color
}

const handleLayerChange = (data: LayerSelectionData) => {
  console.log('레이어 데이터:', data)
}

const handleActiveLayerChange = (color: string) => {
  activeLayer.value = color
}
</script>
```

## 📋 컴포넌트 API

### ObjectDetectionMarker

객체 감지 마킹을 위한 메인 컴포넌트입니다.

#### Props

| 속성 | 타입 | 기본값 | 설명 |
|------|------|---------|-------------|
| `image` | `string \| File \| Blob` | `''` | 로드할 이미지 소스 |
| `canvasWidth` | `number` | `800` | 캔버스 너비 (픽셀) |
| `canvasHeight` | `number` | `600` | 캔버스 높이 (픽셀) |
| `resolution` | `number` | `10` | 그리드 해상도 (차원당 셀 수) |
| `selectionMode` | `'point' \| 'rectangle' \| 'eraser'` | `'point'` | 초기 선택 모드 |
| `layerColors` | `string[]` | `['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']` | 사용 가능한 레이어 색상 |
| `defaultBrushSize` | `number` | `3` | 초기 브러시 크기 |
| `defaultBrushShape` | `'circle' \| 'square'` | `'circle'` | 초기 브러시 모양 |
| `highlightColor` | `string` | `'#007bff'` | 선택 영역 강조 색상 |
| `gridColor` | `string` | `'#cccccc'` | 그리드 라인 색상 |
| `hoverColor` | `string` | `'#6c757d'` | 호버 상태 색상 |
| `backgroundColor` | `string` | `'#ffffff'` | 배경 색상 |

#### Events

| 이벤트 | 매개변수 | 설명 |
|--------|----------|-------------|
| `selectionChange` | `ExtendedSelectionData` | 선택 영역 변경 시 발생 |
| `modeChange` | `SelectionMode` | 선택 모드 변경 시 발생 |
| `imageLoad` | `HTMLImageElement` | 이미지 로드 완료 시 발생 |
| `imageError` | `Error` | 이미지 로드 실패 시 발생 |
| `gridHover` | `GridCell \| null` | 그리드 셀 호버 시 발생 |
| `layerChange` | `LayerSelectionData` | 레이어 데이터 변경 시 발생 |
| `activeLayerChange` | `string` | 활성 레이어 변경 시 발생 |
| `layerVisibilityChange` | `string, boolean` | 레이어 가시성 변경 시 발생 |

#### Methods

| 메서드 | 매개변수 | 반환값 | 설명 |
|--------|----------|---------|-------------|
| `exportGridLayers()` | - | `ColorLayerExport` | 원시 그리드 데이터 내보내기 |
| `exportOptimizedLayers()` | - | `GridLayerExport` | 최적화된 데이터 내보내기 |
| `importGridLayers(data)` | `ColorLayerExport` | `void` | 그리드 데이터 가져오기 |
| `importOptimizedLayers(data)` | `GridLayerExport` | `void` | 최적화된 데이터 가져오기 |
| `switchMode(mode)` | `SelectionMode` | `void` | 선택 모드 변경 |
| `setActiveColorLayer(color)` | `string` | `void` | 활성 레이어 색상 설정 |
| `toggleLayerVisibility(color)` | `string` | `void` | 레이어 가시성 토글 |
| `setBrushSize(size)` | `number` | `void` | 브러시 크기 설정 |
| `setBrushShape(shape)` | `BrushShape` | `void` | 브러시 모양 설정 |
| `getTotalSelectedCount()` | - | `number` | 전체 선택된 셀 수 반환 |
| `getActiveLayerCount()` | - | `number` | 활성 레이어 선택된 셀 수 반환 |

### ObjectDetectionPreview

선택된 데이터를 미리보기로 표시하는 읽기 전용 컴포넌트입니다.

#### Props

| 속성 | 타입 | 기본값 | 설명 |
|------|------|---------|-------------|
| `image` | `string \| File \| Blob` | `''` | 표시할 이미지 |
| `selectionData` | `GridLayerExport \| null` | `null` | 렌더링할 선택 데이터 |
| `objectFitMode` | `'contain' \| 'cover'` | `'contain'` | 이미지 맞춤 모드 |
| `renderMode` | `'grid' \| 'rect'` | `'grid'` | 렌더링 모드 |
| `canvasWidth` | `number` | `auto` | 캔버스 너비 |
| `canvasHeight` | `number` | `auto` | 캔버스 높이 |
| `backgroundColor` | `string` | `'#f8f9fa'` | 배경 색상 |
| `layerColors` | `Record<string, {color: string, opacity: number}>` | `{}` | 레이어별 색상 및 투명도 설정 |

#### 렌더링 모드

- **`grid`**: 개별 그리드 셀들을 모두 렌더링
- **`rect`**: 각 레이어의 모든 셀을 포함하는 단일 경계 사각형으로 렌더링

## 🔧 헬퍼 함수

### 그리드 변환 함수

```typescript
import { 
  convertGridLayerToRenderRects,
  getBoundingRectangle,
  convertGridRectsToPercentRects,
  convertPercentRectsToPixelRects
} from '@homecheck/vue3-object-detection-marker'
```

#### `convertGridLayerToRenderRects(data, renderMode)`

GridLayerExport 데이터를 렌더링 모드에 맞게 변환합니다.

```typescript
const renderRects = convertGridLayerToRenderRects(gridData, 'rect')
// 'grid' 모드: 원본 사각형들 반환
// 'rect' 모드: 각 레이어를 단일 경계 사각형으로 병합
```

#### `getBoundingRectangle(rects)`

주어진 사각형들을 모두 포함하는 경계 사각형을 계산합니다.

```typescript
const boundingRect = getBoundingRectangle([
  { x: 10, y: 10, width: 20, height: 20 },
  { x: 40, y: 40, width: 30, height: 30 }
])
// 결과: { x: 10, y: 10, width: 60, height: 60 }
```

#### `convertGridRectsToPercentRects(rects, gridCols, gridRows)`

그리드 기반 사각형을 백분율 기반으로 변환합니다.

```typescript
const percentRects = convertGridRectsToPercentRects(
  [{ x: 5, y: 5, width: 10, height: 10 }],
  100, // 총 열 수
  100  // 총 행 수
)
// 결과: [{ x: 0.05, y: 0.05, width: 0.1, height: 0.1 }]
```

#### `convertPercentRectsToPixelRects(percentRects, canvasWidth, canvasHeight)`

백분율 기반 사각형을 픽셀 기반으로 변환합니다.

```typescript
const pixelRects = convertPercentRectsToPixelRects(
  [{ x: 0.1, y: 0.1, width: 0.2, height: 0.2 }],
  800, // 캔버스 너비
  600  // 캔버스 높이
)
// 결과: [{ x: 80, y: 60, width: 160, height: 120 }]
```

### 그리드 계산 함수

```typescript
import { 
  calculateGridFromResolution,
  screenToGridResolution,
  gridToScreenResolution,
  mergeGridsToRects
} from '@homecheck/vue3-object-detection-marker'
```

#### `calculateGridFromResolution(imageWidth, imageHeight, canvasWidth, canvasHeight, resolution)`

해상도 기반 그리드 시스템의 전체 계산을 수행합니다.

```typescript
const gridCalc = calculateGridFromResolution(1920, 1080, 800, 600, 10)
// 결과: {
//   aspectRatio: { width: 16, height: 9 },
//   gridDimensions: { cols: 160, rows: 90 },
//   cellSize: { width: 5, height: 6.67 }
// }
```

#### `screenToGridResolution(screenX, screenY, cellWidth, cellHeight, gridCols, gridRows)`

화면 좌표를 그리드 좌표로 변환합니다.

```typescript
const gridCell = screenToGridResolution(100, 150, 5, 6.67, 160, 90)
// 결과: { row: 22, col: 20 }
```

#### `mergeGridsToRects(selectedGrids, totalCols, totalRows)`

선택된 그리드 셀들을 최소한의 사각형으로 병합합니다.

```typescript
const selectedGrids = new Set(['0,0', '0,1', '1,0', '1,1'])
const rects = mergeGridsToRects(selectedGrids, 100, 100)
// 결과: [{ x: 0, y: 0, width: 2, height: 2 }]
```

## 📊 데이터 형식

### GridLayerExport

최적화된 내보내기 형식입니다.

```typescript
interface GridLayerExport {
  metadata: {
    cols: number        // 그리드 열 수
    rows: number        // 그리드 행 수
  }
  layers: Record<string, Rectangle[]>  // 색상별 사각형 배열
}

interface Rectangle {
  x: number           // 시작 열 위치
  y: number           // 시작 행 위치
  width: number       // 너비 (셀 단위)
  height: number      // 높이 (셀 단위)
}
```

### ColorLayerExport

원시 그리드 데이터 형식입니다.

```typescript
interface ColorLayerExport {
  imageSize: { width: number; height: number }
  resolution: number
  layers: Record<string, string[]>  // 색상별 그리드 키 배열
}
```

### PercentRect

해상도 독립적 백분율 사각형입니다.

```typescript
interface PercentRect {
  x: number      // 0-1 (0% - 100%)
  y: number      // 0-1 (0% - 100%)
  width: number  // 0-1 (0% - 100%)
  height: number // 0-1 (0% - 100%)
}
```

### ExtendedSelectionData

선택 변경 이벤트 데이터입니다.

```typescript
interface ExtendedSelectionData {
  selectedCells: GridCell[]
  resolution: number
  imageAspectRatio: { width: number; height: number }
  gridDimensions: { cols: number; rows: number }
  cellSize: { width: number; height: number }
  imageWidth: number
  imageHeight: number
  canvasWidth: number
  canvasHeight: number
  layerData?: LayerSelectionData
}
```

### LayerSelectionData

레이어 정보 데이터입니다.

```typescript
interface LayerSelectionData {
  activeColor: string
  layers: Array<{
    color: string
    selectedCount: number
    visible: boolean
    name?: string
  }>
  totalSelected: number
}
```

## 🎨 스타일링

컴포넌트는 scoped CSS를 사용하며 CSS 변수 재정의나 deep 선택자를 통해 커스터마이징할 수 있습니다.

```css
/* 캔버스 테두리 커스터마이징 */
:deep(.marker-canvas) {
  border: 2px solid #007bff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 로딩 인디케이터 커스터마이징 */
:deep(.loading-indicator) {
  background: rgba(0, 123, 255, 0.9);
  color: white;
  font-weight: bold;
}

/* 에러 메시지 커스터마이징 */
:deep(.error-message) {
  background: rgba(220, 53, 69, 0.9);
  color: white;
  border-radius: 4px;
}

/* 미리보기 컴포넌트 스타일링 */
:deep(.preview-canvas) {
  border: 1px solid #dee2e6;
  border-radius: 4px;
}
```

## 🔄 실시간 데이터 동기화

마킹 컴포넌트와 미리보기 컴포넌트 간 실시간 동기화 예제:

```vue
<template>
  <div class="sync-container">
    <div class="marker-section">
      <ObjectDetectionMarker
        ref="markerRef"
        :image="imageUrl"
        @selection-change="handleSelectionChange"
        @layer-change="handleLayerChange"
      />
    </div>
    
    <div class="preview-section">
      <ObjectDetectionPreview
        :image="imageUrl"
        :selection-data="previewData"
        :render-mode="renderMode"
      />
      
      <!-- 헬퍼 함수 활용 정보 표시 -->
      <div class="helper-info">
        <h4>변환된 렌더링 데이터:</h4>
        <pre>{{ JSON.stringify(convertedRects, null, 2) }}</pre>
        
        <h4>경계 사각형 정보:</h4>
        <div v-for="(info, color) in boundingInfo" :key="color">
          <span :style="{ color }">{{ color }}</span>: 
          {{ info.rectCount }}개 사각형 → 
          경계 크기: {{ info.boundingRect.width }}×{{ info.boundingRect.height }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  ObjectDetectionMarker, 
  ObjectDetectionPreview,
  convertGridLayerToRenderRects,
  getBoundingRectangle
} from '@homecheck/vue3-object-detection-marker'

const markerRef = ref()
const previewData = ref(null)
const renderMode = ref('grid')

// 실시간 변환된 데이터
const convertedRects = computed(() => {
  if (!previewData.value) return {}
  return convertGridLayerToRenderRects(previewData.value, renderMode.value)
})

// 경계 사각형 정보
const boundingInfo = computed(() => {
  if (!previewData.value) return {}
  const result = {}
  
  Object.entries(previewData.value.layers).forEach(([color, rects]) => {
    if (rects.length > 0) {
      result[color] = {
        rectCount: rects.length,
        boundingRect: getBoundingRectangle(rects)
      }
    }
  })
  
  return result
})

const handleSelectionChange = () => {
  // 실시간 업데이트
  if (markerRef.value) {
    previewData.value = markerRef.value.exportOptimizedLayers()
  }
}

const handleLayerChange = (layerData) => {
  console.log('레이어 변경:', layerData)
  // 필요시 추가 처리
}
</script>
```

## 🚀 성능 최적화

### 대용량 데이터 처리

```typescript
// 대용량 선택 데이터 최적화
const optimizeSelection = () => {
  if (markerRef.value) {
    // 원시 데이터 대신 최적화된 데이터 사용
    const optimizedData = markerRef.value.exportOptimizedLayers()
    
    // 백분율 변환으로 메모리 사용량 감소
    const percentData = convertGridRectsToPercentRects(
      optimizedData.layers['#ff0000'] || [],
      optimizedData.metadata.cols,
      optimizedData.metadata.rows
    )
    
    console.log('최적화된 데이터:', percentData)
  }
}
```

### 이벤트 최적화

```typescript
import { debounce } from '@homecheck/vue3-object-detection-marker'

// 선택 변경 이벤트 디바운싱
const debouncedSelectionChange = debounce((data) => {
  // 실제 처리 로직
  updatePreview(data)
}, 100)
```

## 🤝 기여하기

기여를 환영합니다! Pull Request를 자유롭게 제출해 주세요.

## 📄 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🔗 링크

- [GitHub 저장소](https://github.com/kl-homecheck/vue3-object-detection-marker)
- [라이브 데모](https://kl-homecheck.github.io/vue3-object-detection-marker/)
- [NPM 패키지](https://www.npmjs.com/package/@homecheck/vue3-object-detection-marker)

## 📝 변경 로그

### v1.0.0-rc.1
- 초기 릴리스
- 멀티 레이어 시스템 구현
- 브러시 시스템 추가
- 헬퍼 함수 라이브러리 제공
- TypeScript 완전 지원
- 터치 이벤트 지원
- 해상도 독립적 데이터 처리 