/**
 * 常量区（配置层）
 *
 * 职责：把所有"原站实测出来的魔法数字"集中在这里，组件里一律引用常量，不写字面量。
 * 关键决策：每个值都带出处注释（原站哪个文件、哪个规则），便于下一轮核对。
 * 非显然取舍：
 *   1. itemCount 固定 22 = 11 张专辑 × 2 份，这是原站设计（同张专辑在对侧 180° 重复出现），
 *      不是 bug，不要去重。见 SPEC §8 第 5 条。
 *   2. featuredWindowMonths 默认 4 是原站规则；因最新专距今已超 4 个月，
 *      默认状态下看不到光环，这是正确行为。用 ?demo=featured 才能观察。
 */

/** 环形唱片墙 —— 出处：style.css `.carouselContainer .carousel` + main.js carousel 段 */
export const RING = {
  itemCount: 22, // --itemCount
  diameterVh: 120, // --diameter: 120vh
  artworkBase: 220, // --artworkSize: calc(220 / itemCount * 1vh)  -> 10vh
  spinSeconds: 120, // animation: spin 120s infinite linear
  spinOffsetDeg: 45, // keyframes spin: rotate(45deg) -> rotate(405deg)
  hoverAmp: 0.15, // const amp = 0.15
  hoverFalloff: 0.33, // const falloff = 0.33
  hoverDelayMs: 60, // const delay = 60
  hoverOpacityFloor: 0.4, // 0.4 + (1 - 0.4) * (1 - d / floor(n/4))
  enterDurationMs: 1000,
  enterStaggerMs: 50,
  enterDepthPx: -100,
  featuredWindowMonths: 4,
};

/** 拖尾画廊 —— 出处：main.js `.galleryContainer` 段的 config 对象原文 */
export const TRAIL = {
  imageCount: 30, // 原站 /gallery/1.png .. 30.png
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
  maxRotationDeg: 25, // (Math.random() - 0.5) * 50
};

/** 平滑滚动 —— 出处：main.js `new LocomotiveScroll({lenisOptions:{lerp:0.3}})`
 *  注意：视差档位（0.02 / 0.05）是原站 style.css 里的 data-scroll-speed 属性值。 */
export const SCROLL = {
  lerp: 0.3,
};

/** 视差档位表 —— 元素上写 data-speed="0.02" 即可，key 只用于文档说明 */
export const PARALLAX_SPEEDS = {
  heroScript: 0.02,
  aboutImage: 0.05,
};

/** 播放器（无音频，假计时）—— 时长取预览长度 30s，与原站 preview 片段量级一致 */
export const PLAYER = {
  fakeDurationSec: 30,
  tickMs: 100,
};
