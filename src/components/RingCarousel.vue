<!--
  RingCarousel · 环形唱片墙（组件层）
  职责：渲染 22 项封面并挂载 packages/ring-gallery 的行为逻辑。
  关键决策：
    · 组件只负责"渲染 + 事件上报"，环形的数学与涟漪全部交给 packages/ring-gallery，
      保证该机制能脱离 Vue 单独复用（REF-A 第 4 条 / REQ-18）。
    · 不在这里写任何 transform 内联样式，位置一律由 CSS 变量驱动（见包内注释）。
-->
<template>
  <div ref="ringEl" class="cv-ring">
    <button
      v-for="item in items"
      :key="item.ringKey"
      class="cv-ring__item"
      :class="{
        'is-playing': playingId === item.id,
        'is-new': featuredIds.has(item.id),
      }"
      :data-ring-index="item.ringIndex"
      :aria-label="`预览 ${item.title}`"
      type="button"
      @click="$emit('pick', item)"
    >
      <img :src="item.cover" :alt="item.title" draggable="false" />
    </button>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { createRingGallery } from '../../packages/ring-gallery/index.js';
import '../../packages/ring-gallery/style.css';
import { RING } from '@/config/constants';
import { isFeatured } from '@/utils/demo-mode';

const props = defineProps({
  items: { type: Array, required: true },
  playingId: { type: String, default: '' },
});

defineEmits(['pick']);

const ringEl = ref(null);
let gallery = null;

const featuredIds = computed(() => {
  const set = new Set();
  props.items.forEach((it) => {
    if (isFeatured(it)) set.add(it.id);
  });
  return set;
});

onMounted(() => {
  gallery = createRingGallery({
    root: ringEl.value,
    items: Array.from(ringEl.value.querySelectorAll('.cv-ring__item')),
    config: {
      diameterVh: RING.diameterVh,
      artworkBase: RING.artworkBase,
      spinSeconds: RING.spinSeconds,
      spinOffsetDeg: RING.spinOffsetDeg,
      hoverAmp: RING.hoverAmp,
      hoverFalloff: RING.hoverFalloff,
      hoverDelayMs: RING.hoverDelayMs,
      hoverOpacityFloor: RING.hoverOpacityFloor,
      enterDurationMs: RING.enterDurationMs,
      enterStaggerMs: RING.enterStaggerMs,
      enterDepthPx: RING.enterDepthPx,
    },
  });
  gallery.reveal();

  // 验收探针挂钩（README「已验证项」里的脚本靠它读状态）
  window.__ring = gallery;
});

onBeforeUnmount(() => {
  if (gallery) gallery.destroy();
  gallery = null;
});
</script>
