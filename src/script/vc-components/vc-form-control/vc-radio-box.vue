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
      <div class="FormControlInput" :style="computedStyleMaxRow">
        <template v-if="props.config.isNullable">
          <div class="form-radio" :class="{ disabled: props.disabled }">
            <input
              type="radio"
              :name="`radio${uid}`"
              :id="`radio${uid}-null`"
              v-bind:value="nullValue"
              v-model="state.value"
              @blur="state.isActivate = false"
              @focus="state.isActivate = true"
              :disabled="props.disabled"
            />
            <label class="radio-label-mark" :class="{ checked: state.value == nullValue }" :for="`radio${uid}-null`"></label>
            <label class="radio-label" :for="`radio${uid}-null`">{{ props.config.nullText }}</label>
          </div>
        </template>
        <template v-for="(item) in props.config.list"  :key="item.id">
          <div class="form-radio" :class="{ disabled:props.disabled }">
            <input
              type="radio"
              :name="`radio${uid}`"
              :id="`radio${uid}-${item.id}`"
              :value="item.id"
              v-model="state.value"
              @blur="state.isActivate = false"
              @focus="state.isActivate = true"
              :disabled="props.disabled"
            />
            <label class="radio-label-mark" :class="{ checked: state.value == item.id }" :for="`radio${uid}-${item.id}`"></label>
            <label class="radio-label" :for="`radio${uid}-${item.id}`">{{ item.text }}</label>
          </div>
        </template>
      </div>
    </div>
    <div class="FormControlIcon" data-sep="left" data-icon="warn" @click="iconEventShowWarn" v-if="state.notExistMessage + props.warn != ''"></div>
  </div>
</template>

<script lang="ts" src="./vc-radio-box-script.ts"></script>

<style lang="scss" scoped>
$color1: #f4f4f4;
$color2: #3197ee;
.FormControl {
  .FormControlInput {
    user-select: none;
    display: flex;
    flex-wrap: wrap;
  }
}

.form-radio {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 0 6px 0 6px;
  margin-top: 0.2em;
  margin-bottom: 0.2em;
  line-height: 1em;

  > .radio-label,
  > .radio-label-mark {
    line-height: 1em;
    cursor: pointer;
  }

  &.disabled {
    cursor: default;

    > .radio-label,
    > .radio-label-mark {
      cursor: default;
    }
  }

  input[type='radio'] {
    position: absolute;
    opacity: 0;
    width: 0;
  }

  .radio-label-mark {
    position: relative;
    justify-content: flex-start;
    flex: 0 0 auto;
    width: 18px;
    height: 18px;
    border-radius: 100%;
    background: $color1;
    border: 1px solid darken($color1, 25%);
    margin-right: 3px;

    &:before {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 12px;
      height: 12px;

      content: '';
      background: $color1;
      border-radius: 100%;
      transition: all 250ms ease;
    }

    &.checked {
      &:before {
        background: $color2;
      }
    }
  }

  input[type='radio']:focus {
    + .radio-label-mark {
      &:before {
        outline: none;
        border-color: $color2;
      }
    }
  }

  .radio-label {
    flex: 1 1 auto;
  }
}
</style>
