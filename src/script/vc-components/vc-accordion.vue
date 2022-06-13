<template>
  <div class="vue-accordion" :style="{ height: state.height }" :class="{ closed: !props.isShow }">
    <div class="vue-accordion-container" ref="elmAccordion">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch, onMounted, nextTick } from 'vue';
export default defineComponent({
  props: {
    isShow: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    const elmAccordion = ref<HTMLElement>();
    const state = reactive({
      height: 'auto',
    });
    watch(
      () => props.isShow,
      () => {
        resize();
      }
    );
    if (props.isShow == true) {
      state.height = 'auto';
    } else {
      state.height = '0px';
    }
    const resize = async () => {
      try {
        if (elmAccordion.value) {
          //要素のサイズ確認
          const height = elmAccordion.value.getBoundingClientRect().height;
          if (props.isShow == true) {
            state.height = height + 'px';
            setTimeout(() => {
              state.height = 'auto';
            }, 300);
          } else {
            state.height = String(elmAccordion.value.clientHeight ) + 'px';
            await nextTick();
            setTimeout(() => {
              state.height = '0px';
            }, 100);
          }
        }
      } catch {
        state.height = '0px';
      }
    };
    onMounted(() => {
      resize();
    });
    return {
      state,
      props,
      elmAccordion,
    };
  },
});
</script>

<style lang="scss" scoped>
.vue-accordion {
  position: relative;
  width: 100%;
  overflow: hidden !important;
  transition: height 300ms;
  padding: 0 !important;

  .vue-accordion-container {
    position: relative;
    width: 100%;
    height: auto;
    overflow: visible;
  }
}
</style>
