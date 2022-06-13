<template>
  <div
    class="FormControl"
    :class="[
      String(props.class),
      {
        disabled: props.disabled,
        diff: props.diff !== undefined && props.diff !== props.data,
        hasWarn: props.warn != '',
        activate: state.isActivate,
      },
    ]"
  >
    <div class="FormControlBody">
      <div class="FormControlLabel" v-if="{ isShow: props.require == true || props.placeholder.length > 0 }">
        <div class="FormControlLabel--Placeholder">{{ props.placeholder }}</div>
        <div class="FormControlLabel--Icon-Require" v-if="props.require == true">必須</div>
      </div>
      <div class="FormControlInput">
        <input
          type="text"
          class="input"
          ref="elmInput"
          maxlength="20"
          v-model="state.value"
          :disabled="props.disabled"
          @keypress="onKeypress"
          @focus="onFocus"
          @blur="onBlur"
          @input="onInput"
        />
        <div class="valuebox-unit">{{ props.unit }}</div>
      </div>
    </div>
    <div class="FormControlIcon" data-sep="left" data-icon="warn" @click="iconEventShowWarn" v-if="props.warn != ''">
    </div>
  </div>
</template>

<script lang="ts" src="./vc-valuebox-script.ts"></script>

<style lang="scss" scoped>
// .form-control-inner {
//   align-items: center;
//   user-select: none;
// }

.FormControl .FormControlBody .FormControlInput {
  display: flex;
  justify-content: center;
  align-items: center;

  .input {
    text-align: right;
    flex: 1 1 auto;
  }
}

.valuebox-unit {
  flex: 0 0 auto;
  color: #696969;
  align-items: flex-end;
  margin: 6px 6px 0 6px;
  font-size: 0.8em;
  user-select: none;
}
</style>
