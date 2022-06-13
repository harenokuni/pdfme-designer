//----------------------------------------------------------------
//node_modules
import { InjectionKey } from 'vue';
import { createStore, Store } from 'vuex';
//----------------------------------------------------------------

import { Toast, ToastData } from '@/script/vc-components/vc-toast-script';
import { WindowLoader, WindowLoaderData } from '@/script/vc-components/vc-window-loader-script';
import { Dialog, DialogData } from '@/script/vc-components/vc-dialog-script';
import { SelectBoxModal, SelectBoxModalData } from '@/script/vc-components/vc-form-control/vc-select-box-modal-script';

export namespace StoreComponent {
  namespace Mutations {
    export const Init = 'Init';
  }

  export interface State {
    toastData: ToastData;
    dialogData: DialogData;
    windowLoaderData: WindowLoaderData;
    selectBoxModalData: SelectBoxModalData;
    toast: Toast | null;
    dialog: Dialog | null;
    windowLoader: WindowLoader | null;
    selectBoxModal: SelectBoxModal | null;
  }

  const state: State = {
    toastData: new ToastData(2000),
    dialogData: new DialogData(2000),
    windowLoaderData: new WindowLoaderData(10000),
    selectBoxModalData: new SelectBoxModalData(2000),
    toast: null,
    dialog: null,
    windowLoader: null,
    selectBoxModal: null,
  };

  //----------------------------------------------------------------
  export const StoreKey: InjectionKey<Store<State>> = Symbol();
  //----------------------------------------------------------------
  export const Store = createStore<State>({
    state: state,
    mutations: {
      [Mutations.Init]: (state) => {
        state.toast = new Toast(state.toastData);
        state.dialog = new Dialog(state.dialogData);
        state.windowLoader = new WindowLoader(state.windowLoaderData);
        state.selectBoxModal = new SelectBoxModal(state.selectBoxModalData);
      },
    },
  });

  export namespace Methods {
    export const Init = async () => {
      Store.commit(Mutations.Init);
    };
  }
}
