//components /toast
// import { Toast, ToastData, IToastMessage } from "@/com-components/component-toast.ts";
// const state = reactive  ({
//     com: {
//         toast: new ToastData(2100),
//     },
// });
// let toast: Toast = new Toast(state.com.toast);
// toast.Show( "メッセージ", "タイトル", 2500);
// toast.Success( "メッセージ", "タイトル", 2500);
// toast.Info( "メッセージ", "タイトル", 2500);
// toast.Warning( "メッセージ", "タイトル", 2500);
// toast.Error( "メッセージ", "タイトル", 2500);

export interface IToastMessage {
  key: string;
  isShow: boolean;
  title: string;
  message: string;
  hideAfter: number;
  barWidth: number;
  theme: string;
}

export class ToastData {
  public pendingList: Array<IToastMessage> = [];
  public key: string;
  public zindex: number;
  constructor(zindex = 2000) {
    this.key = '';
    this.zindex = zindex;
    this.pendingList = [];
  }
  public ClearToastPendingList = (keyList: Array<string>) => {
    keyList.forEach((key: string) => {
      for (let i = 0; i < this.pendingList.length; i++) {
        if ((this.pendingList[i].key = key)) {
          this.pendingList.splice(i, 1);
          break;
        }
      }
    });
  };
}

export class Toast {
  public toastData: ToastData;
  constructor(toastData: ToastData) {
    this.toastData = toastData;
  }
  public Show = (message: string, title: string, hideAfter = 0) => {
    this.showDetail(message, title, hideAfter, 'default');
  };

  public Success = (message: string, title: string, hideAfter = 0) => {
    this.showDetail(message, title, hideAfter, 'success');
  };

  public Info = (message: string, title: string, hideAfter = 0) => {
    this.showDetail(message, title, hideAfter, 'info');
  };

  public Warning = (message: string, title: string, hideAfter = 0) => {
    this.showDetail(message, title, hideAfter, 'warning');
  };

  public Error = (message: string, title: string, hideAfter = 0) => {
    this.showDetail(message, title, hideAfter, 'error');
  };

  public Refresh = () => {
    this.toastData.key = this.createkey();
  };

  public showDetail = (message: string, title: string, hideAfter = 0, theme: string) => {
    //---------------------
    const newToast: IToastMessage = {
      key: this.createkey(),
      isShow: true,
      title: title,
      message: message,
      hideAfter: hideAfter,
      barWidth: 0,
      theme: theme,
    };
    this.toastData.pendingList.push(newToast);
    //この値の変更をToastコンポーネントで検知して実際のtoast表示処理を走らす
    this.toastData.key = this.createkey();
    // console.log("addShowDetail");\
    setTimeout(() => {
      this.Refresh();
    }, 10);
  };
  private createkey = () => {
    const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const N = 16;
    return Array.from(Array(N))
      .map(() => S[Math.floor(Math.random() * S.length)])
      .join('');
  };

  public HideAllToast = () => {
    const newToast: IToastMessage = {
      key: this.createkey(),
      isShow: false,
      title: '',
      message: '',
      hideAfter: 0,
      barWidth: 0,
      theme: '',
    };
    this.toastData.pendingList.push(newToast);
    //この値の変更をToastコンポーネントで検知して実際の削除処理を走らす
    this.toastData.key = this.createkey();
  };
}

import { defineComponent, reactive, PropType, computed, watch, onMounted, 
  // nextTick, watchEffect
 } from 'vue';

type Props = {
  data: ToastData;
};
export default defineComponent({
  props: {
    data: {
      type: Object as PropType<ToastData>,
      required: true,
    },
  },
  // ---------- emits ----------
  emits: ['hide', 'clearToastPendingList'],
  // ---------- setup ----------
  setup(props: Props, { emit }) {
    interface IState {
      toastMessageList: Array<IToastMessage>;
    }
    const state = reactive<IState>({
      toastMessageList: [],
    });

    /**
     * * [component-image-edit-modal.ts]
     *   * props.data.key はtoastの追加指示の毎に更新される。
     *   * これを監視しtoast表示を判断する。
     */
    watch(
      () => props.data.key,
      () => {
        // console.log("watch")
        checkToast();
      }
    );

    const checkToast = () => {
      if (props.data.pendingList.length != 0) {
        let allDeteleFlag = false;
        const completeList: Array<string> = [];
        const pendingListCount = props.data.pendingList.length;
        for (let i = 0; i < pendingListCount; i++) {
          const pendingToastMessage = props.data.pendingList[i];
          //toast表示処理
          if (pendingToastMessage.isShow == true && allDeteleFlag == false) {
            const newToastMessage: IToastMessage = {
              key: String(pendingToastMessage.key),
              isShow: true,
              title: pendingToastMessage.title,
              message: pendingToastMessage.message,
              hideAfter: pendingToastMessage.hideAfter,
              theme: pendingToastMessage.theme,
              barWidth: 0,
            };
            state.toastMessageList.push(newToastMessage);
            if (newToastMessage.hideAfter != 0) {
              autoHide(newToastMessage.key);
            }
            completeList.push(newToastMessage.key);
          } else {
            allDeteleFlag = true;
            completeList.push(pendingToastMessage.key);
          }
        }
        if (allDeteleFlag == true) {
          state.toastMessageList.length = 0;
        }
        props.data.ClearToastPendingList(completeList);
        // emit("clearToastPendingList", completeList);
      }
    };

    /**
     * * [component-image-edit-modal.ts]
     *   * 時間経過でToastを消す処理
     */
    const autoHide = async (key: string) => {
      const toastMessageListCount = state.toastMessageList.length;
      for (let i = 0; i < toastMessageListCount; i++) {
        const toastMessage = state.toastMessageList[i];
        if (toastMessage.key == key) {
          const max = toastMessage.hideAfter;
          const interval = 50;
          const tickCount = max / interval;
          const percent = 100 / tickCount;
          const countDown = setInterval(() => {
            if (toastMessage.barWidth + percent > 100) {
              toastMessage.barWidth = 100;
              hide(toastMessage);
              clearInterval(countDown);
            } else {
              toastMessage.barWidth += percent;
            }
          }, interval);
          break;
        }
      }
    };

    /**
     * * [component-image-edit-modal.ts]
     *   * スタイルの設定※残り時間
     */
    const berWidth = computed(() => (index: number) => {
      const imageData = state.toastMessageList[index];
      const w = imageData.barWidth > 100 ? 100 : imageData.barWidth;
      return {
        width: w + '%',
      };
    });

    /**
     * * [component-image-edit-modal.ts]
     *   * 閉じるボタンを押したときの処理
     */
    const hide = (toastMessage: IToastMessage) => {
      for (let i = 0; i < state.toastMessageList.length; i++) {
        if (state.toastMessageList[i].key == toastMessage.key) {
          state.toastMessageList.splice(i, 1);
          break;
        }
      }
    };

    onMounted(async () => {
      checkToast();
    });

    // ----- return -----
    return {
      //-- data --
      state,
      props,
      berWidth,
      hide,
    };
  },
});
