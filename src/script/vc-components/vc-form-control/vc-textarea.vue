<template>
  <div
    class="FormControl"
    :class="[String(props.class), { disabled: props.disabled, diff: computedIsChange, hasWarn: props.warn != '', activate: state.isActivate }]"
  >
    <div class="FormControlBody">
      <div class="FormControlLabel" v-if="{ isShow: props.require == true || props.placeholder.length > 0 || props.maxLen > 0 }">
        <div class="FormControlLabel--Placeholder">{{ props.placeholder }}</div>
        <div class="FormControlLabel--Icon-Require" v-if="props.require == true">必須</div>
        <div class="FormControlLabel--Icon-RowMessage" :data-last="props.maxRows - state.value.split('\n').length" :data-maxLen="props.maxRows">
          {{ state.value.split('\n').length }} / {{ props.maxRows }} 行
        </div>
        <div class="FormControlLabel--Icon-lenMessage" :data-last="props.maxLen - state.value.length" :data-maxLen="props.maxLen">
          {{ state.value.length }} / {{ props.maxLen }} 文字
        </div>
      </div>
      <div class="FormControlInput">
        <textarea
          ref="elmInput"
          type="text"
          :rows="props.rows-1"
          :disabled="props.disabled"
          v-model="state.value"
          @focus="onFocus"
          @blur="onBlur"
          @input="onInput"
        />
      </div>
    </div>
    <div class="FormControlIcon" data-sep="left" data-icon="warn" @click="iconEventShowWarn" v-if="props.warn != ''">
    </div>
  </div>
</template>

<script lang="ts" src="./vc-textarea-script.ts"></script>

<style lang="scss" scoped>
$color-back-disabled: #f3f3f3;
.FormControl {
  .FormControlBody {
    ::-webkit-scrollbar {
      width: 6px;
      cursor: pointer;
    }

    /*スクロールバーの軌道*/
    ::-webkit-scrollbar-track {
      border-radius: 3px;
      margin-top: 3px;
      margin-bottom: 0px;
    }

    /*スクロールバーの動く部分*/
    ::-webkit-scrollbar-thumb {
      background-color: rgba(4, 40, 65, 0.5);
      border-radius: 3px;
    }
    .FormControlInput {
      ::-webkit-resizer {
        display: none;
        background-color: white;
        height: 2px !important;
      }
      textarea {
        resize: vertical;
        overflow-y: scroll;
        line-height: 1.2em !important;
        min-height: 2em;
        white-space: pre;
        overflow-wrap: normal;
        overflow-x: auto;
      }
    }

    //サイズ変更のつまみ
    .FormControlInput::after {
      position: absolute;
      bottom: 0px;
      right: 0px;
      width: 18px;
      height: 14px;
      content: '\f338';
      font-family: 'Font Awesome 5 Free';
      font-weight: 900;
      pointer-events: none;
      text-align: right;
      font-size: 10px;
      padding-right: 2px;
      color: #e26f2c;
       @media screen and (min-width: #{ 0 }px) and (max-width: #{ 600 - 0.1}px) {
      opacity: 0;
  }


    }


  }

  &.disabled {
    .FormControlInput {
      ::-webkit-resizer {
        background: $color-back-disabled;
      }
    }
  }
}
</style>
