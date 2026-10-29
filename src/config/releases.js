/**
 * 唱片数据（配置层）
 *
 * 职责：11 张专辑的元数据，按发行时间**升序**存放（= 原站环形转盘 r-0..r-10 的顺序）。
 * 关键决策：
 *   · 列表页需要降序（011 在前），由 `discography` 派生，不维护第二份数组，避免两处不同步。
 *   · `colour` 来自原站同名 data-colour 属性，**可能是 hex / rgba / linear-gradient 三种形态**，
 *     使用处必须当作任意 CSS 颜色字符串处理（见 SPEC §8 第 7 条），不要假定是 hex。
 *   · 封面 8 张复用本项目已有的氛围摄影（1920×1080），3 张为 1200×1200；
 *     尺寸不统一，容器一律 object-fit: cover 裁成方形。
 * 版权：标题/日期/时长/曲目数是事实性元数据；原站的 About 长文案未被使用（见 home 页说明）。
 */
import cover01 from '@/assets/releases/cover-01.jpg';
import cover02 from '@/assets/releases/cover-02.jpg';
import cover03 from '@/assets/releases/cover-03.jpg';
import cover04 from '@/assets/releases/cover-04.jpg';
import cover05 from '@/assets/releases/cover-05.jpg';
import cover06 from '@/assets/releases/cover-06.jpg';
import cover07 from '@/assets/releases/cover-07.jpg';
import cover08 from '@/assets/releases/cover-08.jpg';
import cover09 from '@/assets/releases/cover-09.jpg';
import cover10 from '@/assets/releases/cover-10.jpg';
import cover11 from '@/assets/releases/cover-11.jpg';

export const releases = [
  {
    id: 'mydreamsofyou',
    index: '001',
    title: 'My Dreams of You',
    releasedAt: 1530835200, // 2018-07-06
    dateLabel: 'July 2018',
    tracksLabel: 'single, 1 song',
    durationLabel: '4 minutes 28 seconds',
    colour: '#030303',
    cover: cover01,
  },
  {
    id: 'autumn-14',
    index: '002',
    title: 'Autumn 14',
    releasedAt: 1539907200,
    dateLabel: 'October 2018',
    tracksLabel: 'single, 2 songs',
    durationLabel: '6 minutes 13 seconds',
    colour: '#1A303D',
    cover: cover02,
  },
  {
    id: 'memoriesweshare',
    index: '003',
    title: 'Memories We Share',
    releasedAt: 1541721600,
    dateLabel: 'November 2018',
    tracksLabel: 'single, 1 song',
    durationLabel: '3 minutes 18 seconds',
    colour:
      'linear-gradient(180deg, #FBE0C9 0%, #F1C2B8 33.33%, #EEB5C6 66.67%, #CCBFE4 100%)',
    cover: cover03,
  },
  {
    id: 'youandi',
    index: '004',
    title: 'You and I',
    releasedAt: 1543536000,
    dateLabel: 'November 2018',
    tracksLabel: 'single, 1 song',
    durationLabel: '3 minutes 4 seconds',
    colour: 'rgba(255,255,255,0.8)',
    cover: cover04,
  },
  {
    id: 'chapter-i',
    index: '005',
    title: 'Chapter I',
    releasedAt: 1553299200,
    dateLabel: 'March 2019',
    tracksLabel: 'single, 1 song',
    durationLabel: '3 minutes 20 seconds',
    colour: '#575F2E',
    cover: cover05,
  },
  {
    id: 'elouise',
    index: '006',
    title: 'Elouise',
    releasedAt: 1559865600,
    dateLabel: 'June 2019',
    tracksLabel: 'single, 1 song',
    durationLabel: '3 minutes 52 seconds',
    colour: '#23426F',
    cover: cover06,
  },
  {
    id: 'still-dreaming',
    index: '007',
    title: 'Still Dreaming',
    releasedAt: 1578614400,
    dateLabel: 'January 2020',
    tracksLabel: 'single, 1 song',
    durationLabel: '4 minutes 9 seconds',
    colour: '#F7BBCA',
    cover: cover07,
  },
  {
    id: 'just-a-memory',
    index: '008',
    title: 'Just a Memory',
    releasedAt: 1606435200,
    dateLabel: 'November 2020',
    tracksLabel: 'single, 1 song',
    durationLabel: '3 minutes 43 seconds',
    colour: '#201A40',
    cover: cover08,
  },
  {
    id: 'just-a-memory-stripped',
    index: '009',
    title: 'Just a Memory (Stripped)',
    releasedAt: 1611878400,
    dateLabel: 'January 2021',
    tracksLabel: 'single, 1 song',
    durationLabel: '3 minutes 49 seconds',
    colour: '#E7E5DE',
    cover: cover09,
  },
  {
    id: 'wanna-get-to-know-you',
    index: '010',
    title: 'wanna get to know you',
    releasedAt: 1664496000,
    dateLabel: 'September 2022',
    tracksLabel: 'single, 1 song',
    durationLabel: '3 minutes 19 seconds',
    colour: '#8DC5E6',
    cover: cover10,
  },
  {
    id: 'hold-out-hope',
    index: '011',
    title: 'hold out hope',
    releasedAt: 1758240000,
    dateLabel: 'September 2025',
    tracksLabel: 'single, 4 songs',
    durationLabel: '12 minutes 22 seconds',
    colour: '#DFE9F3',
    cover: cover11,
  },
];

/** 降序（011 → 001），供 Discography 列表使用 */
export const discography = [...releases].sort((a, b) => b.releasedAt - a.releasedAt);

/** 环形转盘用：11 张 × 2 份 = 22 项（原站设计，见 SPEC §8 第 5 条） */
export function buildRingItems() {
  const doubled = [...releases, ...releases];
  return doubled.map((item, i) => ({ ...item, ringKey: `r-${i}`, ringIndex: i }));
}
