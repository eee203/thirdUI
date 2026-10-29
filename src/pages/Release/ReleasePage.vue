<!--
  ReleasePage · 内页空壳（页面层）
  职责：证明 EFF-13（首页隐藏导航 / 内页显示）与 EFF-14（路由淡入）成立。
  关键决策：**不做内页真实内容**（SPEC §1.2 第 4 条）。
          只复刻内页顶部那张"封面 + 标题 + 三列元数据"的版式骨架，
          用来让路由跳转看起来不是空白，其余内容明写"本轮不在范围"。
-->
<template>
  <div class="cv-release-page">
    <div class="cv-release-page__header">
      <div class="cv-release-page__artwork cv-anim cv-anim--fade-up animated">
        <img :src="item.cover" :alt="item.title" />
      </div>
      <p class="cv-release-page__title-text cv-uppercase">{{ item.title }}</p>
      <div class="cv-release-page__data">
        <div class="cv-release-page__data-item">
          <p class="cv-uppercase cv-muted">Released</p>
          <p class="cv-mono">{{ item.dateLabel }}</p>
        </div>
        <div class="cv-release-page__data-item">
          <p class="cv-uppercase cv-muted">Format</p>
          <p class="cv-mono">{{ item.tracksLabel }}</p>
        </div>
        <div class="cv-release-page__data-item">
          <p class="cv-uppercase cv-muted">Runtime</p>
          <p class="cv-mono">{{ item.durationLabel }}</p>
        </div>
      </div>
    </div>

    <div class="cv-release-page__note">
      <p class="cv-uppercase cv-muted">Tracklist &amp; lyrics</p>
      <p class="cv-release-page__note-body">
        Out of scope for this round. SPEC §1.2 第 4 条：本轮只做首页，内页仅保留路由与版式骨架，
        用于验证导航显隐与路由过渡两个机制。
      </p>
      <RouterLink to="/" class="cv-btn cv-release-page__back">&larr; Back to index</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { releases } from '@/config/releases';

const route = useRoute();

// 路径里的 id 不在数据里时，退回最新一张，避免空页面
const item = computed(
  () => releases.find((r) => r.id === route.params.id) || releases[releases.length - 1]
);
</script>

<style>
.cv-release-page {
  min-height: 100vh;
  padding: 6em 2em 4em;
  max-width: 1180px;
  margin: 0 auto;
}

.cv-release-page__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
  max-width: 90%;
  margin: 3em auto 8em;
  text-align: center;
}

.cv-release-page__artwork img {
  width: 100px;
  height: 100px;
  border-radius: var(--cv-radius-card);
  object-fit: cover;
  transform: rotate(-5deg);
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.15), 0 10px 30px -10px rgba(0, 0, 0, 0.1);
}

.cv-release-page__title-text {
  font-size: var(--cv-fs-title);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.02em;
  margin: 0;
}

.cv-release-page__data {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 4em;
  width: 80%;
  padding: 0 2em;
  margin: 0 auto;
}

.cv-release-page__data-item {
  display: flex;
  flex-direction: column;
  gap: 0.2em;
}

.cv-release-page__data-item:first-of-type {
  align-items: flex-start;
}

.cv-release-page__data-item:last-of-type {
  align-items: flex-end;
}

.cv-release-page__data-item p {
  margin: 0;
  font-size: 0.85em;
}

.cv-release-page__note {
  max-width: 366px;
  margin: 0 auto;
  text-align: center;
}

.cv-release-page__note-body {
  color: var(--cv-ink-muted);
  line-height: 2em;
  margin: 1.5em 0 2em;
}

.cv-release-page__back {
  display: inline-block;
  font-size: 0.85em;
  text-transform: uppercase;
  color: var(--cv-ink-muted);
}

.cv-release-page__back:hover {
  color: var(--cv-ink);
}

@media screen and (max-width: 768px) {
  .cv-release-page {
    padding: 5em 1.5em 3em;
  }

  .cv-release-page__data {
    display: flex;
    flex-direction: column;
    gap: 1.2em;
    width: 100%;
    padding: 0;
  }

  .cv-release-page__data-item,
  .cv-release-page__data-item:first-of-type,
  .cv-release-page__data-item:last-of-type {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
