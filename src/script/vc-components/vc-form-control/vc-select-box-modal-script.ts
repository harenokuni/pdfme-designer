/*------------------------------------------------------------------------------------------------
vc-select-box-modal-script.ts
------------------------------------------------------------------------------------------------*/
//import
// import { } from '@/script/com-components/vc-select-box-modal-script'
//------------------------------------------------------------------------------------------------

//vue
import { defineComponent, ref, watch, PropType } from 'vue';
import { SelectConfig } from '@/script/vc-components/vc-form-control/vc-select-box-script';

export class SelectBoxModalData {
  public isShow = false;
  public zindex: number;
  public selectConfig: SelectConfig;
  public value: number | null = null;
  constructor(zindex = 2000) {
    this.zindex = zindex;
    this.selectConfig = new SelectConfig();
  }
  //メソッド
  public update: ((val: number | null, text: string) => void) | undefined = undefined;
  public cancel: (() => void) | undefined = undefined;
}

export class SelectBoxModal {
  private selectBoxModalData: any;
  constructor(selectBoxData: any) {
    this.selectBoxModalData = selectBoxData;
  }

  public Show = (value: number | null, selectConfig: SelectConfig) => {
    return new Promise<SelectBoxModaResult>((resolve, reject) => {
      this.selectBoxModalData.selectConfig = selectConfig;
      this.selectBoxModalData.value = value;
      this.selectBoxModalData.update = (val: number | null, text: string) => {
        this.selectBoxModalData.isShow = false;
        resolve({ result: true, value: val, text: text });
      };
      this.selectBoxModalData.cancel = () => {
        this.selectBoxModalData.isShow = false;
        resolve({ result: false, value: null, text: '' });
      };
      this.selectBoxModalData.isShow = true;
    });
  };
}

//SelectBoxModal表示イベント用
export const ShowSelectBoxModal = async (
  selectBoxModal: SelectBoxModal,
  targetObj: any,
  targetName: string,
  selectConfig: any,
  valueChange: any = undefined
) => {
  const before = targetObj[targetName];
  const result: SelectBoxModaResult = await selectBoxModal.Show(targetObj[targetName], selectConfig);
  if (result.result == true) {
    targetObj[targetName] = result.value;
    // selectConfig.SetSelectedText(result.text);
    if (valueChange !== undefined) {
      valueChange(result.value, before);
    }
  }
};

interface SelectBoxModaResult {
  result: boolean;
  value: number | null;
  text: string;
}

type Props = {
  data: SelectBoxModalData;
};
export default defineComponent({
  props: {
    data: {
      type: Object as PropType<SelectBoxModalData>,
      required: true,
    },
  },
  setup(props: Props) {
    const scrollElement = ref<HTMLElement>();
    const chancel = () => {
      if (props.data.cancel != undefined) {
        props.data.cancel();
      }
    };
    watch(
      () => props.data.isShow,
      () => {
        if (props.data.isShow == false && scrollElement.value != null) {
          //閉じるごとにスクロールをリセットする
          scrollElement.value.scrollTop = 0;
        }
      }
    );

    const clickItem = (id: number | null, text: string) => {
      if (props.data.update != undefined) {
        props.data.update(id, text);
      }
    };

    return {
      props,
      chancel,
      scrollElement,
      clickItem,
    };
  },
});
