import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

/**
 * 配置层 —— 构建配置
 *
 * 关键决策：
 *   1. 三个入口：主应用 index.html + 两个独立组件的 demo.html。
 *      这样 packages/ 下的组件可以"脱离页面单独运行"，满足 REF-A 第 4 条。
 *   2. manualChunks 把 vendor 拆开，主 chunk 只留业务代码。
 *   3. 扩展说明（本轮不实现）：若将来要转 MPA，只需往 rollupOptions.input 追加页面入口，
 *      其余配置无需改动 —— 这是 PROJECT.md 里"MPA 仅预留"的唯一落点。
 */
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        ringDemo: fileURLToPath(
          new URL('./packages/ring-gallery/demo.html', import.meta.url)
        ),
        trailDemo: fileURLToPath(
          new URL('./packages/cursor-trail/demo.html', import.meta.url)
        ),
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('lenis')) return 'vendor-lenis';
            return 'vendor';
          }
          return undefined;
        },
      },
    },
  },
});
