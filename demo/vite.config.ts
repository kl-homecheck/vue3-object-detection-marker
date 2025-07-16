import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig(({ mode }) => {
  if (mode === 'lib') {
    // Library build configuration
    return {
      plugins: [
        vue(),
        dts({
          insertTypesEntry: true,
          entryRoot: './src',
          outDir: './dist',
          include: ['src/index.ts', 'src/types/**/*', 'src/utils/**/*', 'src/components/**/*'],
          exclude: ['src/main.ts', 'src/App.vue'],
        }),
      ],
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'Vue3ObjectDetectionMarker',
          fileName: 'vue3-object-detection-marker',
          formats: ['es', 'umd'],
        },
        rollupOptions: {
          external: ['vue'],
          output: {
            globals: {
              vue: 'Vue',
            },
          },
        },
        outDir: 'dist',
        emptyOutDir: true,
      },
    };
  }

  // Development configuration
  return {
    plugins: [vue()],
    base: process.env.NODE_ENV === 'production' ? '/vue3-object-detection-marker/' : '/',
    server: {
      port: 3000,
    },
  };
});
