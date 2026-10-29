<!--
  HomePage · 首页（页面层）
  职责：把五个区块按原站顺序组装起来，并把"点封面 / 点 Preview"统一接到播放器。
  关键决策：区块顺序 = 原站 DOM 顺序（hero → about → discographyHeader → discography → acknowledgements），
          不要为了视觉好看调换；版式节奏靠间距，不靠重排。
-->
<template>
  <div class="cv-home">
    <HeroSection :playing-id="state.id" @pick="playTrack" />
    <AboutSection />
    <DiscographyHeader />
    <ReleaseList @preview="playTrack" />
    <Acknowledgements />
  </div>
</template>

<script setup>
import HeroSection from '@/components/HeroSection.vue';
import AboutSection from '@/components/AboutSection.vue';
import DiscographyHeader from '@/components/DiscographyHeader.vue';
import ReleaseList from '@/components/ReleaseList.vue';
import Acknowledgements from '@/components/Acknowledgements.vue';
import { playTrack, usePlayer } from '@/utils/player';

const { state } = usePlayer();
</script>

<style>
.cv-home {
  width: 100%;
}
</style>
