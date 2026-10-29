<!--
  HeroSection · 首屏（组件层）
  职责：环形唱片墙 + 手绘装饰线 + 新专 banner + 中央字标 + 底部渐变遮罩。

  关键决策：
    · heroScript（手绘线）本轮**只做静态装饰**，不做描边动画（EFF-04 已砍，SPEC §8 第 1 条）。
      它存在的唯一作用是当 EFF-06 的作用对象 —— hover banner 时它要变淡变模糊。
    · banner 常显（内容取最新一张）。这是**已声明的偏离**：
      原站用"4 个月内发行"规则控制 banner 显隐，而当前最新专已超期，
      照搬会导致 EFF-06 失去作用对象、机制不可验证。见 README「已知偏离」。
    · 视差只写 --cv-parallax-y 变量，transform 由 CSS 组合，避免覆盖居中/旋转。
-->
<template>
  <section class="cv-hero">
    <!-- 手绘装饰线：静态，仅作为 hover 退让的模糊对象 -->
    <div class="cv-hero__script" data-speed="0.02" aria-hidden="true">
      <svg viewBox="0 0 1560 300" preserveAspectRatio="xMidYMid meet" role="presentation">
        <path
          d="M 40.0 215.0 C 62.0 118.4 88.0 77.0 100.0 123.9 C 110.0 187.4 74.0 217.8 64.0 168.1
             C 54.0 123.9 96.0 198.4 132.0 215.0 C 202.0 194.1 166.0 225.7 156.0 173.9
             C 146.0 127.9 188.0 205.6 231.5 222.8 C 301.5 202.5 265.5 227.0 255.5 186.9
             C 245.5 151.2 287.5 211.4 313.5 224.7 C 383.5 200.5 347.5 221.2 337.5 187.3
             C 327.5 157.3 369.5 208.0 411.3 219.3 C 481.3 180.4 445.3 213.6 435.3 159.3
             C 425.3 111.0 467.3 192.5 505.5 210.6 C 575.5 177.5 539.5 208.0 529.5 158.0
             C 519.5 113.6 561.5 188.6 588.8 205.2 C 658.8 187.3 622.8 209.3 612.8 173.3
             C 602.8 141.4 644.8 195.3 690.2 207.3 C 760.2 194.8 724.2 217.2 714.2 180.5
             C 704.2 147.9 746.2 202.9 778.4 215.2 C 848.4 190.9 812.4 226.1 802.4 168.4
             C 792.4 117.1 834.4 203.7 866.0 222.9 C 936.0 199.0 900.0 227.3 890.0 181.1
             C 880.0 140.0 922.0 209.3 967.7 224.7 C 1037.7 200.5 1001.7 221.0 991.7 187.5
             C 981.7 157.7 1023.7 208.0 1051.2 219.1 C 1121.2 187.6 1085.2 212.7 1075.2 171.6
             C 1065.2 135.1 1107.2 196.7 1144.9 210.4 C 1214.9 172.4 1178.9 208.5 1168.9 149.4
             C 1158.9 97.0 1200.9 185.5 1243.1 205.2 C 1313.1 184.3 1277.1 209.7 1267.1 168.2
             C 1257.1 131.4 1299.1 193.6 1325.1 207.4 C 1395.1 196.8 1359.1 217.2 1349.1 183.8
             C 1339.1 154.1 1381.1 204.2 1424.2 215.3 C 1494.2 197.6 1458.2 225.6 1448.2 179.7
             C 1438.2 139.0 1480.2 207.8 1516.8 223.0"
          fill="none"
          stroke="#f8f8f8"
          stroke-width="3.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <!-- 新专 banner（EFF-05 的橙点 + EFF-06 的退让触发源） -->
    <RouterLink
      class="cv-btn cv-btn--banner cv-hero__banner"
      :to="`/${latest.id}`"
    >
      <span class="cv-hero__dot" aria-hidden="true"></span>
      <span class="cv-mono">{{ latest.title }} &mdash; Now Available</span>
    </RouterLink>

    <!-- 操作提示语：桌面 / 移动两套文案 -->
    <p class="cv-hero__preview cv-mono cv-muted">
      <span class="cv-hero__preview-desktop">Click to preview song</span>
      <span class="cv-hero__preview-mobile">Tap artwork to preview a song</span>
    </p>

    <!-- 侧边竖排 slogan（自撰文案，非原站原文） -->
    <p
      class="cv-hero__side cv-anim cv-anim--fade-in"
      data-reveal
      style="--cv-anim-delay: 2s"
    >
      For the <span>night-walkers</span>, the <span>quiet makers</span>, the
      <span>second-guessers</span>, and the ones who <span>keep going</span> &mdash; a set of
      instrumentals for the hours when words run out.
    </p>

    <!-- 中央字标 -->
    <div class="cv-hero__intro">
      <div
        class="cv-hero__avatar cv-anim cv-anim--fade-up"
        data-reveal
        style="--cv-anim-duration: 2s; --cv-anim-delay: 0s"
      >
        <img :src="avatar" alt="" />
      </div>
      <div
        class="cv-hero__logo cv-anim cv-anim--fade-up"
        data-reveal
        style="--cv-anim-duration: 2s; --cv-anim-delay: 0.5s"
      >
        <h1 class="cv-hero__title">COVEO</h1>
        <p class="cv-hero__subtitle cv-uppercase">An Audio/Visual Project</p>
      </div>
    </div>

    <!-- 底部渐变：把圆环下半圈藏起来 -->
    <div class="cv-hero__fade" aria-hidden="true"></div>

    <RingCarousel
      :items="ringItems"
      :playing-id="playingId"
      @pick="$emit('pick', $event)"
    />
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import RingCarousel from './RingCarousel.vue';
import { buildRingItems, discography } from '@/config/releases';
import avatar from '@/assets/img/avatar.jpg';

