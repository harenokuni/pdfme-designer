/*---------------------------------------------------------------------------------
  store-app.ts
---------------------------------------------------------------------------------*/
// [ Com ]-------------------------------------------------------------------------
import { InjectionKey } from 'vue';
import { createStore, Store } from 'vuex';
import { Pdf } from '@/script/com/com-pdf';
import { Font } from '@pdfme/ui';

// --------------------------------------------------------------------------------
export namespace StoreApp {
  interface State {
    pdfFont: Font;
  }
  const state: State = {
    pdfFont: {},
  };

  // --------------------------------------------------------------------------------
  export const StoreKey: InjectionKey<Store<State>> = Symbol();
  export const Store = createStore<State>({
    state: state,
    mutations: {
      SetPdfFont: (state, payload) => {
        state.pdfFont = payload;
      },
    },
    // --------------------------------------------------------------------------------
    actions: {}, //-actions-
  });
  // --------------------------------------------------------------------------------
  export namespace Methods {
    export namespace App {
      export const Init = async () => {
        try {
          // Store.commit('AppSetInit');
          Store.commit('SetPdfFont', await Pdf.GetFont());
          return true;
        } catch (error) {
          console.error(error);
          return false;
        }
      };
    }
  }
}
