import '@/scss/common.scss';
import moment from 'moment';
moment.locale('ja');
//----------------------
//vue
import { createApp } from 'vue';
import RootView from '@/script/root-view.vue';
const vueApp = createApp(RootView);
//----------------------

//Store
import { StoreApp } from '@/script/store/store-app';
vueApp.use(StoreApp.Store, StoreApp.StoreKey);
import { StoreComponent } from '@/script/store/store-component';
vueApp.use(StoreComponent.Store, StoreComponent.StoreKey);
//----------------------
//各種コンポーネント
// import VcTabulator from '@/script/vc-components/vc-tabulator.vue';
// vueApp.component('VcTabulator', VcTabulator);
//----------------------
//Modal系
import VcToast from '@/script/vc-components/vc-toast.vue';
vueApp.component('VcToast', VcToast);
import VcDialog from '@/script/vc-components/vc-dialog.vue';
vueApp.component('VcDialog', VcDialog);
import VcWindowLoader from '@/script/vc-components/vc-window-loader.vue';
vueApp.component('VcWindowLoader', VcWindowLoader);
import VcSelectModal from '@/script/vc-components/vc-form-control/vc-select-box-modal.vue';
vueApp.component('VcSelectModal', VcSelectModal);
//----------------------
//sonota
import VcLink from '@/script/vc-components/vc-link.vue';
vueApp.component('VcLink', VcLink);
import VcAccordion from '@/script/vc-components/vc-accordion.vue';
vueApp.component('VcAccordion', VcAccordion);

//----------------------
//FormControl系
import VcFormControl from '@/script/vc-components/vc-form-control/vc-form-control.vue';
vueApp.component('VcFormControl', VcFormControl);
import VcFormButton from '@/script/vc-components/vc-form-control/vc-form-button.vue';
vueApp.component('VcFormButton', VcFormButton);
import VcSelectBox from '@/script/vc-components/vc-form-control/vc-select-box.vue';
vueApp.component('VcSelectBox', VcSelectBox);
import VcDatePicker from '@/script/vc-components/vc-form-control/vc-datepicker.vue';
vueApp.component('VcDatePicker', VcDatePicker);
import VcValuebox from '@/script/vc-components/vc-form-control/vc-valuebox.vue';
vueApp.component('VcValuebox', VcValuebox);
import VcTextbox from '@/script/vc-components/vc-form-control/vc-textbox.vue';
vueApp.component('VcTextbox', VcTextbox);
import VcTextarea from '@/script/vc-components/vc-form-control/vc-textarea.vue';
vueApp.component('VcTextarea', VcTextarea);
import VcRadioBox from '@/script/vc-components/vc-form-control/vc-radio-box.vue';
vueApp.component('VcRadioBox', VcRadioBox);
import VcToggleSwitch from '@/script/vc-components/vc-form-control/vc-toggle-switch.vue';
vueApp.component('VcToggleSwitch', VcToggleSwitch);
import VcCheckBox from '@/script/vc-components/vc-form-control/vc-check-box.vue';
vueApp.component('VcCheckBox', VcCheckBox);
//----------------------
vueApp.mount('#app');
//--------------------------
//エラー確認用
vueApp.config.errorHandler = (err, vm, info) => {
  console.log(`Captured in Vue.config.errorHandler: ${info}`, err);
};
window.addEventListener('error', (event) => {
  console.log('Captured in error EventListener', event.error);
});
window.addEventListener('unhandledrejection', (event) => {
  console.log('Captured in unhandledrejection EventListener', event.reason);
});
//-----------------------------------------------------------------