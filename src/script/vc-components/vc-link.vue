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
    hoverStyle: {
      type: String,
      required: false,
      default: '',
    },
  },
  emits: ['click'],
  setup(props, { emit }) {
    const clickLink = (e: any) => {
      if (props.disabled === true) {
        e.preventDefault();
        return;
      }
      // 通常の動作をキャンセルしてemitでイベントを送信
      if ((e.button !== undefined && e.button !== 0) || e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      emit('click');
    };

    return {
      props,
      clickLink,
    };
  },
});
</script>
<template>
  <a :href="props.href" :class="[props.class, props.hoverStyle, { disabled: props.disabled }]" @click="clickLink">
    <div>
      <slot></slot>
    </div>
  </a>
</template>
<style lang="scss" scoped>
a {
  transition: all 300ms;
  text-decoration: none;
  color: #333333;
  display: block;

  &.bar {
    transition: 0.3s;
    line-height: 1rem;

    &:hover {
      color: #213a5f;
    }
    &:active {
      color: #447aca;
    }
    > div {
      padding: 4px 0;
    }

    > div::before,
    > div::after {
      position: absolute;
      content: '';
      width: 0;
      height: 1px;
      background-color: #9cd3ff;
      transition: all 500ms;
    }

    > div::before {
      top: -2px;
      left: 0;
    }
    > div::after {
      bottom: -2px;
      left: 100%;
      transform: translateX(-100%);
    }

    &:hover > div::before,
    &:hover > div::after {
      width: 100%;
      background-color: #447aca;
    }
  }
  &.disabled {
    cursor: default;
    // color: #314158;
  }
}
</style>
