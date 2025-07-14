import type { App } from 'vue';
import ObjectDetectionMarker from './components/ObjectDetectionMarker.vue';
import ObjectDetectionPreview from './components/ObjectDetectionPreview.vue';

// Named exports
export { ObjectDetectionMarker, ObjectDetectionPreview };

// Type exports
export * from './types';

// Utility exports
export * from './utils';

// Default export as Vue plugin
export default {
  install(app: App) {
    app.component('ObjectDetectionMarker', ObjectDetectionMarker);
    app.component('ObjectDetectionPreview', ObjectDetectionPreview);
  },
}; 