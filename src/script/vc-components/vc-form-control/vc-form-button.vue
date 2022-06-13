<script lang="ts">
import { defineComponent } from 'vue';

type Props = {
  class: string;
  disabled: boolean;
  isLoading: boolean;
};

export default defineComponent({
  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    isLoading: {
      type: Boolean,
      required: false,
      default: undefined,
    },
    class: {
      type: String,
      required: false,
      default: '',
    },
    href: {
      type: String,
      required: false,
      default: '',
    },
  },
  emits: ['click'],
  setup(props, { emit }) {
    const onClick = (e: any) => {
      if (props.isLoading == true || props.disabled == true) return;
      emit('click', e);
    };
    const clickLink = (e: PointerEvent) => {
      e.preventDefault();
      // 通常の動作をキャンセルしてemitでイベントを送信
      if ((e.button !== undefined && e.button !== 0) || e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return;
      // e.preventDefault();
      emit('click');
    };

    return {
      //メソッド
      onClick,
      props,
      clickLink,
    };
  },
});
</script>

<template>
  <a v-if="href" :href="href" class="btn" @click.stop="clickLink">
    <slot></slot>
    <div v-if="props.isLoading !== undefined" class="loaderBase" :class="{ isLoading: props.isLoading }"></div>
  </a>
  <button
    type="button"
    v-else
    class="btn"
    :class="[props.class, { disabled: props.disabled, loadingMode: props.isLoading !== undefined }]"
    :disabled="props.disabled"
    @click.stop="onClick"
  >
    <slot></slot>
    <div v-if="props.isLoading !== undefined" class="loaderBase" :class="{ isLoading: props.isLoading }"></div>
  </button>
</template>

<style lang="scss" scoped>
</style>
