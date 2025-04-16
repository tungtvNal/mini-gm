<template>
  <div className="loading">
    <div className="loading-text">LOADING</div>
  </div>
</template>

<style scoped>
/******************/
/* LOADING SCREEN */
/******************/
.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #00bfff;
}

.loading-text {
  font-family: Nickname, sans-serif;
  margin: auto;
  animation: loading 0.5s linear infinite;
  background: #ffffff00;
  font-size: 4em;
  color: #ffffff;
}

@keyframes loading {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}
</style>
