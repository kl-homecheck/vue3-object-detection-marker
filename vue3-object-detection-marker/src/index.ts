import type { App } from 'vue';
import ObjectDetectionMarker from './components/ObjectDetectionMarker.vue';

// Named exports
export { ObjectDetectionMarker };

// Type exports
export * from './types';

// Utility exports
export * from './utils';

// Default export as Vue plugin
export default {
  install(app: App) {
    app.component('ObjectDetectionMarker', ObjectDetectionMarker);
  },
}; 