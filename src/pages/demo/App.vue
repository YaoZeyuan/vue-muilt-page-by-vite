<script setup lang="ts"></script>

<template>
  <div class="content">
    <header>
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
      <img alt="zhihu" src="./static/img/知乎.png" />
      <div class="wrapper"></div>
    </header>
  </div>
</template>

<style scoped>
.content {
  display: flex;
  place-items: flex-start;
  flex-wrap: wrap;
  width: 100vw;
  height: 100vh;

  background-image: url('./static/img/风景.jpg');
}
</style>
