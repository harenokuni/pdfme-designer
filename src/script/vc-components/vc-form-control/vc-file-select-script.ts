/*---------------------------------------------------------------------------------
  templatemodal-script.ts
---------------------------------------------------------------------------------*/

// [ node_modules ]----------------------------------------------------------------
import moment from 'moment';

// [ Com ]-------------------------------------------------------------------------
import { ComImg } from '@/script/com/com-img';

// [ 共通コンポーネント用 ]--------------------------------------------------------
import { StoreComponent } from '@/script/store/store-component';
import { Toast } from '@/script/vc-components/vc-toast-script';
// [ Vue.js系 ]--------------------------------------------------------------------
import { defineComponent, reactive, ref, computed, watch, nextTick, PropType } from 'vue';
import { onMounted, onUnmounted, onUpdated, onErrorCaptured } from 'vue';
import { useStore } from 'vuex';

export namespace VcFileControlScript {
  type Props = {
    vcFileSelectProps: VcFileSelectProps;
  };

  export interface VcFileSelectPropsData {
    ts: string;
  }

  export interface VcFileSelectOption {
    fileAcceptList: string[];
    maxWidth?: number;
    maxHeight?: number;
  }
  export const InitOption = (): VcFileSelectOption => {
    return {
      fileAcceptList: ['image/jpeg', 'image/png'],
      maxWidth: 1980,
      maxHeight: 1980,
    };
  };

  interface VcFileSelectOptionArg {
    fileAcceptList?: string[];
    maxWidth?: number;
    maxHeight?: number;
  }

  export class VcFileSelectProps {
    constructor(zindex = 2000) {
      this.data = reactive<VcFileSelectPropsData>({
        ts: '',
      });
      this.option = InitOption();
    }

    public data: VcFileSelectPropsData;
    public option: VcFileSelectOption;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public complete = (data: string | null) => {};
    public ShowFileSelect = (arg?: VcFileSelectOptionArg) => {
      return new Promise<string | null>((resolve) => {
        try {
          this.option = InitOption();
          if (arg) {
            Object.keys(arg).forEach((key) => {
              (this.option as any)[key] = (arg as any)[key];
            });
          }
          this.data.ts = moment().format('YYYYMMDDHHmmssSSS');
          this.complete = (data: string | null) => {
            resolve(data);
          };
        } catch (error) {
          resolve(null);
        }
      });
    };
  }

  export const vueConponent = defineComponent({
    props: {
      vcFileSelectProps: {
        type: Object as PropType<VcFileSelectProps>,
        required: true,
      },
    },
    setup(props: Props) {
      const storeComponent = useStore(StoreComponent.StoreKey);
      const toast = storeComponent.state.toast as Toast;
      const elmFile = ref<HTMLElement>();
      const state = reactive({
        height: 'auto',
      });
      watch(
        () => props.vcFileSelectProps.data.ts,
        async () => {
          await nextTick();
          if (elmFile.value && props.vcFileSelectProps.data.ts) {
            elmFile.value.click();
          } else {
            props.vcFileSelectProps.complete(null);
          }
        }
      );

      const fileChange = async (e: any) => {
        try {
          const files = e.target.files || e.dataTransfer.files;
          const fileImg = files[0];
          if (checkImgFileType(fileImg) == false) {
            return props.vcFileSelectProps.complete(null);
          }
          const ret = await ComImg.GetDataUrlByFileInput({
            imgfile: fileImg,
            maxWidth: props.vcFileSelectProps.option.maxWidth,
            maxHeight: props.vcFileSelectProps.option.maxWidth,
          });
          if (!ret.error) {
            props.vcFileSelectProps.complete(String(ret.result));
          } else {
            props.vcFileSelectProps.complete(null);
          }
          e.target.value = '';
        } catch (error) {
          toast.Error(String(error), '画像取込エラー');
          return props.vcFileSelectProps.complete(null);
        }
      };

      const checkImgFileType = (fileImg: File): boolean => {
        if (fileImg) {
          if (props.vcFileSelectProps.option.fileAcceptList.includes(fileImg.type) == false) {
            toast.Warning(`ファイル形式に問題があります。`, '画像取込エラー', 2500);
            return false;
          } else {
            return true;
          }
        }
        return false;
      };
      return {
        state,
        props,
        elmFile,
        fileChange,
      };
    },
  });
}

export default VcFileControlScript.vueConponent;
