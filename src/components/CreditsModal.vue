<!--
  CreditsModal · 版权弹窗（组件层）
  职责：显示本项目的来源说明与限制。
  关键决策：弹窗里的外链全部指向"本项目的学习对象"和许可证说明，不放原站的业务链接；
           ESC 可关，点遮罩可关，打开时锁 body 滚动。
-->
<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="cv-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cv-modal-title"
      @click.self="close"
      @keydown.esc="close"
    >
      <div class="cv-modal__panel">
        <div class="cv-modal__head">
          <h2 id="cv-modal-title" class="cv-modal__title">Credits</h2>
          <button type="button" class="cv-btn--square" aria-label="关闭" @click="close">
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
              <path d="M1 1 L9 9 M9 1 L1 9" stroke="currentColor" stroke-width="1.4" fill="none" />
            </svg>
          </button>
        </div>

        <div class="cv-modal__body">
          <p>
            This is a <strong>local study build</strong>. The interaction model was measured from
            <a href="https://coveomusic.com/" target="_blank" rel="noopener noreferrer">coveomusic.com</a>
            and rebuilt from scratch for front-end learning.
          </p>
          <p>
            No photographs, audio, typefaces, logo, or long-form copy were taken from the reference
            site. All media here comes from
            <a href="https://picsum.photos/" target="_blank" rel="noopener noreferrer">Lorem Picsum</a>
            (Unsplash License) or from assets already present in this project.
          </p>
          <hr />
          <p class="cv-muted">
            Not for deployment, redistribution, or commercial use. See
            <code>CLONE_LEARN_MANUAL.md</code> for the full compliance assessment.
          </p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { onBeforeUnmount, watch } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
});
const emit = defineEmits(['update:modelValue']);

function close() {
  emit('update:modelValue', false);
}

function onKeydown(e) {
  if (e.key === 'Escape') close();
}

watch(
  () => props.modelValue,
  (open) => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) document.addEventListener('keydown', onKeydown);
    else document.removeEventListener('keydown', onKeydown);
  }
);

onBeforeUnmount(() => {
  document.body.style.overflow = '';
  document.removeEventListener('keydown', onKeydown);
});
</script>

<style>
.cv-modal {
  position: fixed;
  inset: 0;
  z-index: var(--cv-z-modal);
  display: grid;
  place-items: center;
  padding: 2em;
  background: rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(2px);
}

.cv-modal__panel {
  width: 100%;
  max-width: 420px;
  border-radius: var(--cv-radius-modal);
  background-color: rgba(255, 255, 255, 0.88);
  box-shadow: 0 0 0 1px var(--cv-border-muted), 0 30px 70px -30px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  overflow: hidden;
}

.cv-modal__head {
  display: grid;
  grid-template-columns: 30px 1fr 30px;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid var(--cv-border-muted);
}

.cv-modal__title {
  margin: 0;
  text-align: center;
  font-size: 1em;
  font-weight: 600;
  text-transform: uppercase;
}

.cv-modal__head .cv-btn--square {
  justify-self: flex-end;
}

.cv-modal__body {
  padding: 1em 2em 1.4em;
}

.cv-modal__body p {
  margin: 1em 0;
  color: var(--cv-ink-muted);
  line-height: 1.8;
}

.cv-modal__body strong {
  color: var(--cv-ink);
}

.cv-modal__body a {
  color: var(--cv-ink);
  border-bottom: 1px solid var(--cv-border);
}

.cv-modal__body hr {
  border: 0;
  border-top: 1px solid var(--cv-border-muted);
  margin: 1.4em 0;
}

.cv-modal__body code {
  font-family: var(--cv-font-mono);
  font-size: 0.9em;
}
</style>
