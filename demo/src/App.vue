<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import ObjectDetectionMarker from './components/ObjectDetectionMarker.vue';
import ObjectDetectionPreview from './components/ObjectDetectionPreview.vue';
import type { GridLayerExport } from './types/index';

// --- State ---
const markerRef = ref<InstanceType<typeof ObjectDetectionMarker> | null>(null);
const imageUrl = ref('https://picsum.photos/800/600?random=1');
const resolution = ref(6);
const jsonData = ref('');
const previewData = ref<GridLayerExport | null>(null);
const copySuccess = ref(false);

const testImageIndex = ref(1);
const objectFitMode = ref<'contain' | 'cover'>('contain');
const renderMode = ref<'grid' | 'rect'>('grid');

// Marker control state
const currentMode = ref<'point' | 'rectangle' | 'eraser'>('point');
const activeColorLayer = ref('#ff0000');
const brushSize = ref(3);
const brushShape = ref<'circle' | 'square'>('circle');

// Modal state
const showModal = ref(false);
const modalTitle = ref('');
const modalContent = ref('');

// --- Methods ---
const updatePreview = () => {
  if (markerRef.value) {
    const data = markerRef.value.exportOptimizedLayers();
    previewData.value = data;
  }
};

const handleExportToClipboard = () => {
  if (markerRef.value) {
    const data = markerRef.value.exportOptimizedLayers();
    if (data) {
      const jsonString = JSON.stringify(data, null, 2);
      navigator.clipboard.writeText(jsonString).then(() => {
        showExportModal('Optimized Grid Export', jsonString);
        updatePreview(); // Auto-update preview
      });
    }
  }
};

// Helper Export: Grid Layers (raw)
const handleExportGridLayers = () => {
  if (markerRef.value) {
    const data = markerRef.value.exportGridLayers();
    const jsonString = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      showExportModal('Raw Grid Layers Export', jsonString);
      updatePreview(); // Auto-update preview
    });
  }
};

// Helper Export: Percent Rects
const handleExportPercentRects = () => {
  if (markerRef.value) {
    const data = markerRef.value.getSelectionAsPercentRects();
    const jsonString = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      showExportModal('Percent Rects Export', jsonString);
      updatePreview(); // Auto-update preview
    });
  }
};

// Test function to change image and trigger loading
const handleChangeTestImage = () => {
  testImageIndex.value = (testImageIndex.value % 10) + 1;
  imageUrl.value = `https://picsum.photos/800/600?random=${testImageIndex.value}`;
};

// Force reload preview to test skeleton loading
const handleReloadPreview = () => {
  if (previewData.value) {
    const temp = previewData.value;
    previewData.value = null;
    setTimeout(() => {
      previewData.value = temp;
    }, 100);
  }
};

// Toggle object-fit mode
const toggleObjectFitMode = () => {
  objectFitMode.value = objectFitMode.value === 'contain' ? 'cover' : 'contain';
};

// Toggle render mode
const toggleRenderMode = () => {
  renderMode.value = renderMode.value === 'grid' ? 'rect' : 'grid';
};

const handleUpdateFromText = () => {
  if (!jsonData.value) {
    alert('Textarea에 JSON 데이터를 붙여넣어 주세요.');
    return;
  }
  try {
    const parsedData = JSON.parse(jsonData.value);
    previewData.value = parsedData;
    if (markerRef.value) {
      markerRef.value.importOptimizedLayers(parsedData);
    }
  } catch (e) {
    alert('JSON 형식이 올바르지 않습니다.');
    console.error("JSON Parse Error:", e);
  }
};

