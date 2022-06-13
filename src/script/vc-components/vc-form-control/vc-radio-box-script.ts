/*------------------------------------------------------------------------------------------------
vc-radio-box.main.ts
------------------------------------------------------------------------------------------------*/
//import
// import {} from '@/script/com-components/vc-radio-box.main';
//------------------------------------------------------------------------------------------------

//vue
import { defineComponent, computed, reactive, watch, ref, PropType, onMounted, onUnmounted, nextTick, getCurrentInstance } from 'vue';
// [ Common CommonConv ]---------------------------------------------------
import { ComConvert } from '@/script/com/com-convert';
import { SelectConfig } from '@/script/vc-components/vc-form-control/vc-select-box-script';

type Props = {
  config: SelectConfig;
  maxRow: number;
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
    config: {
      type: Object as PropType<SelectConfig>,
      required: true,
    },
    maxRow: {
      type: Number,
      required: false,
      default: null,
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
  emits: ['valueChange', 'update:data', 'update:caption', 'warn'],
  setup(props, { emit }) {
    const instance = getCurrentInstance();
    const uid = instance != null ? String(instance.uid) : '';

    const nullValue = null;
    const selectbox = ref<HTMLSelectElement>();

    interface IState {
      isSpMode: boolean;
      isShowSpList: boolean;
      //FormControl値
      value: null | number;
      valueText: string;
      notExistMessage: string;
      //FormControl状態監視用
      isActivate: boolean;
    }
    const state = reactive<IState>({
      isSpMode: false,
      isShowSpList: false,
      notExistMessage: '',
      //FormControl値
      value: null,
      valueText: '',
      //FormControl状態監視用
      isActivate: false,
    });

    //PropData監視
    watch(
      () => props.data,
      () => {
        const val = ComConvert.IntNullable(props.data);
        state.value = val;
        setValueText(val);
      }
    );

    onMounted(() => {
      const val = ComConvert.IntNullable(props.data);
      state.value = val;
      setValueText(val);
    });

    const computedStyleMaxRow = computed(() => {
      if (props.maxRow == null) {
        return ' max-height: auto; ';
      } else {
        return `height:${1.2 * props.maxRow + 0.3 * props.maxRow}em ;max-height:${1.2* props.maxRow + 0.3 * props.maxRow}em ;  overflow: auto;`;
        // return `height:${1.25 * props.maxRow + 0.3 * props.maxRow}em ;max-height:${1.25 * props.maxRow + 0.3 * props.maxRow}em ;  overflow: auto;`;
      }
    });

    watch(
      () => props.config.list,
      () => {
        const val = ComConvert.IntNullable(props.data);
        setValueText(val);
      }
    );

    //表示されているラベルをPropのConfigに反映させる
    const setValueText = (val: number | null) => {
      let setValueText = '';
      let hasValue = false;
      for (let i = 0; i < props.config.list.length; i++) {
        if (props.config.list[i].id == props.data) {
          hasValue = true;
          setValueText = props.config.list[i].text;
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
        //親コンポーネントのDataは変更しない
        // props.config.SetSelectedText(props.config.nullText);
      }
    };

    watch(
      () => state.value,
      () => {
        selectedChenge();
      }
    );

    //ユーザーが入力を変更した場合
    const selectedChenge = () => {
      // let setValueText = props.config.nullText;
      // let hasValue = false;
      try {
        const setValue = ComConvert.IntNullable(state.value);
        // for (let i = 0; i < props.config.list.length; i++) {
        //   if (props.config.list[i].id == setValue) {
        //     hasValue = true;
        //     // setValueText = props.config.list[i].text;
        //     break;
        //   }
        // }
        // props.config.SetSelectedText(setValueText);
        updateValue(setValue);
      } catch (error) {
        console.log(`selectedChenge() => Catch Error:${error}`);
      }
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

    //--------------------------------------------------------------
    onMounted(() => {
      const val = ComConvert.IntNullable(props.data);
      setValueText(val);
    });
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
      emit('warn', state.notExistMessage + props.warn);
    };
    //-------------------------------
    return {
      selectbox,
      uid,
      props,
      state,
      nullValue,
      selectedChenge,
      computedStyleMaxRow,
      //アイコン系イベント
      iconEventRedo,
      iconEventDelete,
      iconEventShowWarn,
    };
  },
});
