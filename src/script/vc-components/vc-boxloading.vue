<template>
  <div class="boxLoader" :class="{ isShow: props.isShow }">
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  props: {
    isShow: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    return {
      props,
    };
  },
});
</script>

<style lang="scss" scoped>
.boxLoader {
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 99999;
  overflow: hidden;
  top: 0;
  left: 0;
  display: flex;
  background-color: rgba(63, 53, 53, 0.335);
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 300ms;
  pointer-events: none;
  &.isShow {
    pointer-events: auto;
    opacity: 1;
  }
  .sk-cube-grid {
    position: absolute;
    width: 130px;
    height: 130px;
    margin: 100px auto;
    max-height: calc(100% - 20px);
    max-width: calc(100% - 20px);
    // background-color:#ccc;
    // width: 100%;
    // height:0;
    // padding-bottom: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
}
</style>
