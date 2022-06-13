<template>
  <div
    class="FormControl"
    :class="[
      String(props.class),
      {
        disabled: props.disabled,
        activate: state.isActivate,
        diff: props.diff !== undefined && props.diff !== props.data,
      },
    ]"
    @click.stop="switchValue"
  >
    <div class="FormControlBody">
      <div class="FormControlLabel" v-if="{ isShow: props.require == true || props.placeholder.length > 0 }">
        <div class="FormControlLabel--Placeholder">{{ props.placeholder }}</div>
        <div class="FormControlLabel--Icon-Require" v-if="props.require == true">必須</div>
      </div>
      <div class="FormControlInput">
        <input
          :class="{ activate: state.isActivate }"
          :checked="state.value"
          type="checkbox"
          @blur="state.isActivate = false"
          @focus="state.isActivate = true"
          :disabled="props.disabled"
          ref="elmInput"
        />
        <label
          class="toggle-label"
          v-if="leftLabel.length != 0"
          v-html="leftLabel"
          :class="{ onLeft: !props.data }"
        ></label>
        <div class="toggle-body" :class="{ on: props.data }"></div>
        <label
          class="toggle-label"
          v-if="rightLabel.length != 0"
          v-html="rightLabel"
          :class="{ onRight: props.data }"
        ></label>
      </div>
    </div>
    <div
      class="FormControlIcon"
      data-sep="left"
      data-icon="warn"
      @click.stop="iconEventShowWarn"
      v-if="props.warn != ''"
    ></div>
  </div>
</template>

<script lang="ts" src="./vc-toggle-switch-script.ts"></script>

<style lang="scss" scoped>
.FormControl {
  cursor: pointer;
  &.disabled {
    cursor: default;
    .toggle-body.on {
      background-color: #577aa8 !important;
      &::after {
        background-color: #dddfe4 !important;
      }
    }
    .toggle-body::after {
      background-color: #dddfe4 !important;
    }
  }

  input[type='checkbox'] {
    position: absolute;
    opacity: 0;
    z-index: -1;
  }

  .FormControlInput {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 12px;

    .toggle-body {
      margin: 0 6px;
      width: 38px;
      height: 21px;
      border-radius: 10px;
      border: solid 1px #000;
      background-color: #d3ffcf;
      background-color: #cfecff;
      padding: 1px;
      &::after {
        position: absolute;
        content: '';
        top: 1px;
        width: 17px;
        height: 17px;
        border-radius: 10px;
        border: solid 1px #3b3b3b;
        transition: left 200ms;
        will-change: left;
        background-color: rgb(255, 255, 255);
        left: 0px;
      }

      &.on {
        background-color: #1768d3;
        &::after {
          background-color: rgb(255, 255, 255);
          left: 19px;
        }
      }
    }

    .toggle-label {
      user-select: none;
      pointer-events: none;
      line-height: 1em;
      border-bottom: 2px solid transparent;

      &.onLeft {
        border-bottom: 2px solid #6c7075;
      }

      &.onRight {
        border-bottom: 2px solid #1c8b36;
        border-bottom: 2px solid #1768d3;
      }
    }
  }
}
</style>
