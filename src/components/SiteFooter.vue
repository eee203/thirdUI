<!--
  SiteFooter · 页脚（组件层）
  职责：版权行 + Credits 按钮 + 说明链接。
  关键决策：原站页脚的 "Press Kit / Licensing Inquires" 指向真实业务渠道，
          这里全部换成项目内说明，避免误触到别人的业务入口（REF-B 第 5 条）。
-->
<template>
  <footer class="cv-footer">
    <div class="cv-footer__inner">
      <div class="cv-footer__copyright">
        <p class="cv-footer__line">
          2014&ndash;{{ year }} &mdash; a study build, not the original
        </p>
        <p class="cv-muted cv-footer__note">No rights claimed over the reference site</p>
      </div>

      <div class="cv-footer__links">
        <button type="button" class="cv-footer__btn" @click="$emit('credits')">Credits</button>
        <span class="cv-footer__sep" aria-hidden="true">/</span>
        <span class="cv-footer__btn is-static">Local only</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
defineEmits(['credits']);

const year = new Date().getFullYear();
</script>

<style>
.cv-footer {
  margin: 2em;
}

.cv-footer__inner {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 2em;
  padding: 2em 0 1em;
  border-top: 1px dotted var(--cv-border-muted);
}

.cv-footer__line {
  margin: 0;
  font-size: 0.85em;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.cv-footer__note {
  margin: 0.3em 0 0;
  font-size: 0.8em;
}

.cv-footer__links {
  display: flex;
  align-items: center;
  gap: 0.8em;
  font-size: 0.8em;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.cv-footer__sep {
  opacity: 0.4;
}

.cv-footer__btn {
  color: var(--cv-ink-muted);
  transition: color 0.3s ease;
}

.cv-footer__btn:hover {
  color: var(--cv-ink);
}

.cv-footer__btn.is-static {
  cursor: default;
}

@media screen and (max-width: 768px) {
  .cv-footer__inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 1em;
  }
}
</style>
