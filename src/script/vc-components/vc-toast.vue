<template>
  <div class="toastListContainer" v-show="state.toastMessageList.length != 0" :style="{ 'z-index': props.data.zindex }">
    <div class="toastItem" :class="[item.theme]" :key="index" v-for="(item, index) in state.toastMessageList">
      <div class="toastItem-body">
        <div class="toastItem--col1">
          <span class="toastItem-icon"></span>
        </div>
        <div class="toastItem--col2">
          <div class="toastItem--title" v-html="item.title"></div>
          <div class="toastItem--message" v-html="item.message"></div>
        </div>
        <div class="toastItem--col3" @click.stop="hide(item)">
          <i class="fas fa-times"></i>
        </div>
      </div>
      <div class="toastItem--barContainer" v-if="item.hideAfter != 0">
        <div class="toastItem--bar" :style="berWidth(index)"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./vc-toast-script"></script>

<style lang="scss" scoped>
//color
$default: (
  '-': #000,
  'iconDisplay': none,
  'icon': '',
  'iconColor': #ffffff,
  'outline': #ffffff,
  'bg': #f0ebe6,
  'title': #222222,
  'message': #333333,
  'closeBtn': #666666,
  'bar': #47465f,
  'boxshadow': 2px 2px 6px 5px rgba(119, 131, 149, 0.781),
);

$success: (
  '-': #000,
  'iconDisplay': flex,
  'icon': '\f00c',
  'iconColor': #ffffff,
  'outline': #ffffff,
  'bg': #5eac5e,
  'closeBtn': #ffffff,
  'title': #ffffff,
  'message': #ffffff,
  'bar': #ffffff,
  'boxshadow': 2px 2px 6px 5px rgba(64, 226, 77, 0.781),
);

$info: (
  '-': #000,
  'iconDisplay': flex,
  'icon': '\f05a',
  'iconColor': #ffffff,
  'outline': #ffffff,
  'bg': #429db6,
  'closeBtn': #ffffff,
  'title': #ffffff,
  'message': #ffffff,
  'bar': #ffffff,
  'boxshadow': 2px 2px 6px 5px #17b1c5c7,
);

$warning: (
  '-': #000,
  'iconDisplay': flex,
  'icon': '\f12a',
  'iconColor': #ffffff,
  'outline': #ffffff,
  'bg': #d39014,
  'closeBtn': #ffffff,
  'title': #ffffff,
  'message': #ffffff,
  'bar': #ffffff,
  'boxshadow': 2px 2px 6px 5px #ffdd1dc7,
);

$error: (
  '-': #000,
  'iconDisplay': flex,
  'icon': '\f071',
  'iconColor': #ffffff,
  'outline': #ffffff,
  'bg': #c85c56,
  'closeBtn': #ffffff,
  'title': #ffffff,
  'message': #ffffff,
  'bar': #ffffff,
  'boxshadow': 2px 2px 6px 5px #ff771dc7,
);

$themes-color: (
  '': $default,
  '.defalut': $default,
  '.success': $success,
  '.info': $info,
  '.warning': $warning,
  '.error': $error,
);

@each $name, $theme in $themes-color {
  .toastItem#{$name} {
    border: solid 2px map-get($theme, 'outline');
    background-color: map-get($theme, 'bg');
    box-shadow: map-get($theme, 'boxshadow');

    .toastItem--col1 {
      display: map-get($theme, 'iconDisplay');

      > .toastItem-icon::after {
        content: '#{map-get($theme, 'icon')}';
        color: map-get($theme, 'iconColor');
      }
    }

    .toastItem--col2 {
      .toastItem--title {
        color: map-get($theme, 'title');
      }

      .toastItem--message {
        color: map-get($theme, 'message');
      }
    }

    .toastItem--col3 {
      color: map-get($theme, 'closeBtn');
    }

    .toastItem--bar {
      background-color: map-get($theme, 'bar');
    }
  }
}

.toastListContainer {
  position: fixed;
  left: 0;
  right: 0;
  margin: auto;
  height: auto;
  transform: translateY(100px);

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

  //表示
  .toastItem {
    position: relative;
    margin-bottom: 12px;

    > .toastItem-body {
      position: relative;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: stretch;

      .toastItem--col1 {
        position: relative;
        width: 40px;
        flex-grow: 0;
        justify-content: center;
        font-size: 22px;
        align-items: center;
        padding: 0 0 0 10px;

        > .toastItem-icon::after {
          font-family: 'Font Awesome 5 Free';
          font-weight: 900;
        }
      }

      .toastItem--col2 {
        position: relative;
        width: 50px;
        flex-grow: 1;
        padding: 10px 5px 10px 10px;

        .toastItem--title {
          position: relative;
          font-size: 18px;
          // font-weight: bold;
          white-space: pre-line;
        }

        .toastItem--message {
          position: relative;
          font-size: 16px;
          white-space: pre-line;
        }
      }

      .toastItem--col3 {
        position: relative;
        width: 50px;
        flex-grow: 0;
        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
        padding: 5px 10px 0 0;
        cursor: pointer;
        font-size: 22px;
      }
    }

    > .toastItem--barContainer {
      padding: 3px 6px 3px 6px;

      > .toastItem--bar {
        position: relative;
        height: 6px;
        width: 0px;
        transition: width 50ms;
        will-change: width;
        border-radius: 3px;
      }
    }
  }
}
</style>