defineProps({
  playingId: { type: String, default: '' },
});
defineEmits(['pick']);

const ringItems = buildRingItems();
const latest = computed(() => discography[0]);
</script>

<style>
/* ---------------- 首屏容器 ---------------- */
.cv-hero {
  position: relative;
  /* 用 100% 而不是 100vw：100vw 含滚动条宽度，会撑出横向溢出 */
  width: 100%;
  height: 100vh;
  min-height: 560px;
  overflow: hidden;
}

/* ---------------- 手绘装饰线 ---------------- */
.cv-hero__script {
  position: absolute;
  top: 4%;
  left: 50%;
  z-index: 0;
  width: 110vw;
  height: auto;
  pointer-events: none;
  /* 视差变量由 JS 写入，这里负责组合；不要改成 JS 直接写 transform */
  transform: translateX(-50%) rotate(-10deg) translate3d(0, var(--cv-parallax-y, 0px), 0);
  transition: opacity 1s ease, filter 0.75s ease, transform 0.4s ease;
}

.cv-hero__script svg {
  display: block;
  width: 100%;
  height: auto;
}

/* EFF-06：banner hover → 手绘线变淡变模糊 */
.cv-hero:has(.cv-hero__banner:hover) .cv-hero__script {
  opacity: 0.8;
  filter: blur(8px);
}

/* ---------------- 新专 banner ---------------- */
.cv-hero__banner {
  position: absolute;
  top: 24px;
  left: 50%;
  z-index: var(--cv-z-content);
  transform: translateX(-50%);
  color: var(--cv-ink);
}

.cv-hero__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--cv-orange);
  animation: cv-hero-dot-pulse 2s linear infinite;
}

@keyframes cv-hero-dot-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.2;
  }
}

/* ---------------- 操作提示 ---------------- */
.cv-hero__preview {
  position: absolute;
  bottom: 4em;
  left: 50%;
  z-index: var(--cv-z-content);
  font-size: 0.9em;
  transform: translateX(-50%);
  white-space: nowrap;
}

.cv-hero__preview-mobile {
  display: none;
}

/* ---------------- 侧边竖排 slogan ---------------- */
/* 原站用的是 `rotate(-90deg) translate(52%, -650%)` 这组魔数，
   它依赖元素自身尺寸，文案长度一变就会跑位。这里改成锚定左下角旋转，
   元素高度定了就稳定，不再随文案长度漂移（属可复现的等价实现）。 */
.cv-hero__side {
  position: absolute;
  bottom: 6em;
  left: 2em;
  z-index: var(--cv-z-content);
  max-width: 400px;
  font-size: 0.8em;
  color: var(--cv-ink-muted);
  transform-origin: 0 100%;
  transform: rotate(-90deg);
}

.cv-hero__side span {
  font-family: var(--cv-font-serif);
  font-size: 1.15em;
  color: var(--cv-ink);
}

/* ---------------- 中央字标 ---------------- */
.cv-hero__intro {
  position: absolute;
  top: 60%;
  left: 50%;
  z-index: var(--cv-z-content);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2em;
  transform: translateX(-50%);
}

.cv-hero__avatar {
  width: 100px;
  height: 100px;
  overflow: hidden;
  border-radius: 100%;
}

.cv-hero__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cv-hero__logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4em;
  text-align: center;
  color: inherit;
}

/* 字号严格照原站 .logo .title / .subtitle（1.2em / 0.8em）—— 小字号的克制是这套版式的关键 */
.cv-hero__title {
  font-size: 1.2em;
  font-weight: 600;
  letter-spacing: 0.02em;
  margin: 0;
}

.cv-hero__subtitle {
  font-size: 0.8em;
  font-weight: 500;
  letter-spacing: 0.06em;
  margin: 0;
}

/* ---------------- 底部渐变遮罩 ---------------- */
.cv-hero__fade {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: var(--cv-z-fade);
  width: 100%;
  height: 20vh;
  pointer-events: none;
  background-image: linear-gradient(rgba(238, 238, 238, 0) 0%, var(--cv-cream) 100%);
}

/* ---------------- 移动端 ---------------- */
@media screen and (max-width: 768px) {
  .cv-hero__side {
    display: none;
  }

  .cv-hero__intro {
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .cv-hero__preview-desktop {
    display: none;
  }

  .cv-hero__preview-mobile {
    display: inline;
  }

  .cv-hero__banner {
    top: 12px;
  }

  .cv-hero__script {
    top: 8%;
  }
}
</style>
