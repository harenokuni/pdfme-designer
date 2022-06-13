<template>
  <div
    class="FormControl"
    :class="[String(props.class), { disabled: props.disabled, diff: computedIsChange, hasWarn: props.warn != '', activate: state.isActivate }]"
  >
    <div class="FormControlBody">
      <div class="FormControlLabel" v-if="{ isShow: props.require == true || props.placeholder.length > 0 || props.maxLen > 0 }">
        <div class="FormControlLabel--Placeholder">{{ props.placeholder }}</div>
        <div class="FormControlLabel--Icon-Require" v-if="props.require == true">必須</div>
        <div class="FormControlLabel--Icon-lenMessage" :data-last="props.maxLen - state.value.length" :data-maxLen="props.maxLen">
          {{ state.value.length }} / {{ props.maxLen }} 文字
        </div>
      </div>
      <div class="FormControlInput">
        <input
          ref="elmInput"
          :type="props.type"
          :autocomplete="props.autocomplete"
          :style="`text-align:${props.textAlign};`"
          v-model="state.value"
          :disabled="props.disabled"
          @focus="onFocus"
          @blur="onBlur"
          @input="onInput"
          @keydown.enter="emit('keydownEnter')"
        />
      </div>
    </div>
    <div class="FormControlIcon" data-sep="left" data-icon="warn" @click="iconEventShowWarn" v-if="props.warn != ''">
    </div>
  </div>
</template>

<script lang="ts" src="./vc-textbox-script.ts"></script>

<style lang="scss" scoped>

</style>
