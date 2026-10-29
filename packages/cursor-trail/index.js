/**
 * @package cursor-trail
 * 鼠标 / 滚动拖尾画廊 —— 纯逻辑（零框架依赖）
 *
 * 职责：指针在容器内移动（或页面滚动）时，沿轨迹不断生成随机角度的小图，
 *       每张图存活一段时间后缩小消失并被回收。
 *
 * 关键决策：
 *   · **不用 rAF 轮询驱动生成与回收**，改为「事件驱动生成 + 定时器回收」。
 *     原站是一个 rAF 主循环里同时做 create 与 remove，实测有两个问题：
 *       1. rAF 在后台标签、省电模式、被嵌套的 iframe 里都可能被暂停 ——
 *          一旦暂停，拖尾完全不出图、也不再回收（DOM 只增不减），且没有任何报错。
 *       2. 每帧轮询去判断"鼠标动够了吗"，本质是把事件逻辑塞进了帧循环。
 *     改成：mousemove 里直接判阈值并生成（天然被事件频率节流），
 *     回收与"静止补图"交给 50ms / 200ms 的定时器。可观察行为与参数完全一致。
 *   · 回收必须"按队列 + 节流"：每张图有自己的 removeTime，
 *     但移除动作受 removalDelay 节流，否则会同一帧删十几张造成抖动。
 *   · 传进来的图片数组是"循环使用"的，不是每次新建：lastImage 走到末尾回 0。
 *   · 容器必须 position: relative + overflow: hidden，否则小图会溢到别的区块。
 *
 * 所有数值默认值 = 原站 main.js 的 config 对象原文。
 *
 * 用法：
 *   const trail = createCursorTrail({ container, images, config });
 *   trail.destroy();
 */

const DEFAULTS = {
  imageLifespan: 250,
  removalDelay: 50,
  mouseThreshold: 80,
  scrollThreshold: 80,
  idleCursorInterval: 200,
  idleCursorStop: 600,
  inDuration: 450,
  outDuration: 750,
  inEasing: 'cubic-bezier(0.22, 1, 0.36, 1)',
  outEasing: 'cubic-bezier(0.64, 0, 0.78, 0)',
  maxRotationDeg: 25,
  imageClass: 'cv-trail__img',
};

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * @param {Object}   cfg
 * @param {Element}  cfg.container 监听区域（需 position:relative + overflow:hidden）
 * @param {string[]} cfg.images    图片 URL 数组，循环取用
 * @param {Object}   [cfg.config]  覆盖 DEFAULTS
 * @param {boolean}  [cfg.disabled] 为 true 时直接返回空实现（reduced-motion 用）
 */
