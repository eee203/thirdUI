/**
 * @package ring-gallery
 * 环形唱片墙 —— 纯逻辑（零框架依赖）
 *
 * 职责：
 *   1. 把 N 个 DOM 元素按环形均匀分布（优先纯 CSS 三角函数，不支持时用 JS 兜底）
 *   2. 入场：逐项飞入（opacity + translateZ 的错峰过渡）
 *   3. hover 涟漪：按"环上最短距离"计算每项的放大 / 延迟 / 透明度 / 模糊
 *
 * 关键决策：
 *   · 位置只用 CSS 变量表达，元素自身不写内联 transform ——
 *     否则会覆盖 CSS 里"径向旋转 + scale"的组合，缩放会失效（见 cloneOS 03 F3）。
 *   · 涟漪的透明度公式会产生负值（d > n/4 时），这里**故意不钳**：
 *     原站就是这样，浏览器会把负 opacity 钳到 0，表现为"远处的封面直接消失"。
 *     见 SPEC §8 第 4 条，不要"修复"成 0。
 *   · 环形距离不能用线性下标差：下标 0 与 21 在环上是相邻的，必须取 min(raw, n-raw)。
 *
 * 用法：
 *   const ring = createRingGallery({ root, items });
 *   ring.setRipple(3); ring.clearRipple(); ring.destroy();
 */

/** 环上最短距离：下标 i 与 j 之间隔了几格 */
export function circularDistance(i, j, n) {
  const raw = Math.abs(i - j);
  return Math.min(raw, n - raw);
}

/** 指数衰减：距离越远，放大越弱 */
export function ampAtDistance(d, amp, falloff) {
  return amp * Math.exp(-falloff * d);
}

/**
 * 计算某个 hover 下标下的全量涟漪表
 * 公式全部来自原站 main.js 的 carousel 段：
 *   amp     = amp * exp(-falloff * d)
 *   delay   = d * delayMs
 *   opacity = floor + (1 - floor) * (1 - d / floor(n / 4))
 *   blur    = d * 1px
 */
export function computeRipple(index, count, opts) {
  const { amp = 0.15, falloff = 0.33, delayMs = 60, opacityFloor = 0.4 } = opts || {};
  const quarter = Math.floor(count / 4);
  const table = [];
  for (let i = 0; i < count; i += 1) {
    const d = circularDistance(i, index, count);
    table.push({
      distance: d,
      amp: ampAtDistance(d, amp, falloff),
      delayMs: d * delayMs,
      opacity: opacityFloor + (1 - opacityFloor) * (1 - d / quarter),
      blurPx: d,
    });
  }
  return table;
}

/** 浏览器是否支持 calc() 里的 cos()/sin() */
function supportsTrig() {
  if (typeof CSS === 'undefined' || !CSS.supports) return false;
  return CSS.supports('left', 'calc(1px * cos(0rad))');
}

const DEFAULTS = {
  diameterVh: 120,
  artworkBase: 220,
  spinSeconds: 120,
  spinOffsetDeg: 45,
  hoverAmp: 0.15,
  hoverFalloff: 0.33,
  hoverDelayMs: 60,
  hoverOpacityFloor: 0.4,
  enterDurationMs: 1000,
  enterStaggerMs: 50,
  enterDepthPx: -100,
};

/**
 * @param {Object}   cfg
 * @param {Element}  cfg.root   环形容器（.cv-ring）
 * @param {Element[]} cfg.items 封面元素数组（长度 = itemCount）
 * @param {Object}   [cfg.config] 覆盖 DEFAULTS
 * @param {Function} [cfg.onHover] (index) => void   仅用于上报，不参与样式
 * @returns {{setRipple:Function, clearRipple:Function, reveal:Function, destroy:Function}}
 */
