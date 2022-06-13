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
    <div class="FormControlIcon" data-sep="right" data-icon="calendar" @click.stop="datePickerShow">
      <input ref="elm" type="text" class="flatpickrBody" @keydown="keyDown" :disabled="props.disabled" />
    </div>
    <div class="FormControlBody">
      <div class="FormControlLabel" v-if="props.require == true || props.placeholder.length > 0">
        <div class="FormControlLabel--Placeholder" @click.stop="datePickerShow">{{ props.placeholder }}</div>
        <div class="FormControlLabel--Icon-Require" v-if="props.require == true">必須</div>
      </div>
      <div class="FormControlInput" :class="['pos-' + props.textAlign]" @click.stop="datePickerShow">
        <span>{{ state.text }}</span>
        <div v-if="props.data === null" @click.stop="datePickerToday" class="today">Today?</div>
      </div>
    </div>
    <div class="FormControlIcon" data-sep="left" data-icon="delete" @dblclick.stop="" @click.stop="iconEventDelete" v-if="!props.hideDeleteBtn"></div>
    <div class="FormControlIcon" data-sep="left" data-icon="warn" @dblclick.stop="" @click.stop="iconEventShowWarn" v-if="props.warn != ''"></div>
  </div>
</template>

<script lang="ts" src="./vc-datepicker-script.ts"></script>

<style lang="scss" scoped>
.FormControl {
  cursor: pointer;
  &.disabled {
    cursor: default;
  }

  .flatpickrBody {
    position: absolute;
    opacity: 0 !important;
    top: 0px;
    height: 40px;
    height: 100%;
    width: 40px;
    left: 0;
    z-index: -1;
    pointer-events: none;
  }
}

.FormControl:deep(.flatpickr-mobile) {
  position: absolute;
  opacity: 0;
}
.today {
  margin: 0 0 0 4px;
  border-radius: 4px;
  border: solid 1px #f68708;
  background-color: rgb(255, 246, 237);
  color: #e26f2c;
  font-size: 12px;
  padding: 2px 4px;
}

.pos-left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.pos-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.pos-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