const showExportModal = (title: string, content: string) => {
  modalTitle.value = title;
  modalContent.value = content;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const copyModalContent = () => {
  navigator.clipboard.writeText(modalContent.value).then(() => {
    copySuccess.value = true;
    setTimeout(() => (copySuccess.value = false), 2000);
  });
};

// Marker control methods
const switchMode = (mode: 'point' | 'rectangle' | 'eraser') => {
  currentMode.value = mode;
  if (markerRef.value) {
    markerRef.value.switchMode(mode);
  }
};

const setActiveColorLayer = (color: string) => {
  activeColorLayer.value = color;
  if (markerRef.value) {
    markerRef.value.setActiveColorLayer(color);
  }
};

const toggleLayerVisibility = (color: string) => {
  if (markerRef.value) {
    markerRef.value.toggleLayerVisibility(color);
  }
};

const setBrushSize = (size: number) => {
  brushSize.value = size;
  if (markerRef.value) {
    markerRef.value.setBrushSize(size);
  }
};

const setBrushShape = (shape: 'circle' | 'square') => {
  brushShape.value = shape;
  if (markerRef.value) {
    markerRef.value.setBrushShape(shape);
  }
};

// Get marker state - using computed for reactivity
const totalSelectedCount = computed(() => {
  return markerRef.value?.getTotalSelectedCount() || 0;
});

const activeLayerCount = computed(() => {
  return markerRef.value?.getActiveLayerCount() || 0;
});

const getColorName = (color: string) => {
  return markerRef.value?.getColorName(color) || color;
};

// Watch for mode changes and re-render preview
watch([objectFitMode, renderMode], () => {
  // Force re-render by briefly setting to null
  if (previewData.value) {
    const temp = previewData.value;
    previewData.value = null;
    setTimeout(() => {
      previewData.value = temp;
    }, 10);
  }
});
</script>

<template>
  <div id="app">
    <header class="app-header">
      <h1>Vue 3 Object Detection Marker</h1>
      <div class="header-controls">
        <button @click="handleChangeTestImage" class="header-button">
          테스트 이미지 변경 ({{ testImageIndex }})
        </button>
      </div>
    </header>

    <div class="app-layout">
      <!-- Main Content Area -->
      <div class="main-content">
        <!-- Marker Section -->
        <div class="content-section">
          <h2>마커 (편집 가능)</h2>
          <div class="marker-container">
            <ObjectDetectionMarker
              ref="markerRef"
              :image="imageUrl"
              :canvas-width="700"
              :canvas-height="500"
              :resolution="resolution"
              selection-mode="point"
            />
          </div>
        </div>

        <!-- Preview Section -->
        <div class="content-section">
          <h2>미리보기 (읽기 전용)</h2>
          <div class="preview-controls">
            <button @click="toggleObjectFitMode" class="mode-button fit-mode">
              {{ objectFitMode === 'contain' ? 'Contain' : 'Cover' }}
            </button>
            <button @click="toggleRenderMode" class="mode-button render-mode">
              {{ renderMode === 'grid' ? 'Grid' : 'Rect' }}
            </button>
            <button @click="handleReloadPreview" class="mode-button" :disabled="!previewData">
              스켈레톤 테스트
            </button>
          </div>
          <div class="preview-container" :class="{ 'has-data': previewData }">
            <ObjectDetectionPreview
              v-if="previewData"
              :image="imageUrl"
              :selection-data="previewData"
              :object-fit-mode="objectFitMode"
              :render-mode="renderMode"
            />
            <div v-else class="placeholder">
              <p>우측 패널에서 "미리보기 업데이트" 버튼을 클릭하세요</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Control Panel -->
      <div class="control-panel">
        <h3>컨트롤 패널</h3>
        
        <!-- Mode Selection -->
        <div class="control-group">
          <h4>선택 모드</h4>
          <div class="control-buttons horizontal">
            <button 
              @click="switchMode('point')" 
              :class="['control-button', { active: currentMode === 'point' }]"
            >
              포인트
            </button>
            <span class="separator">|</span>
            <button 
              @click="switchMode('rectangle')" 
              :class="['control-button', { active: currentMode === 'rectangle' }]"
            >
              사각형
            </button>
            <span class="separator">|</span>
            <button 
              @click="switchMode('eraser')" 
              :class="['control-button', { active: currentMode === 'eraser' }]"
            >
              지우개
            </button>
          </div>
        </div>

        <!-- Brush Controls -->
        <div class="control-group" v-if="currentMode === 'point' || currentMode === 'eraser'">
          <h4>브러시 설정</h4>
          <div class="brush-controls-horizontal">
            <div class="brush-size-section">
              <label>크기: {{ brushSize }}</label>
              <input type="range" min="1" max="10" v-model.number="brushSize" @input="setBrushSize(brushSize)" class="slider compact" />
            </div>
            <span class="separator">|</span>
            <div class="brush-shape-section">
              <span class="shape-label">모양:</span>
              <button 
                @click="setBrushShape('circle')" 
                :class="['control-button', 'compact', { active: brushShape === 'circle' }]"
              >
                원형
              </button>
              <button 
                @click="setBrushShape('square')" 
                :class="['control-button', 'compact', { active: brushShape === 'square' }]"
              >
                사각형
              </button>
            </div>
          </div>
        </div>

        <!-- Color Layers -->
        <div class="control-group">
          <h4>색상 레이어</h4>
          <div class="layer-list">
            <div class="layer-item" :class="{ active: activeColorLayer === '#ff0000' }">
              <button @click="setActiveColorLayer('#ff0000')" class="layer-select-button" style="background-color: #ff0000;">빨간색</button>
              <button @click="toggleLayerVisibility('#ff0000')" class="layer-visibility-button visible">보임</button>
              <span class="layer-count">0개</span>
            </div>
            <div class="layer-item" :class="{ active: activeColorLayer === '#00ff00' }">
              <button @click="setActiveColorLayer('#00ff00')" class="layer-select-button" style="background-color: #00ff00;">초록색</button>
              <button @click="toggleLayerVisibility('#00ff00')" class="layer-visibility-button visible">보임</button>
              <span class="layer-count">0개</span>
            </div>
            <div class="layer-item" :class="{ active: activeColorLayer === '#0000ff' }">
              <button @click="setActiveColorLayer('#0000ff')" class="layer-select-button" style="background-color: #0000ff;">파란색</button>
              <button @click="toggleLayerVisibility('#0000ff')" class="layer-visibility-button visible">보임</button>
              <span class="layer-count">0개</span>
            </div>
            <div class="layer-item" :class="{ active: activeColorLayer === '#ffff00' }">
              <button @click="setActiveColorLayer('#ffff00')" class="layer-select-button" style="background-color: #ffff00;">노란색</button>
              <button @click="toggleLayerVisibility('#ffff00')" class="layer-visibility-button visible">보임</button>
              <span class="layer-count">0개</span>
            </div>
            <div class="layer-item" :class="{ active: activeColorLayer === '#ff00ff' }">
              <button @click="setActiveColorLayer('#ff00ff')" class="layer-select-button" style="background-color: #ff00ff;">자주색</button>
              <button @click="toggleLayerVisibility('#ff00ff')" class="layer-visibility-button visible">보임</button>
              <span class="layer-count">0개</span>
            </div>
          </div>
          <div class="active-layer-info">
            활성 레이어: {{ getColorName(activeColorLayer) }} ({{ activeLayerCount }}개 선택됨)
          </div>
        </div>

        <!-- Selection Info -->
        <div class="control-group">
          <h4>선택 정보</h4>
          <div class="selection-stats">
            전체 선택된 격자: {{ totalSelectedCount }}개
          </div>
        </div>

        <!-- Resolution Control -->
        <div class="control-group">
          <h4>해상도 설정</h4>
          <div class="control-item">
            <label>격자 해상도: {{ resolution }}</label>
            <input type="range" min="3" max="20" v-model.number="resolution" class="slider" />
          </div>
        </div>

        <!-- Export Controls -->
        <div class="control-group">
          <h4>데이터 내보내기</h4>
          <div class="control-buttons">
            <button @click="handleExportToClipboard" class="control-button primary">
              Optimized Export
            </button>
            <button @click="handleExportGridLayers" class="control-button secondary">
              Raw Grid Export
            </button>
            <button @click="handleExportPercentRects" class="control-button secondary">
              Percent Rects Export
            </button>
          </div>
        </div>

        <!-- Preview Control -->
        <div class="control-group">
          <h4>미리보기 제어</h4>
          <div class="control-buttons">
            <button @click="updatePreview" class="control-button primary">
              미리보기 업데이트
            </button>
          </div>
        </div>

        <!-- Data Import -->
        <div class="control-group">
          <h4>데이터 가져오기</h4>
          <textarea 
            v-model="jsonData" 
            class="import-textarea"
            placeholder="JSON 데이터를 붙여넣으세요..."
          />
          <button @click="handleUpdateFromText" class="control-button primary">
            데이터 불러오기
          </button>
        </div>

        <!-- Status -->
        <div class="control-group" v-if="copySuccess">
          <div class="status-message success">
            ✅ 클립보드에 복사되었습니다!
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ modalTitle }}</h3>
          <button @click="closeModal" class="close-button">&times;</button>
        </div>
        <div class="modal-body">
          <pre>{{ modalContent }}</pre>
        </div>
        <div class="modal-actions">
          <button @click="copyModalContent" class="action-button primary">
            클립보드에 복사
          </button>
          <button @click="closeModal" class="action-button secondary">
            닫기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  padding: 1rem;
}