export function createRingGallery({ root, items, config, onHover }) {
  if (!root || !items || !items.length) {
    throw new Error('[ring-gallery] root 与 items 必填');
  }
  const cfg = { ...DEFAULTS, ...(config || {}) };
  const count = items.length;

  /* ---------- 1. 注入布局变量 ---------- */
  root.style.setProperty('--cv-item-count', String(count));
  root.style.setProperty('--cv-diameter', `${cfg.diameterVh}vh`);
  root.style.setProperty('--cv-artwork-size', `calc(${cfg.artworkBase} / ${count} * 1vh)`);
  root.style.setProperty('--cv-spin-duration', `${cfg.spinSeconds}s`);
  root.style.setProperty('--cv-spin-offset', `${cfg.spinOffsetDeg}deg`);

  /* ---------- 2. 三角函数兜底 ---------- */
  const trigReady = supportsTrig();
  let resizeHandler = null;

  function applyJsPositions() {
    // 兜底路径：用 getBoundingClientRect 的真实像素算，避免 vh 与 px 混算误差
    const box = root.getBoundingClientRect();
    const diameter = box.width || window.innerHeight * (cfg.diameterVh / 100);
    const radius = diameter / 2;
    const size = (cfg.artworkBase / count) * (window.innerHeight / 100);
    items.forEach((el, i) => {
      const angle = ((2 * Math.PI) / count) * i;
      el.style.left = `${diameter / 2 + radius * Math.cos(angle) - size / 2}px`;
      el.style.top = `${diameter / 2 + radius * Math.sin(angle) - size / 2}px`;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
    });
    root.dataset.trigFallback = 'true';
  }

  /* ---------- 3. 索引与入场延时 ---------- */
  items.forEach((el, i) => {
    el.style.setProperty('--cv-item-index', String(i));
    el.style.setProperty('--cv-enter-delay', `${i * cfg.enterStaggerMs}ms`);
    el.style.setProperty('--cv-enter-duration', `${cfg.enterDurationMs}ms`);
    el.style.setProperty('--cv-enter-depth', `${cfg.enterDepthPx}px`);
  });

  /* 入场：先强制一次样式刷新，让 img 的 opacity:0 / translateZ(-100px) 被真正算进去，
     再加 .is-revealed 才会有过渡。
     **不用 requestAnimationFrame**：嵌套 iframe、省电模式、后台标签下 rAF 可能一次都不触发，
     那样封面会永远停在 opacity:0（整屏看不到图，且不报错）。强制 reflow 是同步且确定的。 */
  function reveal() {
    void root.offsetHeight;
    root.classList.add('is-revealed');
  }

  if (!trigReady) {
    console.warn(
      '[ring-gallery] 当前浏览器不支持 calc() 内的 cos()/sin()，已回退到 JS 像素布局。' +
        '这不是静默降级：root 上已标记 data-trig-fallback="true"。'
    );
    applyJsPositions();
    resizeHandler = () => applyJsPositions();
    window.addEventListener('resize', resizeHandler);
  }

  /* ---------- 4. hover 涟漪 ---------- */
  function setRipple(index) {
    const table = computeRipple(index, count, {
      amp: cfg.hoverAmp,
      falloff: cfg.hoverFalloff,
      delayMs: cfg.hoverDelayMs,
      opacityFloor: cfg.hoverOpacityFloor,
    });
    items.forEach((el, i) => {
      const r = table[i];
      el.style.setProperty('--cv-amp', r.amp.toFixed(4));
      el.style.setProperty('--cv-item-delay', `${r.delayMs}ms`);
      el.style.setProperty('--cv-item-opacity', r.opacity.toFixed(4));
      el.style.setProperty('--cv-item-blur', `${r.blurPx}px`);
    });
    root.classList.add('is-hovering');
    if (onHover) onHover(index);
  }

  function clearRipple() {
    items.forEach((el) => {
      el.style.setProperty('--cv-amp', '0');
      el.style.setProperty('--cv-item-delay', '0ms');
      el.style.setProperty('--cv-item-opacity', '1');
      el.style.setProperty('--cv-item-blur', '0px');
    });
    root.classList.remove('is-hovering');
  }

  const bound = items.map((el) => {
    const idx = Number(el.dataset.ringIndex ?? el.style.getPropertyValue('--cv-item-index'));
    const onEnter = () => setRipple(idx);
    const onLeave = () => clearRipple();
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    // 键盘可达：focus 也触发同一套涟漪
    el.addEventListener('focus', onEnter);
    el.addEventListener('blur', onLeave);
    return { el, onEnter, onLeave };
  });

  return {
    reveal,
    setRipple,
    clearRipple,
    destroy() {
      bound.forEach(({ el, onEnter, onLeave }) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
        el.removeEventListener('focus', onEnter);
        el.removeEventListener('blur', onLeave);
      });
      if (resizeHandler) window.removeEventListener('resize', resizeHandler);
      root.classList.remove('is-revealed', 'is-hovering');
    },
  };
}
