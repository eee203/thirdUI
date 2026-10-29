/**
 * 滚动入场（工具函数层）
 *
 * 职责：把 [data-reveal] 元素在"进入视口"时加上 .animated，触发 CSS 过渡。
 *
 * 关键决策：
 *   · 只加不移除（unobserve 后不再观察），避免上下滚动时反复播放造成闪烁。
 *   · rootMargin 底部收 −10%，让元素"真的进到视口里"才播，而不是刚露头就播。
 *   · 与 lenis 共存无冲突：lenis 用的是真实滚动位置（不是 transform 位移），
 *     IntersectionObserver 读到的是同一套坐标。
 */
export function createReveal({ rootMargin = '0px 0px -10% 0px', threshold = 0.12 } = {}) {
  const els = Array.from(document.querySelectorAll('[data-reveal]'));

  if (typeof IntersectionObserver === 'undefined') {
    console.warn('[reveal] 无 IntersectionObserver，全部直接置为可见（非静默降级）');
    els.forEach((el) => el.classList.add('animated'));
    return { destroy() {} };
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('animated');
        io.unobserve(entry.target);
      });
    },
    { rootMargin, threshold }
  );

  els.forEach((el) => io.observe(el));
  return {
    destroy() {
      io.disconnect();
    },
  };
}
