//    <VcValuebox
//    placeholder=''
//    :nullable="true"
//    unit="円"
//    validMessage="hoeehoge"
//     v-model:before="state.beforeData.IApiShiharaiIraiDetail.edit.paymentAmount"
//     v-model:value="state.editData.IApiShiharaiIraiDetail.edit.paymentAmount" />

import { defineComponent, watch, onUnmounted, computed, PropType, reactive, ref, onMounted, nextTick } from 'vue';
import { ComConvert } from '@/script/com/com-convert';

type Props = {
  //Valueボックス関連要素
  nullable: boolean;
  unit: string;

  min: number;
  max: number;
  digits: number;
  //Form系コントロール統一要素
  placeholder: string;
  class: string;
  disabled: boolean;
  require: boolean;
  data: number | null;
  diff: number | null | undefined;
  warn: string;
};
export default defineComponent({
  props: {
    //Valueボックス関連要素
    nullable: {
      type: Boolean,
      required: false,
      default: true,
    },
    unit: {
      type: String,
      required: false,
      default: '',
    },
    min: {
      type: Number,
      required: false,
      default: -999999999999999,
    },
    max: {
      type: Number,
      required: false,
      default: 999999999999999,
    },
    digits: {
      type: Number,
      required: false,
      default: 0,
    },
    //Form系コントロール統一要素
    placeholder: {
      type: String,
      required: false,
      default: '',
    },
    class: {
      type: String,
      required: false,
      default: '',
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    data: {
      type: Number,
      required: false,
      default: null,
    },
    diff: {
      type: Number,
      required: false,
      default: undefined,
    },
    warn: {
      type: String,
      required: false,
      default: '',
    },
    require: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ['valueChange', 'update:data', 'onPressEnter', 'onFocus', 'warn'],
  setup(props, { emit }) {
    const elmInput = ref<HTMLInputElement>();

    interface State {
      value: string;
      inputMode: string;
      isActivate: boolean;
      error: string;
    }
    const state = reactive<State>({
      value: '',
      isActivate: false,
      error: '',
      inputMode: 'text',
    });

    const ut = navigator.userAgent;
    //SPモード判定
    const checkDevice = () => {
      if (
        ut.indexOf('iPhone') > 0 ||
        ut.indexOf('iPod') > 0 ||
        (ut.indexOf('Android') > 0 && ut.indexOf('Mobile') > 0)
      ) {
        state.inputMode = 'number';
      } else if (ut.indexOf('iPad') > 0 || ut.indexOf('Android') > 0) {
        state.inputMode = 'number';
      }
    };

    checkDevice();

    watch(
      () => props.data,
      () => {
        const val = ComConvert.FloatNullable(props.data, props.digits);
        setValue(val);
      }
    );
    onMounted(() => {
      const val = ComConvert.FloatNullable(props.data, props.digits);
      setValue(val);
    });

    const setValue = (val: number | null) => {
      // console.log(val)
      const inputValue = getInputValue();
      // console.log('setValue', val, inputValue)
      if (inputValue === val) {
        if (state.isActivate === true) {
          return;
        }
        if (val === null) {
          state.value = '';
        }
      } else {
        if (val == null) {
          if (props.nullable == false) {
            updateValue(null);
            state.value = ComConvert.InserComma(0, props.digits);
          } else {
            state.value = '';
          }
        } else {
          if (val < props.min) {
            state.error = `[${props.min - 1}]以下の数値は入力できません`;
            state.value = ComConvert.InserComma(props.min, props.digits);
            updateValue(props.min);
          } else if (props.max < val) {
            state.error = `[${props.max + 1}]以上の数値は入力できません`;
            state.value = ComConvert.InserComma(props.max, props.digits);
            updateValue(props.max);
          } else {
            state.error = ``;
            state.value = ComConvert.InserComma(val, props.digits);
          }
        }
      }
    };

    //更新を親コンポーネントに伝える
    const updateValue = (val: number | null) => {
      const before = props.data;
      if (val == null) {
        if (props.nullable == false) {
          state.value = '0';
          emit('update:data', 0);
          nextTick(() => {
            emit('valueChange', 0, before);
          });
        } else {
          state.value = '';
          emit('update:data', null);
          nextTick(() => {
            emit('valueChange', null, before);
          });
        }
      } else {
        emit('update:data', val);
        nextTick(() => {
          emit('valueChange', val, before);
        });
      }
    };

    //-------------------------------
    //全角数値を半角数値へ変換する
    const hankakuToZenkaku = (str: string) => {
      return str.replace(/[０-９]/g, (s) => {
        return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
      });
    };
    //-------------------------------
    //Input要素のイベント
    const onFocus = async () => {
      emit('onFocus');
      state.isActivate = true;
      state.value = state.value.replace(/[^(0-9)|(.)|(\-)]+/g, '');
      await nextTick();
      if (elmInput.value) {
        elmInput.value.select();
      }
    };
    const onInput = (e: any) => {
      const val = getInputValue();
      if (val !== props.data) {
        // state.value = ComConvert.InserComma(val, props.digits);
        if (val != null && val < props.min) {
          emit('warn', `[${props.min - 1}]以下の数値は入力できません`);
          state.error = `[${props.min - 1}]以下の数値は入力できません`;
          state.value = ComConvert.InserComma(props.min, props.digits);
          updateValue(props.min);
        } else if (val != null && props.max < val) {
          emit('warn', `[${props.max + 1}]以上の数値は入力できません`);
          state.error = `[${props.max + 1}]以上の数値は入力できません`;
          state.value = ComConvert.InserComma(props.max, props.digits);
          updateValue(props.max);
        } else {
          state.error = ``;
          updateValue(val);
        }
      }
    };
    const onBlur = () => {
      state.isActivate = false;
      const val = getInputValue();
      if (val !== props.data) {
        updateValue(val);
      }
      if (val === null) {
        state.value = '';
      } else {
        state.value = ComConvert.InserComma(val, props.digits);
      }
    };

    const getInputValue = () => {
      if (state.value.length === 0) {
        if (props.nullable === true) {
          return null;
        } else {
          state.value = ComConvert.InserComma(0, props.digits)
          return 0;
        }
      }
      const inputText = hankakuToZenkaku(state.value).replace(/[^(0-9)|(.)|(\-)]+/g, '');
      if (inputText.length != 0) {
        if (props.nullable === true) {
          return ComConvert.FloatNullable(inputText, props.digits);
        } else {
          return ComConvert.Float(inputText, props.digits);
        }
      } else {
        if (props.nullable === true) {
          return null;
        } else {
          return 0;
        }
      }
    };
    //-------------------------------
    //アイコン系イベント
    const dataRedo = () => {
      if (props.diff === undefined || props.disabled == true) {
        return;
      }
      updateValue(props.diff);
    };
    const dataDelete = () => {
      if (props.disabled == true) {
        return;
      }
      if (state.value != null) {
        updateValue(null);
      }
    };
    //--------------------------------------------------------------
    //アイコン系イベント
    const iconEventRedo = () => {
      if (props.diff === undefined || props.disabled == true) {
        return;
      }
      updateValue(props.diff);
    };
    const iconEventDelete = () => {
      if (props.disabled == true) {
        return;
      }
      if (state.value != null) {
        updateValue(null);
      }
    };
    //警告の表示
    const iconEventShowWarn = () => {
      emit('warn', props.warn);
    };

    const onKeypress = (event: any) => {
      try {
        if (event.key === 'Enter') {
          emit('onPressEnter');
        }
      } catch (error) {
        console.log(error)
      }
    };

    //--------------------------------------------------------------

    return {
      props,
      state,
      elmInput,
      onKeypress,
      onBlur,
      dataDelete,
      dataRedo,
      onFocus,
      onInput,
      //アイコン系イベント
      iconEventRedo,
      iconEventDelete,
      iconEventShowWarn,
    };
  },
});
