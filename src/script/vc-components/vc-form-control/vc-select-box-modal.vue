<template>
  <div
    class="selectBoxModalContainer"
    @click.stop="props.data.cancel"
    :class="{ closed: !props.data.isShow }"
    :style="{ 'z-index': props.data.zindex }"
  >
    <div class="selectBoxModalBackground" @click.stop="props.data.cancel"></div>
    <div class="selectBoxModal">
      <div class="selectBoxModal--header" @click.stop="">
        {{ props.data.selectConfig.title }}
        <i class="fas fa-times" @click.stop="props.data.cancel"></i>
      </div>
      <div class="selectBoxModal--listGroup" ref="scrollElement">
        <div
          class="selectBoxModal--item nullValue"
          :class="{ activate: null == props.data.value }"
          @click="clickItem(null, props.data.selectConfig.nullText )"
          v-if="props.data.selectConfig.isNullable"
        >
          <div class="spListItemChecked"><i class="fas fa-check" v-if="null == props.data.value"></i></div>
          <div class="spListItemValue">{{ props.data.selectConfig.nullText }}</div>
        </div>
        <div
          v-for="(item, index) in props.data.selectConfig.list"
          :key="index"
          class="selectBoxModal--item"
          :class="{ activate: item.id == props.data.value }"
          @click="clickItem(item.id,item.text)"
        >
          <div class="spListItemChecked"><i class="fas fa-check" v-if="item.id == props.data.value"></i></div>
          <div class="spListItemValue">{{ item.text }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./vc-select-box-modal-script.ts"></script>


<style lang="scss" >
$base-color-modal: rgba(0, 0, 0, 0.411);

.selectBoxModalContainer {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  animation-duration: 400ms;
  animation-iteration-count: 1;

  &.closed {
    opacity: 0;
    display: none;
  }

  &:not(.closed) {
    display: flex;
    opacity: 1;
    animation-name: fade-in;
  }

  .selectBoxModalBackground {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: $base-color-modal;
  }

  //--------------------------
  /*スクロールバー ※Chrome Edge 限定*/
  ::-webkit-scrollbar {
    width: 6px;
  }

  /*スクロールバーの軌道*/
  ::-webkit-scrollbar-track {
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
    box-shadow: inset 0 0 6px 2px rgba(31, 31, 58, 0.3);
    margin-top: 3px;
    margin-bottom: 3px;
  }

  /*スクロールバーの動く部分*/
  ::-webkit-scrollbar-thumb {
    background-color: rgba(4, 40, 65, 0.5);
    border-radius: 10px;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3);
  }

  .selectBoxModal {
    position: relative;
    width: calc(100% - 20px);
    height: calc(100% - 40px);
    overflow-y: hidden;

    .selectBoxModal--header {
      position: relative;
      width: 100%;
      height: 40px;
      padding: 3px 12px 3px 12px;
      border: solid 1px #ffffff;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      background-color: #447aca;
      color: #ffffff;

      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      -o-user-select: none;
      user-select: none;

      border-top-right-radius: 3px;
      border-top-left-radius: 3px;
    }

    .selectBoxModal--listGroup {
      position: relative;
      width: 100%;
      max-height: calc(100% - 40px);
      background-color: #f8f4f0;
      border-bottom-right-radius: 3px;
      border-bottom-left-radius: 3px;
      border-left: solid 1px #ffffff;
      border-right: solid 1px #ffffff;
      border-bottom: solid 1px #ffffff;
      -webkit-overflow-scrolling: auto;
      overflow-y: scroll;

      .spGroupContainerListGroup--list {
        position: relative;
        height: auto;
      }

      .selectBoxModal--item {
        position: relative;
        height: auto;
        line-height: 1em;
        // background-color: white;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: center;
        background-color: #f8f4f0;

        &:last-child {
          border-bottom-right-radius: 6px;
          border-bottom-left-radius: 6px;
        }

        &:nth-child(n):not(:last-child) {
          border-bottom: solid 1px #c3c3c3;
        }

        &.activate {
          background-color: #f6eadd;
        }

        &.nullValue {
          .spListItemValue {
            color: #062e69;
          }
        }

        &:active {
          background-color: #f1c99d;
        }

        .spListItemChecked {
          width: 30px;
          font-size: 18px;
          flex: 0 0 30px;
          text-align: center;
          color: #1c8b36;
        }

        .spListItemValue {
          width: auto;
          font-size: 16px;
          font-size: auto;
          flex: 1 1 auto;
          padding: 18px 10px 18px 0px;
          line-height: 1.2em;
          color: #555555;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          -o-user-select: none;
          user-select: none;
        }
      }
    }
  }
}
</style>
