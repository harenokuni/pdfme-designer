import { defineComponent, watch, onUnmounted, nextTick, computed, PropType, reactive, ref, onMounted } from 'vue';
import moment from 'moment';
import flatpickr from 'flatpickr';
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect';
import 'flatpickr/dist/plugins/monthSelect/style.css';
import { Japanese } from 'flatpickr/dist/l10n/ja';
import l10n from 'flatpickr/dist/l10n/index.js';

// [ 共通コンポーネント用 ]--------------------------------------------------------

type Props = {
  textAlign: 'left' | 'center' | 'right';
  format: string;
  mode: 'all' | 'date' | 'time' | 'month';

  minDate: string;
  maxDate: string;
  // // enableTime: boolean;
  outputFormat: string;
  hideDeleteBtn: boolean;
  // //Form系コントロール統一要素
  placeholder: string;
  class: string;
  disabled: boolean;
  data: string | null;
  diff: string | null | undefined;
  warn: string;
  require: boolean;
};
export default defineComponent({
  props: {
    textAlign: {
      type: String as PropType<'left' | 'center' | 'right'>,
      required: false,
      default: 'left',
    },
    format: {
      type: String,
      required: false,
      default: 'YYYY-MM-DD',
    },
    mode: {
      type: String as PropType<'all' | 'date' | 'time' | 'month'>,
      required: false,
      default: 'date',
    },
    minDate: {
      type: String,
      required: false,
      default: '',
    },
    maxDate: {
      type: String,
      required: false,
      default: '',
    },
    outputFormat: {
      type: String,
      required: false,
      default: 'YYYY-MM-DD HH:mm:ss.SSS',
    },
    hideDeleteBtn: {
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
  emits: ['valueChange', 'update:data', 'warn', 'onOpen', 'onClose', 'keydownEnter', 'showError'],
  setup(props: Props, { emit }) {
    const elm = ref<HTMLElement>();

    interface State {
      picker: any;
      //FormControl値
      date: Date | null;
      text: string;
      //FormControl状態監視用
      isActivate: boolean;
      isCloseing: boolean;
      option: any;
    }

    const state = reactive<State>({
      text: '',
      picker: null,
      date: null,
      isActivate: false,
      isCloseing: false,
      option: {
        dateFormat: 'Z',
        locale: Japanese,
        time_24hr: true,
        minDate: moment(props.minDate).isValid() == true ? moment(props.minDate).toISOString() : undefined,
        maxDate: moment(props.maxDate).isValid() == true ? moment(props.minDate).toISOString() : undefined,
      },
    });

    const checkDate = (date: any) => {
      // console.log(props.minDate);
      if (props.minDate != '' && moment(date).isBefore(props.minDate)) {
        // console.log('最小日付を下回っています', props.data, props.minDate);
        return false;
      } else if (props.maxDate != '' && moment(date).isAfter(props.maxDate)) {
        // console.log('最大日付を下回っています', props.data, props.maxDate);
        return false;
      }
      return true;
    };

    const keyDown = (event: any) => {
      const before = props.data;
      // console.log('keyDown', state.picker);
      if (event.key === 'Enter') {
        datePickerToday();
        return;
      }
      if (event.key === 'Backspace') {
        iconEventDelete();
        return;
      }
      let move = 0;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        move--;
      }
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        move++;
      }
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        //Flatpickerにフォーカスを奪われるキーイベントはフォーカスを取り戻す予約
        setTimeout(() => {
          // console.log('フォーカス戻す');
          if (elm.value != undefined || elm.value != null) {
            elm.value.focus();
          }
        }, 150);
      }
      if (move !== 0) {
        let m = props.data == null ? moment() : moment(props.data);
        if (move < 0) {
          m = m.subtract(1, 'd');
        } else {
          m = m.add(1, 'd');
        }
        if (props.data != '') {
          if (checkDate(m) == false) {
            // console.log('行き過ぎ');
            return false;
          }
        } else {
          if (move < 0) {
            m = moment(props.maxDate).subtract(1, 'd');
          } else {
            m = moment(props.minDate).add(1, 'd');
          }
        }
        emit('update:data', m.format(props.outputFormat));
        nextTick(() => {
          emit('valueChange', m.format(props.outputFormat), before);
        });
        return false;
      }
    };

    onUnmounted(() => {
      state.picker.destroy();
      // if (elm.value != undefined || elm.value != null) {
      //   elm.value.addEventListener('keydown', keyDown);
      // }
    });

    //-----------------------

    const initflatpicker = () => {
      //flatpicker
      if (props.mode == 'all' || props.mode == 'time') {
        state.option.enableTime = true;
        if (props.mode == 'time') {
          state.option.noCalendar = true;
        }
      }
      if (props.mode == 'month') {
        state.option.plugins = [
          new (monthSelectPlugin as any)({
            shorthand: true, // デフォルトはfalse
            dateFormat: 'm.y', // デフォルトは"F Y"
            altFormat: 'F Y', // デフォルトは"F Y"
            theme: 'dark', // デフォルトは"light"
          }),
        ];
      }
    };

    onMounted(() => {
      initflatpicker();
      generatePicker();
      monthSelectPlugin();
      // if (elm.value != undefined || elm.value != null) {
      //   elm.value.addEventListener('keydown', keyDown);
      // }
    });
    const generatePicker = () => {
      // console.log('generatePicker',VueLang.i18n.global.locale )
      if (elm.value != undefined || elm.value != null) {
        moment.locale('ja');
        state.picker = flatpickr(elm.value, state.option);
        state.picker.config.onChange.push(onChange);
        state.picker.config.onOpen.push(onOpen);
        state.picker.config.onClose.push(onClose);
        setValue();
      }
    };
    watch(
      () =>
        computed(() => {
          return [props.minDate, props.maxDate];
        }).value,
      () => {
        state.isActivate = false;
        state.picker.destroy();
        state.option.minDate = moment(props.minDate).isValid() == true ? moment(props.minDate).toISOString() : undefined;
        state.option.maxDate = moment(props.maxDate).isValid() == true ? moment(props.maxDate).toISOString() : undefined;
        generatePicker();
        monthSelectPlugin();
      }
    );

    const onChange = (selectedDates: any, dateStr: any, instance: any) => {
      const before = props.data;
      // console.log('onChange');
      // console.log(selectedDates);
      if (selectedDates.length == 0) {
        state.date = null;
        nextTick(() => {
          emit('valueChange', null, before);
        });
      } else {
        const d = selectedDates[0];
        if (d == null) {
          state.date = null;
          emit('update:data', null);
          nextTick(() => {
            emit('valueChange', null, before);
          });
        } else {
          state.date = d;
          emit('update:data', moment(d).format(props.outputFormat));
          nextTick(() => {
            emit('valueChange', moment(d).format(props.outputFormat), before);
          });
        }
      }
    };

    const onOpen = (selectedDates: any, dateStr: any, instance: any) => {
      state.isActivate = true;
      emit('onOpen');
    };

    const onClose = (selectedDates: any, dateStr: any, instance: any) => {
      // console.log('onClose');
      state.isActivate = false;
      state.isCloseing = true;
      setTimeout(() => {
        state.isCloseing = false;
        emit('onClose');
      }, 200);
    };

    //-----------------------

    watch(
      () => props.data,
      () => {
        setValue();
      }
    );

    const setValue = () => {
      const before = props.data;
      // console.log('setValue');
      try {
        if (props.data == null) {
          state.picker.setDate(null);
          state.date = null;
          return;
        }
        if (moment(props.data).isValid() == true) {
          if (checkDate(props.data) == true) {
            state.date = moment(props.data).toDate();
            state.picker.setDate(state.date);
            return;
          }
        }
        state.picker.setDate(null);
        state.date = null;
        emit('update:data', null);
        nextTick(() => {
          emit('valueChange', null, before);
        });
      } catch {
        state.picker.setDate(null);
        state.date = null;
        emit('update:data', null);
        nextTick(() => {
          emit('valueChange', null, before);
        });
      }
    };

    watch(
      () => state.date,
      () => {
        if (state.date == null) {
          state.text = '';
        } else {
          state.text = moment(state.date).format(props.format);
        }
      }
    );

    const datePickerShow = () => {
      if (state.isCloseing == true) return;
      if (props.disabled == false && state.picker != null) {
        state.picker.open();
      }
    };

    const datePickerToday = () => {
      const before = props.data;
      if (props.disabled == true) {
        return;
      }
      if (state.date != null) {
        return;
      }
      if (checkDate(moment().format('YYYY-MM-DD')) === false) {
        emit('showError', { message: '「当日」は入力範囲外です', title: '当日入力エラー' });
        return;
      }
      if (props.mode === 'all' || props.mode === 'time') {
        emit('update:data', moment().format(props.outputFormat));
        nextTick(() => {
          emit('valueChange', moment().format(props.outputFormat), before);
        });
      } else {
        emit('update:data', moment(moment().format('YYYY-MM-DD')).format(props.outputFormat));
        nextTick(() => {
          emit('valueChange', moment(moment().format('YYYY-MM-DD')).format(props.outputFormat), before);
        });
      }
    };

    const dbclickValue = () => {
      if (state.date != null) {
        iconEventDelete();
      }
    };

    //--------------------------------------------------------------
    //アイコン系イベント
    const iconEventRedo = () => {
      const before = props.data;
      if (props.disabled == true) {
        return;
      }
      if (checkDate(props.diff) === false) {
        return;
      }
      emit('update:data', props.diff);
      nextTick(() => {
        emit('valueChange', props.diff, before);
      });
    };
    const iconEventDelete = () => {
      const before = props.data;
      if (props.disabled == true) {
        return;
      }
      if (state.date != null) {
        emit('update:data', null);
        nextTick(() => {
          emit('valueChange', null, before);
        });
      }
    };
    //警告の表示
    const iconEventShowWarn = () => {
      emit('warn', props.warn);
    };

    //--------------------------------------------------------------
    return {
      props,
      state,
      elm,
      emit,
      datePickerToday,
      datePickerShow,
      dbclickValue,
      //アイコン系イベント
      iconEventRedo,
      iconEventDelete,
      iconEventShowWarn,
      keyDown,
    };
  },
});
