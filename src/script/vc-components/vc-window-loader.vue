<template>
  <div class="windowLoadingContailer" :class="{ closed: !props.data.isShow }" :style="{ 'z-index': props.data.zindex }">
    <div class="loadingImg">
      <div class="sk-cube-grid">
        <div class="sk-cube sk-cube1"></div>
        <div class="sk-cube sk-cube2"></div>
        <div class="sk-cube sk-cube3"></div>
        <div class="sk-cube sk-cube4"></div>
        <div class="sk-cube sk-cube5"></div>
        <div class="sk-cube sk-cube6"></div>
        <div class="sk-cube sk-cube7"></div>
        <div class="sk-cube sk-cube8"></div>
        <div class="sk-cube sk-cube9"></div>
      </div>
      <div class="loadingtext">しばらくお待ち下さい。</div>
    </div>
  </div>
</template>

<script lang="ts" src="./vc-window-loader-script"></script>

<style lang="scss" scoped>
$base-color-modal: rgba(0, 0, 0, 0.411);

//--------------------------------------------

.windowLoadingContailer {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: $base-color-modal;

  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;

  opacity: 1;
  will-change: opacity;
  animation-name: windowLoadingContailer_hidden;
  animation-duration: 200ms;
  animation-iteration-count: 1;
  animation-direction: reverse;

  &.closed {
    opacity: 0;
    display: none;
    animation-direction: normal;
  }

  > .loadingImg {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
  }

  .loadingtext {
    padding: 18px 0 0 0;
    font-size: 20px;
    color: white;
  }

  .sk-cube-grid {
    width: 130px;
    height: 130px;
    // margin: 100px auto;

    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }

  .sk-cube-grid .sk-cube {
    height: 33%;
    width: calc(33% - 2px);
    height: calc(33% - 2px);
    margin: 1px;

    background-color: #333;
    background-color: rgba(37, 243, 233, 0.767);
    // float: left;
    -webkit-animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out;
    animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out;
  }

  .sk-cube-grid .sk-cube1 {
    -webkit-animation-delay: 0.2s;
    animation-delay: 0.2s;
  }

  .sk-cube-grid .sk-cube2 {
    -webkit-animation-delay: 0.3s;
    animation-delay: 0.3s;
  }

  .sk-cube-grid .sk-cube3 {
    -webkit-animation-delay: 0.4s;
    animation-delay: 0.4s;
  }

  .sk-cube-grid .sk-cube4 {
    -webkit-animation-delay: 0.1s;
    animation-delay: 0.1s;
  }

  .sk-cube-grid .sk-cube5 {
    -webkit-animation-delay: 0.2s;
    animation-delay: 0.2s;
  }

  .sk-cube-grid .sk-cube6 {
    -webkit-animation-delay: 0.3s;
    animation-delay: 0.3s;
  }

  .sk-cube-grid .sk-cube7 {
    -webkit-animation-delay: 0s;
    animation-delay: 0s;
  }

  .sk-cube-grid .sk-cube8 {
    -webkit-animation-delay: 0.1s;
    animation-delay: 0.1s;
  }

  .sk-cube-grid .sk-cube9 {
    -webkit-animation-delay: 0.2s;
    animation-delay: 0.2s;
  }
}
</style><style lang="scss">
@keyframes windowLoadingContailer_hidden {
  0% {
    display: fixed;
    opacity: 1;
  }

  99% {
    display: none;
  }

  100% {
    display: none;
    opacity: 0;
  }
}

@-webkit-keyframes sk-cubeGridScaleDelay {
  0%,
  70%,
  100% {
    -webkit-transform: scale3D(1, 1, 1);
    transform: scale3D(1, 1, 1);
  }

  35% {
    -webkit-transform: scale3D(0, 0, 1);
    transform: scale3D(0, 0, 1);
  }
}

@keyframes sk-cubeGridScaleDelay {
  0%,
  70%,
  100% {
    -webkit-transform: scale3D(1, 1, 1);
    transform: scale3D(1, 1, 1);
  }

  35% {
    -webkit-transform: scale3D(0, 0, 1);
    transform: scale3D(0, 0, 1);
  }
}
</style>
