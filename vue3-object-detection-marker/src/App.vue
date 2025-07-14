<script setup lang="ts">
import { ref } from 'vue';
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
const copySuccessPercent = ref(false);
const testImageIndex = ref(1);
const objectFitMode = ref<'contain' | 'cover'>('contain');
const renderMode = ref<'grid' | 'rect'>('grid');

// --- Methods ---
const handleExportToClipboard = () => {
  if (markerRef.value) {
    const data = markerRef.value.exportOptimizedLayers();
    if (data) {
      const jsonString = JSON.stringify(data, null, 2);
      navigator.clipboard.writeText(jsonString).then(() => {
        copySuccess.value = true;
        setTimeout(() => (copySuccess.value = false), 2000);
        // Also update the text area for convenience
        jsonData.value = jsonString;
      });
    }
  }
};

const handleUpdateFromText = () => {
  if (!jsonData.value) {
    alert('Textarea에 JSON 데이터를 붙여넣어 주세요.');
    return;
  }
  try {
    const parsedData = JSON.parse(jsonData.value);
    // Update preview
    previewData.value = parsedData;
    // Import into marker
    if (markerRef.value) {
      markerRef.value.importOptimizedLayers(parsedData);
    }
  } catch (e) {
    alert('JSON 형식이 올바르지 않습니다.');
    console.error("JSON Parse Error:", e);
  }
};

// Helper Export: Grid Layers (raw)
const handleExportGridLayers = () => {
  if (markerRef.value) {
    const data = markerRef.value.exportGridLayers();
    const jsonString = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      copySuccessPercent.value = true;
      setTimeout(() => (copySuccessPercent.value = false), 2000);
      jsonData.value = jsonString;
    });
  }
};

// Helper Export: Percent Rects
const handleExportPercentRects = () => {
  if (markerRef.value) {
    const data = markerRef.value.getSelectionAsPercentRects();
    const jsonString = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      copySuccessPercent.value = true;
      setTimeout(() => (copySuccessPercent.value = false), 2000);
      jsonData.value = jsonString;
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
</script>

<template>
  <div id="app">
    <h1>Vue 3 Object Detection Marker & Preview</h1>
    
    <div class="main-container">
      <!-- Marker Component -->
      <div class="component-wrapper">
        <h2>Marker (Editable)</h2>
        <ObjectDetectionMarker
          ref="markerRef"
          :image="imageUrl"
          :canvas-width="600"
          :canvas-height="450"
          :resolution="resolution"
          selection-mode="point"
        />
        <div class="actions">
          <button @click="handleExportToClipboard" class="action-button">
            클립보드로 내보내기 (Optimized)
          </button>
          <button @click="handleExportGridLayers" class="action-button">
            그리드 레이어 내보내기 (Raw)
          </button>
          <button @click="handleExportPercentRects" class="action-button">
            Percent Rects 내보내기
          </button>
          <span v-if="copySuccess || copySuccessPercent" class="copy-success">복사 완료!</span>
        </div>
      </div>

      <!-- Data Transfer Area -->
      <div class="component-wrapper data-transfer">
        <h2>Data Transfer</h2>
        <textarea 
          v-model="jsonData" 
          class="json-textarea"
          placeholder="이곳에 JSON 데이터를 붙여넣고 아래 버튼을 누르세요."
        />
        <div class="actions">
           <button @click="handleUpdateFromText" class="action-button">
            불러오기 & 미리보기 업데이트
          </button>
        </div>
      </div>

      <!-- Preview Component -->
      <div class="component-wrapper">
        <h2>Preview (Read-only)</h2>
        <div class="preview-test-controls">
          <button @click="handleChangeTestImage" class="test-button">
            테스트 이미지 변경 ({{ testImageIndex }})
          </button>
          <button @click="handleReloadPreview" class="test-button" :disabled="!previewData">
            미리보기 다시 로드 (스켈레톤 테스트)
          </button>
          <button @click="toggleObjectFitMode" class="test-button fit-mode-button">
            {{ objectFitMode === 'contain' ? 'Contain' : 'Cover' }} 모드 
            <span class="mode-indicator">({{ objectFitMode }})</span>
          </button>
          <button @click="toggleRenderMode" class="test-button render-mode-button">
            {{ renderMode === 'grid' ? 'Grid' : 'Rect' }} 모드 
            <span class="mode-indicator">({{ renderMode }})</span>
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
            <p>"불러오기" 버튼을 클릭하여 미리보기를 생성하세요.</p>
          </div>
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

.main-container {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.component-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fcfcfc;
  width: 640px;
}

.actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.action-button {
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

.action-button:hover {
  background-color: #0056b3;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.copy-success {
  color: #28a745;
  font-weight: bold;
}

.data-transfer {
  justify-content: space-between;
}

.json-textarea {
  width: 100%;
  height: 350px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.85rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.5rem;
  resize: vertical;
}

.preview-container, .placeholder {
  width: 600px;
  height: 450px;
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

.preview-test-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.test-button {
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

.test-button:hover {
  background-color: #5a6268;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.test-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  color: #666;
}

.fit-mode-button {
  background-color: #17a2b8 !important;
  position: relative;
}

.fit-mode-button:hover {
  background-color: #138496 !important;
}

.render-mode-button {
  background-color: #28a745 !important;
}

.render-mode-button:hover {
  background-color: #1e7e34 !important;
}

.mode-indicator {
  font-size: 0.8rem;
  opacity: 0.8;
  font-weight: normal;
}
</style>
