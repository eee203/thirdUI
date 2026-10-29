<!--
  Acknowledgements · 收尾区（组件层）
  职责：黑胶堆叠大图 + 手写签名 + 一句 slogan。
  关键决策：签名是自绘 SVG 笔迹，不是原站资产（SPEC §8 第 8 条）。
-->
<template>
  <section class="cv-ack cv-section">
    <div class="cv-wrapper cv-wrapper--l cv-ack__inner">
      <div class="cv-ack__image cv-anim cv-anim--fade-in" data-reveal>
        <img :src="vinyls" alt="" loading="lazy" />
      </div>

      <div class="cv-ack__body">
        <h3 class="cv-uppercase cv-anim cv-anim--blur-in" data-reveal>
          Acknowledgements
        </h3>

        <div
          class="cv-ack__signature cv-anim cv-anim--blur-in"
          data-reveal
          style="--cv-anim-delay: 0.2s"
          aria-hidden="true"
        >
          <svg viewBox="0 0 220 70" role="presentation">
            <path
              d="M12 52 C 26 14 40 8 46 26 C 52 44 40 58 34 46
                 C 30 38 44 30 58 34 C 74 38 70 54 66 50
                 C 62 46 78 30 92 22 C 104 15 108 34 100 42
                 C 92 50 106 52 118 40 C 130 28 126 46 138 44
                 C 150 42 148 26 160 24 C 172 22 168 44 182 42
                 C 194 40 200 30 206 26"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <div class="cv-ack__signature-line"></div>
        </div>

        <p class="cv-uppercase cv-muted cv-anim cv-anim--blur-in" data-reveal style="--cv-anim-delay: 0.4s">
          For the <span>night-walkers</span>, the <span>quiet makers</span>, the
          <span>second-guessers</span>, and the ones who <span>keep going</span>.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import vinyls from '@/assets/img/vinyls.jpg';
</script>

<style>
.cv-ack {
  margin-bottom: 8em;
}

.cv-ack__inner {
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  gap: 24em;
}

.cv-ack__image {
  width: 50%;
}

.cv-ack__image img {
  width: 100%;
  height: auto;
  border-radius: var(--cv-radius-card);
}

.cv-ack__body {
  width: 100%;
  max-width: 250px;
  text-align: center;
}

.cv-ack__signature {
  margin: 2em auto;
  color: var(--cv-ink);
}

.cv-ack__signature svg {
  position: relative;
  width: 100%;
  height: auto;
  transform: translateY(22%) rotate(-4deg);
}

.cv-ack__signature-line {
  width: 80%;
  max-width: 220px;
  height: 1px;
  margin: auto;
  background-color: rgb(212, 212, 212);
}

.cv-ack__body p {
  font-size: 0.7em;
  font-weight: 400;
  text-align: justify;
  line-height: 1.9;
}

.cv-ack__body p span {
  font-weight: 600;
}

@media screen and (max-width: 768px) {
  .cv-ack__inner {
    flex-direction: column;
    align-items: center;
    gap: 12em;
  }

  .cv-ack__image {
    width: 100%;
  }
}
</style>