export function createCursorTrail({ container, images, config, disabled }) {
  if (!container || !images || !images.length) {
    throw new Error('[cursor-trail] container 与 images 必填');
  }
  const cfg = { ...DEFAULTS, ...(config || {}) };

  if (disabled || prefersReducedMotion()) {
    console.info('[cursor-trail] prefers-reduced-motion 生效，拖尾已停用（非静默降级）');
    return { destroy() {} };
  }

  const trail = [];
  const spawned = [];

  let mouseX = 0;
  let mouseY = 0;
  let lastMouseX = 0;
  let lastMouseY = 0;
  let isMoving = false;
  let isCursorInContainer = false;
  let lastRemovalTime = 0;
  let lastSteadyImageTime = 0;
  let lastScrollTime = 0;
  let lastMoveTime = 0;
  let lastImage = 0;

  /* 预加载：不预加载会在第一张出现时闪一下白 */
  images.forEach((src) => {
    const img = new Image();
    img.src = src;
  });

  const isMobile = () =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;

  const isInContainer = (x, y) => {
    const rect = container.getBoundingClientRect();
    if (isMobile()) {
      // 移动端没有 hover，用"容器是否处在视口中带"判定
      return (
        window.scrollY + window.innerHeight / 2 >= container.offsetTop - 100 &&
        window.scrollY <= container.offsetTop + (container.offsetHeight - window.innerHeight / 2)
      );
    }
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  };

  const hasMovedEnough = () => {
    const distance = Math.hypot(mouseX - lastMouseX, mouseY - lastMouseY);
    return distance > cfg.mouseThreshold;
  };

  const createImage = () => {
    const img = document.createElement('img');
    img.classList.add(cfg.imageClass);
    img.alt = '';
    img.draggable = false;

    const rotation = (Math.random() - 0.5) * cfg.maxRotationDeg * 2;

    img.src = images[lastImage];
    lastImage = (lastImage + 1) % images.length;

    const rect = container.getBoundingClientRect();
    img.style.left = `${mouseX - rect.left}px`;
    img.style.top = `${mouseY - rect.top}px`;
    img.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(0)`;
    img.style.transition = `transform ${cfg.inDuration}ms ${cfg.inEasing}`;

    container.appendChild(img);
    spawned.push(img);

    // 先强制一次样式刷新，让 scale(0) 被真正算进去，再改成 scale(1) 才会有过渡。
    // 不用 rAF：iframe / 省电模式下 rAF 可能一直不触发，那样图会永远停在 scale(0)。
    void img.offsetWidth;
    img.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(1)`;

    trail.push({
      element: img,
      rotation,
      removeTime: Date.now() + cfg.imageLifespan,
    });
  };

  const createScrollTrailImage = () => {
    if (!isCursorInContainer) return;

    // 滚动时鼠标可能没动，人为把基准点推开，制造"有轨迹"的错觉
    lastMouseX += (cfg.mouseThreshold + 10) * (Math.random() > 0.5 ? 1 : -1);
    lastMouseY += (cfg.mouseThreshold + 10) * (Math.random() > 0.5 ? 1 : -1);
    createImage();
    lastMouseX = mouseX;
    lastMouseY = mouseY;
  };

  const removeOldImages = () => {
    const now = Date.now();
    if (now - lastRemovalTime < cfg.removalDelay || trail.length === 0) return;

    const oldest = trail[0];
    if (now < oldest.removeTime) return;

    const item = trail.shift();
    item.element.style.transition = `transform ${cfg.outDuration}ms ${cfg.outEasing}`;
    item.element.style.transform = `translate(-50%, -50%) rotate(${item.rotation}deg) scale(0)`;
    lastRemovalTime = now;

    const el = item.element;
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
      const at = spawned.indexOf(el);
      if (at > -1) spawned.splice(at, 1);
    }, cfg.outDuration);
  };

  /* ---------------- 事件 ---------------- */

  const onMouseOver = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    isCursorInContainer = isInContainer(mouseX, mouseY);
    document.removeEventListener('mouseover', onMouseOver);
  };

  const onMouseMove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isCursorInContainer = isInContainer(mouseX, mouseY);

    if (!isCursorInContainer) return;

    isMoving = true;
    lastMoveTime = Date.now();
    clearTimeout(moveTimeout);
    moveTimeout = setTimeout(() => {
      isMoving = false;
    }, 100);

    // 阈值判定放在事件里而不是帧循环里：移动够 80px 就出一张
    if (hasMovedEnough()) {
      lastMouseX = mouseX;
      lastMouseY = mouseY;
      createImage();
    }
  };

  const onScroll = () => {
    isCursorInContainer = isInContainer(mouseX, mouseY);
    if (!isCursorInContainer) return;

    const now = Date.now();
    if (now - lastScrollTime < cfg.scrollThreshold) return;
    lastScrollTime = now;
    createScrollTrailImage();
  };

  /* 静止补图：鼠标停在容器里时按 idleCursorInterval 继续出图，
     超过 idleCursorStop 就停 —— 等价于原站 rAF 里的那段判断 */
  const idleTimer = setInterval(() => {
    if (!isCursorInContainer || isMoving) return;
    const now = Date.now();
    if (now - lastMoveTime > cfg.idleCursorStop) return;
    if (now - lastSteadyImageTime < cfg.idleCursorInterval) return;
    lastSteadyImageTime = now;
    createImage();
  }, Math.min(cfg.idleCursorInterval, 100));

  /* 回收：每 removalDelay 检查一次队首，到期就缩回并移除 */
  const reapTimer = setInterval(removeOldImages, cfg.removalDelay);

  let moveTimeout = 0;

  document.addEventListener('mouseover', onMouseOver, false);
  document.addEventListener('mousemove', onMouseMove);
  window.addEventListener('scroll', onScroll, { passive: true });

  return {
    /** 当前在场小图数量，供验收脚本断定"不泄漏" */
    count: () => spawned.length,
    destroy() {
      clearInterval(idleTimer);
      clearInterval(reapTimer);
      clearTimeout(moveTimeout);
      document.removeEventListener('mouseover', onMouseOver, false);
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll, { passive: true });
      spawned.forEach((el) => el.parentNode && el.parentNode.removeChild(el));
      spawned.length = 0;
      trail.length = 0;
    },
  };
}
