export class DialogData {
  public RESULT = {
    YES: 'yes',
    NO: 'no',
    CANCEL: 'cancel',
  };
  public isShow: boolean;
  public title: string;
  public message: string;
  public zindex: number;
  public dialogOption: DialogOption;

  constructor(zindex = 2000) {
    this.isShow = false;
    this.title = '';
    this.message = '';
    this.zindex = zindex;
    this.dialogOption = InitDialogOption();
  }

  public yesClick: any = undefined;
  public noClick: any = undefined;
  public cancelClick: any = undefined;
}

export const InitDialogOption = (): DialogOption => {
  return {
    //---------------------
    //[表示含めた状態管理]
    isShowYes: true,
    yesTitle: 'Yes',
    isShowNo: true,
    noTitle: 'No',
    isShowCancel: true,
    cancelTitle: '閉じる',
    isRightBottonYes: true,
  };
};

export interface DialogOption {
  isShowYes: boolean;
  yesTitle: string;
  isShowNo: boolean;
  noTitle: string;
  isShowCancel: boolean;
  cancelTitle: string;
  isRightBottonYes: boolean;
}

type dialogResultType = 'yes' | 'no' | 'cancel';

interface dialogResult {
  YES: dialogResultType;
  NO: dialogResultType;
  CANCEL: dialogResultType;
}

export class Dialog {
  public dialogData: DialogData;
  public RESULT: dialogResult = {
    YES: 'yes',
    NO: 'no',
    CANCEL: 'cancel',
  };

  constructor(dialogData: DialogData) {
    this.dialogData = dialogData;
  }

  public Show = (message: string, title: string, dialogOption: DialogOption = InitDialogOption()) => {
    return new Promise<dialogResultType>( (resolve, reject) => {
      this.dialogData.title = title;
      this.dialogData.message = message;
      this.dialogData.dialogOption = dialogOption;
      this.dialogData.yesClick = () => {
        this.dialogData.isShow = false;
        resolve(this.dialogData.RESULT.YES as dialogResultType);
      };
      this.dialogData.noClick = () => {
        this.dialogData.isShow = false;
        resolve(this.dialogData.RESULT.NO as dialogResultType);
      };
      this.dialogData.cancelClick = () => {
        this.dialogData.isShow = false;
        resolve(this.dialogData.RESULT.CANCEL as dialogResultType);
      };
      this.dialogData.isShow = true;
      return;
    });
  };
}

//vue
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<DialogData>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const chancel = () => {
      if (props.data.dialogOption.isShowCancel) {
        props.data.cancelClick();
      }
    };
    return {
      props,
      chancel,
    };
  },
});
