<!--
  AudioPlayer · 底部播放器（组件层）
  职责：显示当前"预览"的曲目、旋转黑胶、假计时进度、播放/暂停。
  关键决策：
    · **没有真实音频**（SPEC §1.2 第 3 条）：进度由 utils/player.js 的假计时推进，
      唱片靠 animation-play-state 切换。机制与真播放器一致，只是不出声。
    · 黑胶 1.8s/圈 = 33⅓ rpm，与原站黑胶转速同量级。
    · 背景色用 `linear-gradient(白 86%) , var(--cv-player-bg)` 叠色，
      因为 data-colour 可能是 hex / rgba / linear-gradient 三种形态，
      直接 background-color 会在渐变值上失效（SPEC §8 第 7 条）。
-->
<template>
  <div
    class="cv-player"
    :class="{ 'is-visible': state.visible, 'is-playing': state.playing }"
    :style="{ '--cv-player-bg': state.colour }"
    role="region"
    aria-label="音频预览"
  >
    <div class="cv-player__inner">
      <div class="cv-player__info">
        <p class="cv-uppercase cv-muted cv-player__eyebrow">Previewing</p>
        <p class="cv-uppercase cv-player__title">{{ state.title }}</p>
      </div>

      <button
        type="button"
        class="cv-record"
        :aria-label="state.playing ? '暂停' : '播放'"
        @click="togglePlay"
      >
        <img v-if="state.artwork" :src="state.artwork" alt="" class="cv-record__art" />
        <span class="cv-record__hole" aria-hidden="true"></span>
      </button>

      <div class="cv-player__controls">
        <p class="cv-mono cv-muted cv-player__time">
          <span>{{ formatTime(state.elapsed) }}</span> /
          <span>{{ formatTime(state.duration) }}</span>
        </p>

        <button
          type="button"
          class="cv-player__toggle"
          :aria-label="state.playing ? '暂停' : '播放'"
          @click="togglePlay"
        >
          <span v-if="state.playing" class="cv-bars">
            <i v-for="n in 4" :key="n"></i>
          </span>
          <svg v-else width="10" height="11" viewBox="0 0 10 11" aria-hidden="true">
            <path d="M0 0 L10 5.5 L0 11 Z" fill="currentColor" />
          </svg>
        </button>

        <button type="button" class="cv-player__close" aria-label="关闭播放器" @click="closePlayer">
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
            <path d="M1 1 L9 9 M9 1 L1 9" stroke="currentColor" stroke-width="1.4" fill="none" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { closePlayer, formatTime, togglePlay, usePlayer } from '@/utils/player';

const { state } = usePlayer();
</script>

<style>
.cv-player {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: var(--cv-z-player);
  width: 100%;
  padding: 1em;
  transform: translateY(115%);
  opacity: 0;
  pointer-events: none;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
}

.cv-player.is-visible {
  transform: translateY(0);
  opacity: 1;
  pointer-events: auto;
}

.cv-player__inner {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 2em;
  max-width: 1180px;
  margin: 0 auto;
  padding: 0.8em 1.4em;
  border-radius: var(--cv-radius-modal);
  background-image: linear-gradient(rgba(255, 255, 255, 0.87), rgba(255, 255, 255, 0.87)),
    var(--cv-player-bg, #dddddd);
  box-shadow: 0 0 0 1px var(--cv-border-muted), 0 18px 50px -18px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

.cv-player__info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2em;
  min-width: 0;
}

.cv-player__eyebrow {
  margin: 0;
  font-size: 0.8em;
  font-weight: 600;
}

.cv-player__title {
  margin: 0;
  font-size: 1em;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

/* ---------- 黑胶 ---------- */
.cv-record {
  position: relative;
  display: grid;
  place-items: center;
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: repeating-radial-gradient(circle, #111 0 1px, #1d1d1d 1px 3px);
  box-shadow: 0 6px 18px -6px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.06);
  animation: cv-vinyl 1.8s linear infinite;
  animation-play-state: paused;
}

.cv-player.is-playing .cv-record {
  animation-play-state: running;
}

@keyframes cv-vinyl {
  to {
    transform: rotate(360deg);
  }
}

.cv-record__art {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.cv-record__hole {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.4);
}

/* ---------- 控制区 ---------- */
.cv-player__controls {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1.2em;
}

.cv-player__time {
  margin: 0;
  font-size: 0.8em;
}

.cv-player__toggle {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.08);
  transition: background 0.3s ease;
}

.cv-player__toggle:hover {
  background: rgba(0, 0, 0, 0.16);
}

.cv-bars {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 12px;
}

.cv-bars i {
  display: block;
  width: 2px;
  height: 30%;
  border-radius: 1px;
  background: currentColor;
  animation: cv-bar 900ms ease-in-out infinite alternate;
}

.cv-bars i:nth-child(1) {
  animation-delay: 0ms;
}
.cv-bars i:nth-child(2) {
  animation-delay: 160ms;
}
.cv-bars i:nth-child(3) {
  animation-delay: 320ms;
}
.cv-bars i:nth-child(4) {
  animation-delay: 90ms;
}

@keyframes cv-bar {
  from {
    height: 20%;
  }
  to {
    height: 100%;
  }
}

.cv-player__close {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  color: var(--cv-ink-muted);
  transition: background 0.3s ease;
}

.cv-player__close:hover {
  background: rgba(0, 0, 0, 0.08);
}

@media screen and (max-width: 768px) {
  .cv-player {
    padding: 0.5em;
  }

  .cv-player__inner {
    grid-template-columns: 1fr auto;
    grid-template-areas:
      'info record'
      'controls controls';
    gap: 0.6em 1em;
    padding: 0.7em 1em;
  }

  .cv-player__info {
    grid-area: info;
  }

  .cv-record {
    grid-area: record;
    width: 52px;
    height: 52px;
  }

  .cv-record__art {
    width: 28px;
    height: 28px;
  }

  .cv-player__controls {
    grid-area: controls;
    justify-content: space-between;
  }

  .cv-player__time {
    font-size: 0.75em;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cv-record {
    animation: none;
  }
  .cv-bars i {
    animation: none;
    height: 60%;
  }
}
</style>
