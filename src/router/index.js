/**
 * 路由层
 *
 * 职责：SPA 路由表 + 滚动复位 + 标题切换。
 * 关键决策：
 *   · history 模式（不是 hash）：与原站一致的干净 URL；
 *     本地用静态服务预览时需要在服务器端配 fallback（见 README「打包与部署」）。
 *   · scrollBehavior 一律回顶部：原站用 swup 换页，换页后是顶部，不回顶部会显得"跳页没生效"。
 *   · 内页路由用 :id 单一参数承接 11 个 slug，不为每个 slug 写一条路由。
 */
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/Home/HomePage.vue';
import ReleasePage from '@/pages/Release/ReleasePage.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: { title: 'COVEO — An Audio/Visual Project' },
  },
  {
    path: '/:id',
    name: 'release',
    component: ReleasePage,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0 };
  },
});

router.afterEach(() => {
  // 内页标题由页面自己决定；这里只保证不会一直停在首页标题
  document.title = 'COVEO — An Audio/Visual Project';
});
