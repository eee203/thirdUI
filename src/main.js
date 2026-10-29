/**
 * 应用入口（页面入口层）
 *
 * 职责：按固定顺序注入样式 → 挂载路由 → 挂载根组件。
 * 关键决策：
 *   · 样式顺序不能乱：字体声明 → 令牌 → 基础 → 动画。
 *     令牌要先于基础，否则基础里的 var() 在第一帧解析不到；
 *     动画最后，方便用动画类覆盖基础规则。
 *   · 字体走本地 woff2（src/assets/fonts），不用 Google Fonts CDN ——
 *     这样满足"运行时零外网请求"的验收项（REF-C 第 3 条）。
 *   · **必须先 await router.isReady() 再 mount**。
 *     否则 RouterView 首次渲染是空的，App 的 onMounted 会在首页组件进 DOM 之前触发，
 *     此时 createReveal() 扫到的 [data-reveal] 是 0 个 —— 整页入场动画全部失效。
 *     实测踩过：27 个 [data-reveal] 一个都没被观察到。
 */
import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';

import '@/assets/fonts/fonts.css';
import '@/styles/tokens.css';
import '@/styles/base.css';
import '@/styles/animations.css';

const app = createApp(App).use(router);

router.isReady().then(() => {
  app.mount('#app');
});