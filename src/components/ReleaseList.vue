<!--
  ReleaseList · 唱片列表（组件层）
  职责：11 条唱片，逐条入场，hover 整行轻微放大 + 淡背景，右侧 Preview 拉起播放器。
  关键决策：
    · 行内布局严格照原站：flex + gap 2em，封面 72px 圆角 12px，
      `.release__title__details` 撑满剩余宽度并做 space-between（标题左、元数据右）。
    · hover 用原站的两段式：整行 scale(1.01) 配 cubic-bezier(0.34,1.56,0.64,1)，
      同时 ::after 的 rgba(0,0,0,.05) 底从 scale(0.98) 涨到 1。
-->
<template>
  <section class="cv-discography cv-section">
    <div class="cv-wrapper cv-wrapper--l">
      <h2 class="cv-anim cv-anim--blur-in" data-reveal style="--cv-anim-delay: 0.2s">
        all releases &mdash; ordered by newest first
      </h2>

      <ul class="cv-releases">
        <li v-for="(item, i) in items" :key="item.id" class="cv-release">
          <div
            class="cv-release__container cv-anim cv-anim--fade-in"
            data-reveal
            :style="{ '--cv-anim-delay': `${(i * 0.01).toFixed(2)}s` }"
          >
            <RouterLink :to="`/${item.id}`" class="cv-release__link">
              <div class="cv-release__info">
                <p class="cv-mono cv-muted cv-release__index">{{ item.index }}</p>

                <div class="cv-release__art">
                  <img :src="item.cover" :alt="item.title" loading="lazy" />
                </div>

                <div class="cv-release__title-details">
                  <p class="cv-release__title cv-uppercase">{{ item.title }}</p>
                  <div class="cv-release__details">
                    <p class="cv-uppercase cv-muted">{{ item.dateLabel }}</p>
                    <p class="cv-uppercase cv-muted">{{ item.tracksLabel }}</p>
                    <p class="cv-uppercase cv-muted">{{ item.durationLabel }}</p>
                  </div>
                </div>
              </div>
            </RouterLink>

            <div class="cv-release__ctas">
              <button
                type="button"
                class="cv-btn cv-btn--blurred cv-release__preview cv-mono"
                @click="$emit('preview', item)"
              >
                <svg width="10" height="11" viewBox="0 0 10 11" aria-hidden="true">
                  <path d="M0 0 L10 5.5 L0 11 Z" fill="currentColor" />
                </svg>
                Preview
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { discography } from '@/config/releases';

defineProps({
  items: { type: Array, default: () => discography },
});
defineEmits(['preview']);
</script>

<style>
.cv-releases {
  width: 100%;
  margin-top: 4em;
}

.cv-release {
  position: relative;
  z-index: 2;
  padding: 0 1em;
  border-bottom: 1px dotted var(--cv-border-muted);
  transform: scale(1);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.2s ease;
}

.cv-release:first-of-type {
  border-top: 1px dotted var(--cv-border-muted);
}

/* hover 底色：从 0.98 涨到 1，配合整行 scale(1.01)，手感是"被托起来" */
.cv-release::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.05);
  opacity: 0;
  transform: scale(0.98);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
  pointer-events: none;
}

.cv-release:hover {
  transform: scale(1.01);
  border-color: transparent;
}

.cv-release:hover::after {
  opacity: 1;
  transform: scale(1);
}

.cv-release__container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 2em;
  width: 100%;
}

.cv-release__link {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1em 0;
}

.cv-release__info {
  display: flex;
  align-items: center;
  gap: 2em;
  width: 100%;
  font-weight: 600;
}

.cv-release__index {
  font-weight: 400;
  font-size: 0.85em;
  margin: 0;
}

.cv-release__art img {
  width: 72px;
  height: 72px;
  border-radius: var(--cv-radius-card);
  object-fit: cover;
}

.cv-release__title-details {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.cv-release__title {
  margin: 0;
  font-size: 1em;
  font-weight: 600;
  text-align: left;
}

.cv-release__details {
  display: flex;
  gap: 2em;
  font-size: 0.85em;
  font-weight: 500;
}

.cv-release__details p {
  margin: 0;
  white-space: nowrap;
}

.cv-release__ctas {
  position: relative;
  z-index: 2;
}

.cv-release__preview {
  gap: 0.8em;
  padding: 0.5em 0.9em;
  border-radius: var(--cv-radius-btn);
  font-size: 0.85em;
  text-transform: uppercase;
  background: rgba(0, 0, 0, 0.06);
  transition: background 0.4s ease;
}

.cv-release__preview:hover {
  background: rgba(0, 0, 0, 0.14);
}

@media screen and (max-width: 768px) {
  .cv-release {
    padding: 0;
  }

  .cv-release__container {
    gap: 1em;
  }

  .cv-release__index {
    display: none;
  }

  .cv-release__info {
    gap: 1em;
  }

  .cv-release__art img {
    width: 48px;
    height: 48px;
    border-radius: 8px;
  }

  .cv-release__title-details {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 0.5em;
  }

  .cv-release__details p:nth-of-type(2),
  .cv-release__details p:nth-of-type(3) {
    display: none;
  }

  .cv-release__preview svg {
    display: none;
  }
}
</style>
