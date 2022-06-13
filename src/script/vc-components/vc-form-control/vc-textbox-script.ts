import { defineComponent, computed, watch, reactive, ref, onMounted ,PropType} from 'vue';

import { ComConvert } from '@/script/com/com-convert';
type Props = {
  //Textボックス関連要素
  textAlign: 'left'|'center'|'right';
  type: string;
  autocomplete: string;
  maxLen: number;
  // maxLenTypeByte:boolean;
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
    //Form系コントロール
    textAlign: {
      type: String as PropType<'left' |'center' |'right'>,
      required: false,
      default: 'left',
    },
    type: {
      type: String,
      required: false,
      default: 'text',
    },
    autocomplete: {
      type: String,
      required: false,
      default: 'off',
    },

    maxLen: {
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
  emits: ['valueChange', 'update:data','warn','keydownEnter'],
  setup(props, { emit }) {
    const elmInput = ref<HTMLInputElement>();

    interface State {
      value: string;
      isActivate: boolean;
      error: string;
    }
    const state = reactive<State>({
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

    //親コンポーネントからの値操作時の処理
    const setValue = (val: string | null) => {
      if (val === null) {
        //文字列型はnullを許容しないルールとします
        //※親コンポーネントへ「空文字」として返却
        updateValue('');
      } else {
        //文字数が
        if (props.maxLen === 0 || val.length <= props.maxLen) {
          state.value = val;
        } else {
          //文字数のオーバーフロー確定
          //親コンポーネントへの更新処理に移動
          updateValue(val);
        }
      }
    };


    //更新を親コンポーネントに伝える
    const updateValue = (text: string | null) => {
      const before=props.data;
      // console.log(updateValue);
      let setText='';
      if (text  === null) {
        setText= '';
      } else {
        if (props.maxLen  === 0 || text.length <= props.maxLen) {
          setText = text;
        } else {
          setText = ComConvert.CutLen(text, props.maxLen, '');
        }
      }
      state.value =setText;
      emit('update:data',setText);
      emit('valueChange',setText,before);
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
      // computedIsShowMaxLenMessage,
      onBlur,
      dataDelete,
      dataRedo,
      onFocus,
      onInput,
      //アイコン系イベント
      iconEventRedo,
      iconEventDelete,
      iconEventShowWarn,
      emit,
    };
  },
});
