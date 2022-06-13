<template>
  <div
    class="dialogContainer"
    :class="{ closed: !props.data.isShow, isShowCancel: props.data.dialogOption.isShowCancel }"
    :style="{ 'z-index': props.data.zindex }"
  >
    <div class="dialogBase" @click.stop="chancel" v-show="props.data.isShow"></div>
    <div class="dialogCardContainer" @click.stop="">
      <div class="dialogCard">
        <div class="dialogCard--header">
          <div class="title">{{ props.data.title }}</div>
          <button type="button" class="dialogButton closeBtn" @click.stop="chancel" v-if="props.data.dialogOption.isShowCancel">
            <i class="fas fa-times"></i> {{ props.data.dialogOption.cancelTitle }}
          </button>
        </div>
        <div class="dialogCard--body">
          <div class="message">{{ props.data.message }}</div>
          <div class="btnContainer">
            <button
              class="dialogButton resultBtn"
              :style="{ order: props.data.dialogOption.isRightBottonYes == true ? 0 : 1 }"
              v-if="props.data.dialogOption.isShowNo"
              @click.stop="props.data.noClick()"
            >
              {{ props.data.dialogOption.noTitle }}
            </button>
            <button
              class="dialogButton resultBtn"
              :style="{ order: props.data.dialogOption.isRightBottonYes == true ? 1 : 0 }"
              v-if="props.data.dialogOption.isShowYes"
              @click.stop="props.data.yesClick()"
            >
              {{ props.data.dialogOption.yesTitle }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./vc-dialog-script"></script>

<style lang="scss" scoped>
$base-color-modal: rgba(0, 0, 0, 0.253);

.dialogContainer {
  overflow: visible;
  position: fixed;
  width: 0;
  height: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  opacity: 1;
  will-change: opacity;
  animation-name: hidden;
  animation-duration: 200ms;
  animation-iteration-count: 1;
  animation-direction: reverse;

  &.closed {
    opacity: 0;
    display: none;
    animation-direction: normal;
  }

  @keyframes hidden {
    0% {
      display: fixed;
      opacity: 1;
    }

    99% {
      display: none;
    }

    100% {
      display: none;
      opacity: 0;
    }
  }

  &.isShowCancel {
    > .dialogBase {
      cursor: pointer;
    }
  }

  > .dialogCardContainer,
  > .dialogBase {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  }

  > .dialogBase {
    z-index: 1;
    background-color: $base-color-modal;
  }

  .dialogCardContainer {
    padding: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
  }
}

//ここから実際のダイアログ領域
//color
$default: (
  '-': #000,
  'outline': #ffffff,
  'closeBtnLineColor': #ffffff,
  'closeBtnBackColor': #447aca,
  'closeBtnForeColor': #ffffff,
  'resultBtnLineColor': #264b99,
  'resultBtnBackColor': #287af5,
  'resultBtnForeColor': #ffffff,
  'headerBackColor': #447aca,
  'headerForeColor': #ffffff,
  'bodyBackColor': #f0ebe6,
  'bodyForeColor': #333333,
  'boxshadow': 1px 1px 6px 1px rgba(33, 62, 144, 0.5),
);

$themes-color: (
  '': $default,
  '.defalut': $default,
);

@each $name, $theme in $themes-color {
  .dialogCard#{$name} {
    border: solid 2px map-get($theme, 'outline');
    box-shadow: map-get($theme, 'boxshadow');
    background-color: map-get($theme, 'bodyBackColor');

    .dialogCard--header {
      background-color: map-get($theme, 'headerBackColor');
      color: map-get($theme, 'headerForeColor');

      .closeBtn {
        border-color: map-get($theme, 'closeBtnLineColor');
        background-color: map-get($theme, 'closeBtnBackColor');
        color: map-get($theme, 'closeBtnForeColor');

        &:hover {
          background-color: lighten(map-get($theme, 'closeBtnBackColor'), 10%);
        }

        &:focus,
        &:active {
          background-color: lighten(map-get($theme, 'closeBtnBackColor'), 20%);
        }
      }
    }

    .dialogCard--body {
      background-color: map-get($theme, 'bodyBackColor');
      color: map-get($theme, 'bodyForeColor');

      .resultBtn {
        border-color: map-get($theme, 'resultBtnLineColor');
        background-color: map-get($theme, 'resultBtnBackColor');
        color: map-get($theme, 'resultBtnForeColor');

        &:hover {
          background-color: lighten(map-get($theme, 'resultBtnBackColor'), 10%);
        }

        &:focus,
        &:active {
          background-color: lighten(map-get($theme, 'resultBtnBackColor'), 20%);
        }
      }
    }
  }
}

.dialogCard {
  position: relative;
  // min-width: 300px;
  width: auto;
  height: auto;

  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;

  width: 650px;

  @media screen and (min-width: #{ 0 }px) and (max-width: #{ 500 - 0.1}px) {
    width: 300px;
  }

  @media screen and (min-width: #{ 500 }px) and (max-width: #{ 700 - 0.1}px) {
    width: 450px;
  }

  @media screen and (min-width: #{ 700 }px) and (max-width: #{ 1000 - 0.1}px) {
    width: 650px;
  }

  .dialogCard--header {
    position: relative;
    width: 100%;
    height: auto;
    min-height: 52px;
    flex-grow: 0;
    padding: 6px 12px;

    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;

    .title {
      position: relative;
      flex-grow: 1;
      flex-shrink: 1;
      width: auto;
      padding: 3px 18px 3px 0;
      font-size: 18px;
      white-space: pre-line;
      line-height: 20px;
    }
  }

  .dialogCard--body {
    position: relative;
    width: 100%;
    height: auto;
    flex-grow: 1;
    padding: 18px 12px;

    .message {
      padding: 0px 0px 18px 0px;
      font-size: 16px;
      white-space: pre-line;
      line-height: 18px;
    }

    .btnContainer {
      padding: 0px 0px 0px 0px;
      font-size: 16px;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: space-between;
    }
  }
}

.dialogButton {
  flex-grow: 0;
  flex-shrink: 0;
  position: relative;
  font-size: 18px;
  font-weight: normal;
  padding-left: 12px;
  padding-right: 12px;

  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  text-align: center;

  width: auto;
  height: auto;
  min-height: 40px;
  min-width: 50px;
}
</style>