h1, h2 {
  margin: 0 0 1rem 0;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.header-controls {
  display: flex;
  gap: 1rem;
}

.header-button {
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-button:hover {
  background-color: #0056b3;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.app-layout {
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
}

.main-content, .control-panel {
  flex: 1;
  padding: 1rem;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  background-color: #ffffff;
}

.content-section {
  margin-bottom: 1.5rem;
}

.content-section h2 {
  margin-bottom: 1rem;
}

.marker-container {
  width: 100%;
  height: 500px; /* Adjust as needed */
  position: relative;
}

.preview-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.mode-button {
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  border: none;
  background-color: #6c757d;
  color: white;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.mode-button:hover {
  background-color: #5a6268;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.mode-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  color: #666;
}

.preview-container, .placeholder {
  width: 100%; /* Adjust as needed */
  height: 450px; /* Adjust as needed */
  border-radius: 4px;
  position: relative;
}

.preview-container {
  border: 2px solid #007bff;
  background-color: #f8f9fa;
}

.preview-container.has-data {
  border: 2px solid #28a745; /* Green border when data is present */
}

.placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px dashed #ccc;
  color: #888;
  text-align: center;
}

.control-panel h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 0.5rem;
}

.control-group {
  margin-bottom: 1.2rem;
}

.control-group h4 {
  margin-bottom: 0.6rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.control-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.control-item label {
  font-weight: bold;
}

.slider {
  flex-grow: 1;
  -webkit-appearance: none;
  height: 4px;
  background: #e9ecef;
  outline: none;
  border-radius: 2px;
  transition: background 0.15s ease;
}

.slider:hover {
  background: #dee2e6;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #007bff;
  cursor: pointer;
  border-radius: 50%;
  border: 2px solid #ffffff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #007bff;
  cursor: pointer;
  border-radius: 50%;
  border: 2px solid #ffffff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.control-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.control-buttons.vertical {
  flex-direction: column;
  gap: 0.5rem;
}

.control-buttons.horizontal {
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.control-button {
  padding: 0.5rem 1rem;
  border-radius: 3px;
  border: 1px solid #e9ecef;
  cursor: pointer;
  font-weight: 400;
  font-size: 0.85rem;
  transition: all 0.15s ease;
  background-color: #ffffff;
  color: #495057;
}

.control-button:hover {
  background-color: #f8f9fa;
  border-color: #dee2e6;
}

.control-button.primary {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.control-button.primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

.control-button.secondary {
  background-color: #6c757d;
  color: white;
  border-color: #6c757d;
}

.control-button.secondary:hover {
  background-color: #5a6268;
  border-color: #5a6268;
}

.control-button.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.control-button.active:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

.control-button.compact {
  padding: 0.3rem 0.6rem;
  font-size: 0.75rem;
  min-width: auto;
}

.separator {
  color: #dee2e6;
  font-weight: 300;
  margin: 0 0.2rem;
  user-select: none;
}

/* Brush controls horizontal layout */
.brush-controls-horizontal {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.brush-size-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 120px;
}

.brush-size-section label {
  font-size: 0.8rem;
  color: #495057;
  font-weight: 400;
  white-space: nowrap;
}

.brush-shape-section {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.shape-label {
  font-size: 0.8rem;
  color: #495057;
  font-weight: 400;
  margin-right: 0.3rem;
}

.slider.compact {
  min-width: 80px;
  max-width: 120px;
}

/* Layer controls */
.layer-list {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.layer-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem;
  border: 1px solid transparent;
  border-radius: 3px;
  background-color: #ffffff;
}

.layer-item.active {
  border-color: #007bff;
  background-color: #f8f9fa;
}

.layer-select-button {
  flex: 1;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 3px;
  color: white;
  font-weight: 400;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.layer-select-button:hover {
  opacity: 0.9;
}

.layer-visibility-button {
  padding: 0.3rem 0.6rem;
  border: 1px solid #e9ecef;
  border-radius: 3px;
  background-color: white;
  cursor: pointer;
  font-size: 0.75rem;
  color: #495057;
  transition: all 0.15s ease;
}

.layer-visibility-button:hover {
  background-color: #f8f9fa;
}

.layer-visibility-button.visible {
  background-color: #ffffff;
  border-color: #e9ecef;
  color: #495057;
}

.layer-count {
  font-size: 0.7rem;
  color: #6c757d;
  font-weight: 400;
  min-width: 30px;
  text-align: center;
}

.active-layer-info {
  margin-top: 0.6rem;
  padding: 0.4rem;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 3px;
  font-size: 0.8rem;
  font-weight: 400;
  color: #495057;
  text-align: center;
}

.selection-stats {
  padding: 0.4rem;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 3px;
  font-size: 0.8rem;
  font-weight: 400;
  color: #495057;
  text-align: center;
}

.import-textarea {
  width: 100%;
  height: 150px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.85rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.5rem;
  resize: vertical;
  margin-bottom: 1rem;
}

.status-message {
  padding: 0.8rem 1.2rem;
  border-radius: 4px;
  font-weight: bold;
  margin-top: 1rem;
}

.status-message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  border-radius: 8px;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 80%;
  overflow-y: auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #888;
  transition: color 0.2s;
}

.close-button:hover {
  color: #333;
}

.modal-body {
  flex-grow: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.modal-body pre {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  line-height: 1.5;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.action-button {
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.action-button.primary {
  background-color: #007bff;
  color: white;
}

.action-button.primary:hover {
  background-color: #0056b3;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.action-button.secondary {
  background-color: #6c757d;
  color: white;
}

.action-button.secondary:hover {
  background-color: #5a6268;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .app-layout {
    flex-direction: column;
  }
  
  .control-panel {
    order: -1;
  }
  
  .control-buttons {
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .preview-controls {
    flex-wrap: wrap;
  }
  
  .modal-content {
    width: 95%;
    padding: 1rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>
