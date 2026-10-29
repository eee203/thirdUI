/**
 * 播放器状态（工具函数层 · composable）
 *
 * 职责：全局单例的播放器状态。任何组件调 playTrack(track) 即可拉起播放器。
 *
 * 关键决策：
 *   · **没有真实音频**（SPEC §1.2 第 3 条）。进度由 PLAYER.tickMs 的假计时推进，
 *     唱片靠 CSS animation-play-state 切换。机制与真实播放器一致，只是不出声。
 *   · 状态放在模块作用域而不是 provide/inject：播放器在 App 根节点常驻，
 *     而触发点在深层列表里，模块单例比逐层透传简单。
 *   · timer 必须可清：组件卸载 / 换曲 / 关闭时都要 stop，否则会留下幽灵计时器。
 */
import { reactive } from 'vue';
import { PLAYER } from '@/config/constants';

const state = reactive({
  visible: false,
  playing: false,
  id: '',
  title: '',
  artwork: '',
  colour: '#dddddd',
  elapsed: 0,
  duration: PLAYER.fakeDurationSec,
});

let timer = 0;

function stopTimer() {
  if (timer) {
    clearInterval(timer);
    timer = 0;
  }
}

function startTimer() {
  stopTimer();
  timer = setInterval(() => {
    state.elapsed += PLAYER.tickMs / 1000;
    if (state.elapsed >= state.duration) {
      state.elapsed = 0;
      state.playing = false;
      stopTimer();
    }
  }, PLAYER.tickMs);
}

/** 拉起播放器并开始"播放"某一张 */
export function playTrack(track) {
  if (!track) return;
  state.id = track.id || '';
  state.title = track.title || '';
  state.artwork = track.cover || '';
  state.colour = track.colour || '#dddddd';
  state.elapsed = 0;
  state.visible = true;
  state.playing = true;
  startTimer();
}

/** 播放 / 暂停 */
export function togglePlay() {
  if (!state.visible) return;
  state.playing = !state.playing;
  if (state.playing) startTimer();
  else stopTimer();
}

/** 关闭播放器 */
export function closePlayer() {
  stopTimer();
  state.visible = false;
  state.playing = false;
  state.id = '';
  state.elapsed = 0;
}

export function usePlayer() {
  return { state, playTrack, togglePlay, closePlayer };
}

export function formatTime(sec) {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
