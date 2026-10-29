<!--
  AboutSection · 关于区（组件层）
  职责：两张大图浮层 + 标题 + 正文。
  关键决策：
    · 原站在两图之上还叠了一块 canvas 图片序列（EFF-09，8×4 雪碧图 30 帧）。
      本轮**不做**该效果（SPEC §1.2 第 2 条）—— 不要用静态图去假装它是序列动画。
    · 正文文案为本项目自撰，未使用原站文案（原站 About 四段属受保护表达）。
-->
<template>
  <section class="cv-about cv-section">
    <div class="cv-wrapper cv-wrapper--l cv-about__grid">
      <div class="cv-about__float cv-about__float--right" data-speed="0.05">
        <img
          :src="about1"
          alt=""
          loading="lazy"
          class="cv-anim cv-anim--fade-in"
          data-reveal
          style="--cv-anim-delay: 0.2s"
        />
      </div>

      <div class="cv-about__float cv-about__float--left" data-speed="0.05">
        <img
          :src="about2"
          alt=""
          loading="lazy"
          class="cv-anim cv-anim--fade-in"
          data-reveal
          style="--cv-anim-delay: 0.2s"
        />
      </div>

      <div class="cv-about__content">
        <h3 class="cv-anim cv-anim--fade-in" data-reveal style="--cv-anim-delay: 0.2s">
          Notes on sound and <span>picture</span>
        </h3>

        <p
          v-for="(para, i) in paragraphs"
          :key="i"
          class="cv-anim cv-anim--blur-in"
          data-reveal
          style="--cv-anim-duration: 0.8s; --cv-anim-delay: 0.2s"
        >
          {{ para }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import about1 from '@/assets/img/about-1.jpg';
import about2 from '@/assets/img/about-2.jpg';

/* 自撰占位文案：保持四段、每段 3–4 句的节奏，与原站版式体量对齐 */
const paragraphs = [
  'This page is a study, not a product. Every mechanism on it was measured from a live site — the radius of the ring, the sixty-millisecond stagger between neighbours, the exact easing curve on the way out — and then rebuilt from scratch with different content.',
  'The shape of the work is simple: a lot of empty space, a small amount of type, and one object that never stops moving. Everything else exists to give that object room. Restraint is the hardest part to copy, because it leaves no trace in the code.',
  'The artwork here is deliberately generic. Nothing was lifted from the reference site — no photographs, no audio, no typefaces, no logo. What is reproduced is the behaviour: how distance along a circle becomes delay, and how delay becomes the feeling of something alive.',
  'Keep this local. It is a reading exercise in interaction design, and the only thing worth carrying forward is the set of numbers and the reasoning behind them.',
];
</script>

<style>
.cv-about {
  position: relative;
  margin-top: 8em;
}

.cv-about__grid {
  display: grid;
  grid-template-rows: auto auto auto;
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 2em;
}

/* 桌面：两张图绝对定位到左右边缘，正文居中 366px —— 这是原站的构图 */
.cv-about__float {
  position: absolute;
  width: 24vw;
  height: auto;
  will-change: transform;
  transform: translate3d(0, var(--cv-parallax-y, 0px), 0);
}

.cv-about__float--right {
  right: 0;
  top: 20em;
}

.cv-about__float--left {
  left: 0;
  top: 30em;
}

.cv-about__float img {
  width: 100%;
  height: auto;
  border-radius: var(--cv-radius-card);
}

.cv-about__content {
  width: 80vw;
  max-width: 366px;
  margin: 0 auto;
}

.cv-about__content h3 {
  margin-bottom: 4em;
}

.cv-about__content p {
  color: var(--cv-ink-muted);
  line-height: 2em;
  margin: 3em 0;
  text-align: left;
}

@media screen and (max-width: 768px) {
  .cv-about__grid {
    padding: 0 1.5em;
  }

  /* 移动端：图回到文档流，成为 grid 的行，不再浮在两侧 */
  .cv-about__float {
    position: relative;
    width: 100%;
    transform: none;
  }

  .cv-about__float--right {
    right: unset;
    top: 5em;
    grid-row: 3;
  }

  .cv-about__float--left {
    left: unset;
    top: 5em;
    grid-row: 1;
  }

  .cv-about__content {
    width: 100%;
    grid-row: 2;
  }
}
</style>
