/*---------------------------------------------------------------------------------
  root-view-script.ts
---------------------------------------------------------------------------------*/

// [ node_modules ]----------------------------------------------------------------

import { StoreComponent } from '@/script/store/store-component';
import { Toast } from '@/script/vc-components/vc-toast-script';
import { WindowLoader } from '@/script/vc-components/vc-window-loader-script';
import { Dialog, InitDialogOption } from '@/script/vc-components/vc-dialog-script';
import { SelectBoxModal, ShowSelectBoxModal } from '@/script/vc-components/vc-form-control/vc-select-box-modal-script';
import { SelectConfig, SelectItem } from '@/script/vc-components/vc-form-control/vc-select-box-script';

import ComPdfDesigner from '@/script/views/com/view-pdf-designer.vue';

// [ Com ]-------------------------------------------------------------------------
import { Com } from '@/script/com/com';
// [ Store 共通系 ]----------------------------------------------------------------
import { StoreApp } from '@/script/store/store-app';
// [ Vue.js系 ]--------------------------------------------------------------------
import { defineComponent, reactive, ref, computed, watch, nextTick, PropType } from 'vue';
import { onMounted, onUnmounted, onUpdated, onErrorCaptured } from 'vue';
import { useStore } from 'vuex';
// --------------------------------------------------------------------------------
export default defineComponent({
  components: { ComPdfDesigner },
  setup() {
    interface State {
      serverState: '開発用' | '' | '検証用';
      isShowServerState: boolean;
    }
    const state = reactive<State>({
      serverState: '',
      isShowServerState: false,
    });

    // [▼ 共通コンポーネント ▼]----------------------------------------------
    const storeComponent = useStore(StoreComponent.StoreKey);

    StoreComponent.Methods.Init();
    const toast = storeComponent.state.toast as Toast;
    const dialog = storeComponent.state.dialog as Dialog;
    const windowLoader = storeComponent.state.windowLoader as WindowLoader;
    const selectBoxModal = storeComponent.state.selectBoxModal as SelectBoxModal;
    // [▼ Store ▼]-----------------------------------------------------------
    const storeApp = useStore(StoreApp.StoreKey);
    const storeInit = async () => {
      await StoreApp.Methods.App.Init();
    };
    storeInit();
    // [▼ reactive ▼]--------------------------------------------------------

    onMounted(() => {
      document.title = 'pdfme-designer';
    });
    //-----------------------------------------------------------------------------
    return {
      storeApp,
      storeComponent,
      state,
    };
  },
});
