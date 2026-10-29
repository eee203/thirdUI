<!--
  SiteNav · 顶部导航（组件层）
  职责：只在非首页显示。
  关键决策：EFF-13 的机制是"滑出视口"而不是 display:none ——
  原站 nav.hidden 用 transform: translateY(-70px) + 0.6s
  cubic-bezier(0.16,1,0.3,1)，所以离开首页时导航是"滑下去"的，不是突然出现。
-->
<template>
  <nav class="cv-nav" :class="{ 'is-hidden': isHome }">
    <RouterLink to="/" class="cv-nav__logo" aria-label="回到首页">
      <span class="cv-nav__title">COVEO</span>
    </RouterLink>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute();
const isHome = computed(() => route.path === '/');
</script>

<style>
.cv-nav {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 2em;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.cv-nav.is-hidden {
  transform: translateY(-70px);
}

.cv-nav__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.06);
}

.cv-nav__title {
  font-size: 0.62em;
  font-weight: 600;
  letter-spacing: 0.06em;
}
</style>
