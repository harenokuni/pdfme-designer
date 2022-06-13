<template>
  <div class="FormControl" :class="[String(props.class), { disabled: props.disabled }]">
    <div class="FormControlBody">
      <div class="FormControlLabel" v-if="{ isShow: props.placeholder.length > 0 }">
        <div class="FormControlLabel--Placeholder">{{ props.placeholder }}</div>
        <div class="FormControlLabel--Icon-Require" v-if="props.require == true">必須</div>
      </div>
      <div class="FormControlInput" :class="[String(props.inputClass)]">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
type Props = {
  //Form系コントロール統一要素
  placeholder: string;
  class: string;
  inputClass: string;
  require: boolean;
  disabled: boolean;
};

import { defineComponent, reactive, ref, watch, onMounted } from 'vue';
export default defineComponent({
  props: {
    placeholder: {
      type: String,
      required: false,
      default: '',
    },
    class: {
      type: String,
      required: false,
      default: '',
    },
    inputClass: {
      type: String,
      required: false,
      default: '',
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    require: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props: Props) {
    return {
      props,
    };
  },
});
</script>
<style lang="scss" scoped>
</style>
