<template>
  <div
    class="FormControlCheck"
    :class="[
      String(props.class),
      {
        disabled: props.disabled,
        activate: state.isActivate,
        diff: props.diff !== undefined && props.diff !== props.data && !(props.diff == null && props.data === 0),
      },
    ]"
    @click.stop="switchValue"
  >
    <input type="checkbox" class="checkbox" @blur="state.isActivate = false" @focus="state.isActivate = true" />
    <div class="FormControlCheck-Box" :class="{ 'check-on': props.data == 1 }"></div>
    <div class="FormControlCheck-Text">{{ props.placeholder }}</div>
  </div>
</template>

<script lang="ts" src="./vc-check-box-script.ts"></script>

<style lang="scss" scoped>
</style>
