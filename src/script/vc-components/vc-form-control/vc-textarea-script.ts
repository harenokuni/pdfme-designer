import { defineComponent,nextTick,computed, watch, reactive, ref, onMounted } from 'vue';

import { ComConvert } from '@/script/com/com-convert';
// [ 共通コンポーネント用 ]--------------------------------------------------------
type Props = {
  rows: number;
  maxRows: number;
  maxLen: number;
  //Form系コントロール統一要素
  placeholder: string;
  class: string;
  disabled: boolean;
  require: boolean;
  data: string | null;
  diff: string | null | undefined;
  warn: string;
};
export default defineComponent({
  props: {
    rows: {
      type: Number,
      required: false,
      default: 1,
    },
    maxRows: {
      type: Number,
      required: false,
      default: 0,
    },

    maxLen: {
      type: Number,
      required: false,
      default: 0,
    },

    //Form系コントロール
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
      type: String,
      required: false,
      default: null,
    },
    diff: {
      type: String,
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
  emits: ['valueChange', 'update:data', 'warn'],
  setup(props, { emit }) {
    const elmInput = ref<HTMLInputElement>();

    interface IState {
      value: string;
      isActivate: boolean;
      error: string;
    }
    const state = reactive<IState>({
      value: '',
      isActivate: false,
      error: '',
    });

    watch(
      () => props.data,
      () => {
        setValue(props.data);
      }
    );

    onMounted(() => {
      setValue(props.data);
    });

    const setValue = (text: string | null) => {
      if (text === null) {
        //文字列型はnullを許容しないルールとします
        //※親コンポーネントへ「空文字」として返却
        updateValue('');
      } else {
        //文字数が
        const lineCheckedText = getCheckedText(text);
        if (lineCheckedText === text) {
          state.value = text;
        } else {
          //文字数のオーバーフロー確定
          //親コンポーネントへの更新処理に移動
          updateValue(text);
        }
      }
    };

    const getCheckedText = (text: string) => {
      // 各行を配列の要素に分ける
      let ret=text;
      if (props.maxRows != 0) {
        const lines = text.split('\n');
        let amari = '';
        // 入力行数が制限を超えた場合
        if (lines.length > props.maxRows) {
          const result = [];
          for (let i = 0; i < lines.length; i++) {
            if (i < props.maxRows) {
              result.push(lines[i]);
            } else {
              amari += lines[i].replace(/\n/g, '');
            }
          }
          ret= result.join('\n') + amari;
        }
      }

      if (props.maxLen !== 0 || ret.length > props.maxLen) {
        ret = ComConvert.CutLen(ret, props.maxLen, '');
      }
      return ret;
    };

    //更新を親コンポーネントに伝える
    const updateValue = (text: string | null) => {
      const before=props.data;
      let setText = '';
      if (text === null) {
        setText = '';
      } else {
        // 各行を配列の要素に分ける
        setText = getCheckedText(text);
      }
      state.value = setText;
      emit('update:data', setText);
      nextTick(() => {
        emit('valueChange', setText, before);
      });
    };

    //-------------------------------
    //アイコン系イベント
    const dataRedo = () => {
      if (props.diff===undefined||props.disabled == true) {
        return;
      }
      updateValue(props.diff);
    };
    const dataDelete = () => {
      if (props.disabled == true) {
        return;
      }
      if (state.value != null) {
        updateValue('');
      }
    };
    //-------------------------------
    //更新の有無確認
    const computedIsChange = computed(() => {
      if (props.diff === undefined) return false;
      if (props.diff == null && props.data === '') return false;
      if (props.diff == '' && props.data === null) return false;
      if (props.diff !== props.data) return true;
      return false;
    });

    //-------------------------------
    //イベント
    const onFocus = () => {
      state.isActivate = true;
    };

    const onInput = () => {
      updateValue(state.value);
    };

    const onBlur = () => {
      state.isActivate = false;
    };
    //--------------------------------------------------------------
    //アイコン系イベント
    const iconEventRedo = () => {
      if (props.diff===undefined||props.disabled == true) {
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
      emit('warn',props.warn);
    };
    //--------------------------------------------------------------

    return {
      computedIsChange,
      props,
      state,
      elmInput,
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
