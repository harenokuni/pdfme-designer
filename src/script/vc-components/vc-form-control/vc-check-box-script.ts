import { defineComponent, watch, reactive, ref,nextTick, getCurrentInstance } from 'vue';

type Props = {
  //Form系コントロール
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
  emits: ['valueChange', 'update:data','warn'],

  setup(props: Props, { emit }) {
    interface IState {
      value: boolean;
      isActivate: boolean;
      error: string;
    }
    const elmInput = ref<HTMLInputElement>();

    const state = reactive<IState>({
      value: false,
      isActivate: false,
      error: '',
    });
    watch(
      () => props.data,
      () => {
        if (props.data == null) {
          state.value = false;
        } else {
          state.value = props.data==1?true:false;
        }
      }
    );

    const switchValue = () => {
      const before=props.data;
      if (props.disabled == true) {
        return;
      }
      if (props.data == null) {
        emit('update:data', 1);
        nextTick(() => {
          emit('valueChange', 1, before);
        });
      } else {
        if(props.data===1){
          emit('update:data', 0);
          nextTick(() => {
            emit('valueChange', 0, before);
          });
        }else{
          emit('update:data', 1);
          nextTick(() => {
            emit('valueChange', 1, before);
          });
        }
      }
    
      if (elmInput.value) {
        elmInput.value.focus();
      }
    };

    const onFocus = () => {
      state.isActivate = true;
    };

    const onBlur = () => {
      state.isActivate = false;
    };
    //--------------------------------------------------------------
    //アイコ系イベント

    //警告の表示
    const iconEventShowWarn = () => {
      emit('warn',props.warn);
    };
    //--------------------------------------------------------------

    return {
      props,
      state,
      onBlur,
      onFocus,
      switchValue,
      elmInput,
      //アイコン系イベント
      iconEventShowWarn,
    };
  },
});
