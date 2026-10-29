<!--
  DiscographyHeader · 拖尾画廊区（组件层）
  职责：大标题 + 鼠标/滚动拖尾画廊。
  关键决策：
    · 拖尾逻辑在 packages/cursor-trail（纯逻辑、零框架依赖），本组件只管挂载与销毁。
    · 30 张图用 import.meta.glob eager 引入 —— 全部进打包产物并带 hash，
      运行时零外网请求（REF-C 第 3 条）。
    · 容器必须 position:relative + overflow:hidden（见 .cv-trail），否则小图会溢到上下区块。
-->
<template>
  <section ref="containerEl" class="cv-disc-header cv-section cv-trail">
    <div class="cv-wrapper cv-wrapper--l">
      <h3 class="cv-anim cv-anim--fade-in" data-reveal style="--cv-anim-delay: 0.2s">
        Discography <span>The complete works</span>
      </h3>
    </div>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { createCursorTrail } from '../../packages/cursor-trail/index.js';
import '../../packages/cursor-trail/style.css';
import { TRAIL } from '@/config/constants';

const containerEl = ref(null);
let trail = null;

const modules = import.meta.glob('../assets/gallery/*.jpg', { eager: true, import: 'default' });
const galleryImages = Object.keys(modules)
  .sort()
  .map((k) => modules[k]);

onMounted(() => {
  trail = createCursorTrail({
    container: containerEl.value,
    images: galleryImages,
    config: { ...TRAIL },
  });
  // 验收探针：读 count() 判定"不泄漏"（REQ-12）
  window.__trail = trail;
});

onBeforeUnmount(() => {
  if (trail) trail.destroy();
  trail = null;
});
</script>

<style>
.cv-disc-header {
  position: relative;
  width: 100%;
  height: auto;
  padding: 18em 0 18em;
  margin: 12em 0;
}

.cv-disc-header .cv-wrapper {
  z-index: 2;
  pointer-events: none;
}

.cv-disc-header h3 {
  position: relative;
  z-index: 2;
}

/* 标题背后一块径向渐变 + 模糊，让小图经过时"沉"到标题后面 */
.cv-disc-header .cv-wrapper::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 400px;
  transform: translateY(-50%);
  filter: blur(20px);
  background-image: radial-gradient(
    100% 50% at 50% 50%,
    var(--cv-cream) 40%,
    rgba(238, 238, 238, 0) 100%
  );
}

@media screen and (max-width: 768px) {
  .cv-disc-header {
    padding: 10em 0 10em;
    margin: 8em 0;
  }
}
</style>
