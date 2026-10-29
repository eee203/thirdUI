/**
 * 平滑滚动 + 视差（工具函数层）
 *
 * 职责：
 *   1. 用 lenis 接管页面滚动（lerp 0.3，与原站 locomotive-scroll 的内核同款）
 *   2. 给 [data-speed] 元素写 --cv-parallax-y 变量，实现视差
 *
 * 关键决策：
 *   · 视差**只写 CSS 变量，不写内联 transform**。
 *     原因：heroScript 自己已经占用了 transform（translateX(-50%) rotate(-10deg)），
 *     内联 transform 会把 SPA 的居中/旋转整个覆盖掉（cloneOS 03 F3 实测踩过）。
 *   · 视差基准位置只在挂载与 resize 时测量一次；每帧都用 getBoundingClientRect
 *     会读到"已经被 transform 影响过"的盒子，导致位移自我累积、越滚越偏。
 *   · 公式：y = speed × progress
 *     progress = (scrollY + vh/2) − (元素文档中心)
 *     progress > 0 表示元素中心还在视口中线下方。乘 speed 后元素"走得比页面慢"，
 *     这就是原站那种轻微滞后的观感。
 */
import Lenis from 'lenis';
import { SCROLL } from '@/config/constants';

const MAX_PROGRESS_RATIO = 1.5;

export function createSmoothScroll({ reducedMotion = false } = {}) {
  if (reducedMotion) {
    console.info('[smooth-scroll] prefers-reduced-motion 生效，已退回原生滚动（非静默降级）');
    return { lenis: null, destroy() {} };
  }

  const lenis = new Lenis({
    lerp: SCROLL.lerp,
    autoRaf: true,
    smoothWheel: true,
  });

  const targets = Array.from(document.querySelectorAll('[data-speed]'));
  const measured = [];

  function measure() {
    measured.length = 0;
    const vh = window.innerHeight;
    targets.forEach((el) => {
      // 测之前先清掉视差位移，否则读到的是"已偏移"的盒子
      const prev = el.style.getPropertyValue('--cv-parallax-y');
      el.style.setProperty('--cv-parallax-y', '0px');
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--cv-parallax-y', prev || '0px');
      measured.push({
        el,
        speed: Number(el.dataset.speed) || 0,
        center: rect.top + window.scrollY + rect.height / 2,
        halfH: rect.height / 2,
        vh,
      });
    });
  }

  function update(scrollY) {
    measured.forEach((m) => {
      const progress = scrollY + m.vh / 2 - m.center;
      const limit = m.vh * MAX_PROGRESS_RATIO;
      const clamped = Math.max(-limit, Math.min(limit, progress));
      const y = clamped * m.speed;
      m.el.style.setProperty('--cv-parallax-y', `${y.toFixed(2)}px`);
    });
  }

  measure();
  lenis.on('scroll', ({ scroll }) => update(scroll));
  update(window.scrollY);

  // 验收探针挂钩：headless 里 window.scrollTo 会被 lenis 的 target 拉回去，
  // 必须用 lenis.scrollTo(y, {immediate:true}) 才能真正落位。
  window.__lenis = lenis;

  let resizeTimer = 0;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      measure();
      update(window.scrollY);
    }, 150);
  };
  window.addEventListener('resize', onResize);

  return {
    lenis,
    destroy() {
      window.removeEventListener('resize', onResize);
      clearTimeout(resizeTimer);
      lenis.destroy();
    },
  };
}
