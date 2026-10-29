/**
 * 演示模式开关（工具函数层）
 *
 * 职责：把 SPEC 里"需要用开关才能验证的行为"集中成 URL 参数，避免为了看得见效果去改需求。
 *
 * 目前只有一个：
 *   ?demo=featured —— 把"新专判定窗口"从 4 个月放宽到 24 个月。
 *   原因：原站规则是 releaseDate > now − 4 个月，而最新专 2025-09 距 2026-10 已超 4 个月，
 *   按原规则本来就不该有光环（见 SPEC §8 第 6 条）。要验证 BEH-04 就用这个开关，
 *   **不要去改判定规则本身**。
 */
const params = new URLSearchParams(
  typeof window === 'undefined' ? '' : window.location.search
);

export const demo = {
  featured: params.get('demo') === 'featured',
};

export const FEATURED_WINDOW_MONTHS = demo.featured ? 24 : 4;

/** 某张专辑是否算"新专" */
export function isFeatured(item, nowMs = Date.now()) {
  const cutoff = new Date(nowMs);
  cutoff.setMonth(cutoff.getMonth() - FEATURED_WINDOW_MONTHS);
  return item.releasedAt * 1000 > cutoff.getTime();
}
