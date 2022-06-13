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
      <div class="FormControlLabel">
        <div class="FormControlLabel--Placeholder">{{ props.placeholder }}</div>
        <div class="FormControlLabel--Icon-Require" v-if="props.require == true">必須</div>
      </div>
      <!-- PC用 -->
      <div class="FormControlInput" v-if="state.isSpMode == false">
        <div class="icon-pulldown" v-if="!props.hidePulldown"></div>
        <select
          ref="selectbox"
          :style="`text-align:${props.textAlign};`"
          v-show="state.isSpMode == false"
          :disabled="props.disabled"
          v-model="state.value"
          @change="selectedChenge"
          @blur="state.isActivate = false"
          @focus="state.isActivate = true"
        >
          <!-- :class="[{ hasLabel: props.placeholder.length != 0, disabled: props.disabled }]" -->
          <option v-bind:value="nullValue" v-if="props.config.isNullable">
            {{ props.config.nullText }}
          </option>
          <option v-for="item in props.config.list" :value="item.id" :key="item.id">
            {{ item.text }}
          </option>
        </select>
      </div>
      <!-- SP用 -->
      <div
        class="FormControlInput"
        v-if="state.isSpMode == true"
        :style="`
        ${props.textAlign == 'left' ? 'justify-content: flex-start;' : ''}
        ${props.textAlign == 'right' ? 'justify-content: flex-end;' : ''}
        ${props.textAlign == 'center' ? 'justify-content: center;' : ''}`"
        @click="showSelectBoxModal"
      >
        <div class="icon-pulldown" v-if="!props.hidePulldown"></div>
        <div class="" :class="[{ hasLabel: props.placeholder.length != 0, disabled: props.disabled }]">
          {{ state.valueText }}
        </div>
      </div>
    </div>
    <div
      class="FormControlIcon"
      data-sep="left"
      data-icon="warn"
      @click="iconEventShowWarn"
      v-if="state.notExistMessage + props.warn != ''"
    ></div>
  </div>
</template>

<script lang="ts" src="./vc-select-box-script.ts"></script>

<style lang="scss" scoped>
$color-warn: #eb0000;
$color-action: #e26f2c;
$color-diff: #e65d0e;

.FormControl {
  .FormControlInput {
    user-select: none;
  }

  select,
  .FormControlInput {
    cursor: pointer;
  }

  .icon-pulldown {
    position: absolute;
    width: 50px;
    height: 100%;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    font-size: 22px;
    &::after {
      display: block;
      position: relative;
      font-family: 'Font Awesome 5 Free';
      font-weight: 900;
      overflow: visible;
      content: '\f107';
      color: $color-action;
    }
  }

  &.disabled {
    select,
    .FormControlInput {
      cursor: default;
    }
    .icon-pulldown::after {
      color: inherit;
    }
  }
}

.FormControlInput {
  cursor: pointer;

  &.disabled {
    cursor: default;
    .icon-pulldown::after {
      color: #ffffff !important;
    }
  }
}
</style>
