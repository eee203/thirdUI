<!--
  App · 应用外壳（页面入口层）
  职责：常驻元素（导航 / 播放器 / 弹窗 / 页脚）+ 路由视图。
  关键决策：
    · 导航、播放器、弹窗、页脚都放在 router-view 外面 —— 原站也是这样
      （footer 与 player 在 #swup 容器之外，换页时不重建）。
    · 路由切换用 <transition name="cv-page" mode="out-in">，对应原站 swup 的 .transition-fade。
    · 入场观察器（reveal）与平滑滚动在 mounted 时建立、unmount 时销毁，
      换页后由 watch(route) 重新建立一次 —— 新页面里的 [data-reveal] 才有观察者。
-->
<template>
  <div class="cv-app">
    <SiteNav />

    <RouterView v-slot="{ Component }">
      <Transition name="cv-page" mode="out-in" @after-enter="setupPage">
        <component :is="Component" :key="$route.path" />
      </Transition>
    </RouterView>

    <SiteFooter @credits="creditsOpen = true" />
    <AudioPlayer />
    <CreditsModal v-model="creditsOpen" />
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { RouterView } from 'vue-router';
import SiteNav from '@/components/SiteNav.vue';
import SiteFooter from '@/components/SiteFooter.vue';
import AudioPlayer from '@/components/AudioPlayer.vue';
import CreditsModal from '@/components/CreditsModal.vue';
import { createReveal } from '@/utils/reveal';
import { createSmoothScroll } from '@/utils/smooth-scroll';

const creditsOpen = ref(false);

let reveal = null;
let smooth = null;

/* 换页后重新建立观察器与滚动实例：新页面里的 [data-reveal] 才有人观察。
   用 Transition 的 after-enter 而不是 watch(route) —— mode="out-in" 下
   watch 触发时新 DOM 还没挂载，量到的 [data-speed] 会是空的。 */
function setupPage() {
  if (reveal) reveal.destroy();
  if (smooth) smooth.destroy();
  reveal = createReveal();
  smooth = createSmoothScroll({
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  });
}

onMounted(() => {
  setupPage();
});

onBeforeUnmount(() => {
  if (reveal) reveal.destroy();
  if (smooth) smooth.destroy();
});
</script>

<style>
.cv-app {
  position: relative;
  min-height: 100vh;
}
</style>
