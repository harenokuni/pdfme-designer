/*------------------------------------------------------------------------------------------------
vc-select-box-script.ts
------------------------------------------------------------------------------------------------*/
//import
// import { } from '@/script/com-components/vc-select-box-script'
//------------------------------------------------------------------------------------------------

//vue
import {
  defineComponent,
  computed,
  reactive,
  watch,
  ref,
  PropType,
  onMounted,
  onUnmounted,
  nextTick,
  setTransitionHooks,
} from 'vue';
// [ Common CommonConv ]---------------------------------------------------
import { ComConvert } from '@/script/com/com-convert';

export interface SelectItem {
  id: number;
  text: string;
}

export class SelectConfig {
  public title: string;
  public defalutValue: number | null = null;
  public isNullable = true;
  public nullText = '[ 未選択 ]';
  public activeOnly = true;
  public list: SelectItem[] = [];

  constructor(
    title = '',
    defalutValue: number | null = null,
    isNullable = true,
    nullText = '[ 未選択 ]',
    activeOnly = true
  ) {
    this.title = title;
    this.defalutValue = defalutValue;
    this.isNullable = isNullable;
    this.nullText = nullText;
    this.activeOnly = activeOnly;
  }

  private isExsit = false;
  public GetIsExsit = () => {
    return this.isExsit;
  };
  public SetIsExsit = (bool: boolean) => {
    this.isExsit = bool;
  };

  // public SelectedText = '';
  // public SetSelectedText = (str: string) => {
  //   console.log(`SetSelectedText str=${str}`);
  //   this.SelectedText = str;
  // };

  public GetSelectedText = (id: number | null) => {
    if (id === null) return this.nullText;
    for (let i = 0; i < this.list.length; i++) {
      if (this.list[i].id == id) {
        return this.list[i].text;
        break;
      }
    }

    return '';
  };
}

type Props = {
  textAlign: string;
  config: SelectConfig;
  modalMode: boolean;
  selectedText: string | null;
  hidePulldown: boolean;
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
    //Form系コントロール
    textAlign: {
      type: String,
      required: false,
      default: 'left',
    },
    modalMode: {
      type: Boolean,
      required: false,
      default: undefined,
    },
    config: {
      type: Object as PropType<SelectConfig>,
      required: true,
    },
    selectedText: {
      type: String,
      default: null,
    },

    hidePulldown: {
      type: Boolean,
      required: false,
      default: false,
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
  emits: ['valueChange', 'update:data', 'update:caption', 'showSelectBoxModal', 'warn'],
  setup(props, { emit }) {
    const nullValue = null;
    const selectbox = ref<HTMLSelectElement>();

    interface State {
      isSpMode: boolean;
      isShowSpList: boolean;
      //FormControl値
      value: null | number;
      valueText: string;

      notExistMessage: string;

      //FormControl状態監視用
      isActivate: boolean;
    }
    const state = reactive<State>({
      isSpMode: false,
      isShowSpList: false,
      notExistMessage: '',
      //FormControl値
      value: null,
      valueText: '',
      //FormControl状態監視用
      isActivate: false,
    });

    const ut = navigator.userAgent;
    //SPモード判定
    const checkDevice = () => {
      if (props.modalMode !== undefined) {
        if (props.modalMode === true) {
          state.isSpMode = true;
          return;
        }
        if (props.modalMode === false) {
          state.isSpMode = false;
          return;
        }
      }
      if (
        ut.indexOf('iPhone') > 0 ||
        ut.indexOf('iPod') > 0 ||
        (ut.indexOf('Android') > 0 && ut.indexOf('Mobile') > 0)
      ) {
        state.isSpMode = true;
      } else if (ut.indexOf('iPad') > 0 || ut.indexOf('Android') > 0) {
        state.isSpMode = true;
      } else {
        state.isSpMode = false;
      }
    };
    checkDevice();

    //PropData監視
    watch(
      () => props.data,
      () => {
        // console.log(`watch props.data=${props.data}`);
        const val = ComConvert.IntNullable(props.data);
        state.value = val;
        setValueText(val);
      }
    );

    onMounted(() => {
      // console.log(`onMounted props.data=${props.data}`);
      const val = ComConvert.IntNullable(props.data);
      state.value = val;
      setValueText(val);
    });

    watch(
      () => props.config.list,
      () => {
        // console.log(`watch props.config.list props.data=${props.data}`);
        const val = ComConvert.IntNullable(props.data);
        setValueText(val);
      }
    );

    //表示されているラベルをPropのConfigに反映させる
    const setValueText = (val: number | null) => {
      let setValueText = '';
      let hasValue = false;
      if (val == null) {
        state.value = null;
        state.valueText = props.config.nullText;
        // props.config.SetSelectedText(props.config.nullText);
        return;
      }
      for (let i = 0; i < props.config.list.length; i++) {
        if (props.config.list[i].id == props.data) {
          hasValue = true;
          setValueText = props.config.list[i].text;
          state.notExistMessage = '';
          break;
        }
      }
      props.config.SetIsExsit(hasValue);
      if (hasValue == true) {
        state.value = val;
        state.valueText = setValueText;
        // props.config.SetSelectedText(setValueText);
        state.notExistMessage = '';
      } else {
        if (val != null) {
          state.notExistMessage = '選択肢に既存登録値が存在しません。\n再選択をお願いします。';
        } else {
          state.notExistMessage = '';
        }
        state.value = null;
        state.valueText = props.config.nullText;
        //親コンポーネントのDataは変更しない
        // props.config.SetSelectedText(props.config.nullText);
      }
    };

    //ユーザーが入力を変更した場合
    const selectedChenge = () => {
      // console.log(`selectedChenge:`);
      // console.log(`props.data:${props.data}`);
      let setValue = null;
      try {
        if (selectbox.value) {
          const idx = selectbox.value.selectedIndex;
          const txt = selectbox.value.options[idx].text;
          if (props.config.isNullable == true && idx == 0) {
            setValue = null;
          } else {
            setValue = ComConvert.IntNullable(selectbox.value.options[idx].value);
          }
          state.valueText = txt;
          // console.log(`${idx}:${setValue}:${txt}`);
          // props.config.SetSelectedText(txt);
        } else {
          // props.config.SetSelectedText(props.config.nullText);
        }
      } catch (error) {
        console.log(`selectedChenge() => Catch Error:${error}`);
      }
      updateValue(setValue);
    };

    //更新を親コンポーネントに伝える
    const updateValue = (val: number | null) => {
      const before = props.data;
      state.value = val;
      emit('update:data', val);
      nextTick(() => {
        emit('valueChange', val, before);
      });
    };

    const showSelectBoxModal = () => {
      if (props.disabled == true) {
        return;
      }
      emit('showSelectBoxModal');
    };

    //--------------------------------------------------------------
    onMounted(() => {
      const val = ComConvert.IntNullable(props.data);
      setValueText(val);
    });
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
      emit('warn', state.notExistMessage + props.warn);
    };
    //-------------------------------
    return {
      selectbox,
      props,
      state,
      nullValue,
      selectedChenge,
      showSelectBoxModal,
      // ShowSelectBoxModal,
      //アイコン系イベント
      iconEventRedo,
      iconEventDelete,
      iconEventShowWarn,

      ut,
    };
  },
});
