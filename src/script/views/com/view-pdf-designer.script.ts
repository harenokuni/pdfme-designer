//-[pdfme]-------------------------------------------------------------------------
import { Template, Designer, Form, Viewer } from '@pdfme/ui';
//-[pdfme用 > Pdfライブラリ]-------------------------------------------------------
import { Pdf } from '@/script/com/com-pdf';
import { Com } from '@/script/com/com';
// [ 共通コンポーネント用 ]--------------------------------------------------------
import { StoreComponent } from '@/script/store/store-component';
import { Toast } from '@/script/vc-components/vc-toast-script';
import { SelectBoxModal, ShowSelectBoxModal } from '@/script/vc-components/vc-form-control/vc-select-box-modal-script';
import { SelectConfig } from '@/script/vc-components/vc-form-control/vc-select-box-script';
// [ Store 共通系 ]----------------------------------------------------------------
import { StoreApp } from '@/script/store/store-app';
// [ vue ]-------------------------------------------------------------------------
import { defineComponent, onMounted, watch, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import { ComConvert } from '@/script/com/com-convert';
// [ vue ]-------------------------------------------------------------------------
import { PdfDesigner, FileSelect } from './view-com-pdf-desiner';
type MyTemplate = PdfDesigner.MyTemplate;
const InitListItem = PdfDesigner.InitListItem;
const InitMyTemplate = PdfDesigner.InitMyTemplate;
//---------------------------------------------------------------------------------
export default defineComponent({
  // components: {},
  setup() {
    // ----------------------------------------------------------------------
    const storeComponent = useStore(StoreComponent.StoreKey);
    const toast = storeComponent.state.toast as Toast;
    const selectBoxModal = storeComponent.state.selectBoxModal as SelectBoxModal;
    // ----------------------------------------------------------------------
    const storeApp = useStore(StoreApp.StoreKey);
    // ----------------------------------------------------------------------
    // - [ State ]--------------------------------------------------
    interface State {
      elms: {
        pdfDesiner: HTMLElement | null;
      };
      fileSelect: {
        baseUrl: FileSelect;
        template: FileSelect;
      };
      control: {
        targetList: SelectConfig;
      };
      designer: Designer | null;
      designerOption: {
        font: any;
        lang: 'en' | 'ja';
      };
      data: {
        origin: MyTemplate;
        edit: MyTemplate;
        isChange: boolean;
      };
      autoSync:boolean
    }

    /**
     * 初期化用フォント名
     */
    const defaultFont = computed(() => {
      return Object.keys(storeApp.state.pdfFont)[0];
    });

    const state = reactive<State>({
      elms: {
        pdfDesiner: null,
      },
      fileSelect: {
        baseUrl: new FileSelect(),
        template: new FileSelect(),
      },
      control: {
        targetList: new SelectConfig('ターゲットリスト', null, true, '選択してください。', true),
      },
      designer: null,
      designerOption: {
        font: null,
        lang: 'ja',
      },
      data: {
        origin: InitMyTemplate(defaultFont.value),
        edit: InitMyTemplate(defaultFont.value),
        isChange: false,
      },
      autoSync:true
    });

    /**
     * エレメントキャッチ用
     */
    const setRef = (e: any, emlName: string) => {
      (state.elms as any)[emlName] = e;
    };
    // - [ ファイル選択用 ]--------------------------------------------------
    //ファイル選択クラスからのエラー
    state.fileSelect.baseUrl.Error = (message: string, title: string) => {
      toast.Error(message, title);
    };
    state.fileSelect.template.Error = (message: string, title: string) => {
      toast.Error(message, title);
    };

    /**
     * ファイル選択：既存テンプレートの選択
     */
    const fileSelectTemplateShow = async () => {
      try {
        const ret = await state.fileSelect.template.ShowFileSelect();
        if (ret != null) {
          const getTemplate = JSON.parse(ret.data);
          const baseTemplate = await InitMyTemplate(defaultFont.value);
          baseTemplate.fileName = ret.fileName;
          //basePdf
          if ('basePdf' in getTemplate) {
            baseTemplate.basePdf = getTemplate.basePdf;
          }
          //fontName
          if ('fontName' in getTemplate) {
            baseTemplate.fontName = getTemplate.fontName;
          } else {
            const font = await Pdf.GetFont();
            baseTemplate.fontName = Object.keys(font)[0];
          }
          //schemas
          if ('schemas' in getTemplate) {
            baseTemplate.schemas = getTemplate.schemas;
          }
          //columns
          if ('columns' in getTemplate) {
            baseTemplate.columns = getTemplate.columns;
          } else {
            baseTemplate.columns = [];
            if (getTemplate.schemas.length > 0) {
              getTemplate.schemas.forEach((row: any) => {
                Object.keys(row).forEach((key) => {
                  (baseTemplate.columns as string[]).push(key);
                });
              });
            }
          }
          //sampledata
          if ('sampledata' in getTemplate) {
            baseTemplate.sampledata = getTemplate.sampledata;
          } else {
            baseTemplate.sampledata = [];
            if (getTemplate.schemas.length > 0) {
              getTemplate.schemas.forEach((row: any) => {
                const sampleData: any = {};
                Object.keys(row).forEach((key) => {
                  sampleData[key] = 'sample data';
                });
                (baseTemplate.sampledata as any).push(sampleData);
              });
            }
          }
          //schemas
          if ('list' in getTemplate) {
            baseTemplate.list = getTemplate.list;
          }
          state.data.origin = Com.Obj.Copy(baseTemplate);
          state.data.edit = Com.Obj.Copy(baseTemplate);
          updateGeneratorTemplate(baseTemplate, true);
        }
      } catch (error) {
        toast.Error(String(error), '取込エラー');
      }
    };

    /**
     * ファイル選択：BasePDFの変更
     */
    const fileSelectBaseUrlShow = async () => {
      const ret = await state.fileSelect.baseUrl.ShowFileSelect();
      if (ret != null) {
        state.data.edit.basePdf = ret.data;
        updateGeneratorTemplate(Com.Obj.Copy(state.data.edit as MyTemplate), true);
      }
    };

    /**
     * ファイル選択：テンプレートファイルダウンロード
     */
    const download = () => {
      console.log('save');
      if (state.data.edit !== null) {
        const fileName = state.data.edit.fileName === null ? 'temlate.json' : state.data.edit.fileName;
        const data: any = Com.Obj.Copy(state.data.edit);
        delete data['fileName'];
        const link = document.createElement('a');
        link.href = 'data:text/plain,' + encodeURIComponent(JSON.stringify(data, null, 3));
        link.download = fileName;
        link.click();
        state.data.origin = Com.Obj.Copy(state.data.edit);
      }
    };

    // - [ 差分比較 ]--------------------------------------------------
    watch(
      () => computed(() => JSON.stringify(state.data.edit)).value,
      () => {
        state.data.isChange = Com.ObjControl.Compare(state.data.edit, state.data.origin);
      },
      { deep: true }
    );

    const resetSchemas = () => {
      if (state.data.edit.schemas.length == 0) return;
      const data = Com.Obj.Copy(state.data.edit);
      console.log('resetSchemas',data)
      data.columns = data.columns === undefined ? [] : data.columns;
      data.sampledata = data.sampledata === undefined ? [{}] : data.sampledata;
      data.list.forEach((row) => {
        row.targetList.forEach((targetName) => {
          //各リスト親要素の処理
          if (Object.keys(data.schemas[0]).includes(targetName) == false) {
            throw new Error('リストの基準要素が見つかりません。');
          }
          const base = Com.Obj.Copy(data.schemas[0][targetName]);
          const sampledata = (data.sampledata as any)[0][targetName];
          //既存該当要素の削除
          const schemasKeysList = Object.keys(data.schemas[0]);
          schemasKeysList.forEach((schemasKey) => {
            if (schemasKey.replace(/\d{1,}$/, '') === targetName.replace(/\d{1,}$/, '')) {
              delete data.schemas[0][schemasKey];
            }
          });
          data.columns = (data.columns as string[]).filter((columnKey) => {
            if (columnKey.replace(/\d{1,}$/, '') === targetName.replace(/\d{1,}$/, '')) {
              return false;
            } else {
              return true;
            }
          });
          Object.keys((data.sampledata as { [x: string]: string }[])[0]).forEach((sampleDataKey) => {
            if (sampleDataKey.replace(/\d{1,}$/, '') === targetName.replace(/\d{1,}$/, '')) {
              delete (data.sampledata as { [x: string]: string }[])[0][sampleDataKey];
            }
          });
          //ここで生成する
          for (let i = 0; i < row.count; i++) {
            const name = targetName.replace(/\d{1,}$/, String(i));
            const insertObj = Com.Obj.Copy(base);
            // console.log('copy Name', name, insertObj);
            insertObj.position.y = base.position.y + row.span * i;
            data.schemas[0][name] = insertObj;
            (data.columns as any).push(name);
            (data.sampledata as any)[0][name] = sampledata;
          }
        });
      });
      updateGeneratorTemplate(data, false);
    };

    /**
     * リストの対象リストを更新する
     * 対象リストに含む場合は
     * ＜数値以外＋ゼロ＞が文字の末に指定すること
     * ※00などは禁止
     */
    const resetTargetList = () => {
      // //登録済みリスト（登録済みの要素と連番要素は追加しない）
      const selectedTargetList: string[] = [];
      state.data.edit.list.forEach((row) => {
        selectedTargetList.push(...row.targetList);
      });
      //未登録の要素名のリストを生成する
      state.control.targetList.list = [];
      const list: SelectConfig['list'] = [];
      if (state.data.edit.schemas.length > 0) {
        Object.keys(state.data.edit.schemas[0]).forEach((key, index) => {
          if (/[^0-9０-９]0$/.test(key) === true && selectedTargetList.includes(key) === false) {
            list.push({ id: index, text: key });
          }
        });
        state.control.targetList.list = list.sort((a, b) => {
          if (a.text > b.text) {
            return 1;
          } else if (a.text < b.text) {
            return -1;
          } else {
            return 0;
          }
        });
      }
    };

    // ----------------------------------------------------------------------

    //[初期化 test]----------------------------
    const addListItem = () => {
      state.data.edit.list.push(InitListItem());
      updateGeneratorTemplate(state.data.edit, true);
    };

    const targetListAdd = (value: number | null, before: number, row: MyTemplate['list'][0]) => {
      const name = state.control.targetList.GetSelectedText(value);
      if (value === null) return;
      const list = Com.Obj.Copy(row.targetList);
      list.push(name);
      row.targetList = list.sort();
      resetSchemas();
    };

    const targetListItemRemove = (row: MyTemplate['list'][0], name: string) => {
      row.targetList = row.targetList.filter((key) => {
        if (key === name) {
          return false;
        } else {
          return true;
        }
      });
      resetSchemas();
    };

    // ----------------------------------------------------------------------
    // - [ Generator ]--------------------------------------------------

    /**
     * Generatorの初期化
     */
    const initGenerator = async () => {
      //初期化用フォントが取得完了していない場合があるためこちらでも取得処理を実行
      state.designerOption.font = await Pdf.GetFont();
      if (state.elms.pdfDesiner !== null) {
        const arg = {
          domContainer: state.elms.pdfDesiner,
          template: state.data.edit as MyTemplate,
          options: state.designerOption,
        };
        state.designer = new Designer(arg);
        (state.designer as any).onChangeTemplateCallback = (template: MyTemplate) => {
          dataTemplateSet(template);
          resetTargetList();
          if(state.autoSync===false)return;
          setTimeout(()=>{
            if(Com.ObjControl.Compare(template.schemas,beforeTemplate.schemas))
            resetSchemas();
          },200)
        };
        resetTemplate();
      }
    };

    // - [ Template ]--------
    //更新ループ対策
    let beforeTemplate: MyTemplate =InitMyTemplate(defaultFont.value);
    /**
     * GeneratorのTemplateを変更
     * state.data側のデータ更新でここを更新する
     */
    const updateGeneratorTemplate = (template: MyTemplate, force = false) => {
      if (Com.ObjControl.Compare(template, beforeTemplate) === true || force === true) {
        beforeTemplate = Com.Obj.Copy(template);
        if (state.designer !== null) {
          state.designer.updateTemplate(Com.Obj.Copy(template));
        }
      } else {
        return;
      }
    };

    const dataTemplateSet = async (template: MyTemplate) => {
      state.data.edit = Com.Obj.Copy(template);
    };

    /**
     * テンプレートの初期化
     */
    const resetTemplate = async () => {
      dataTemplateReset();
      updateGeneratorTemplate(state.data.edit);
    };

    // ----------------------------------------------------------------------
    const dataTemplateReset = () => {
      state.data.edit = InitMyTemplate(defaultFont.value);
      state.data.origin = InitMyTemplate(defaultFont.value);
    };

    
    onMounted(() => {
      initGenerator();
    });
    dataTemplateReset();
    return {
      state,
      setRef,
      addListItem,
      resetSchemas,
      fileSelectBaseUrlShow,
      fileSelectTemplateShow,
      download,
      resetTemplate,
      ShowSelectBoxModal,
      selectBoxModal,
      targetListAdd,
      targetListItemRemove,
      toast,
    };
  },
});
