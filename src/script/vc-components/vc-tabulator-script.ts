import {Tabulator} from 'tabulator-tables';
interface State {
  table: Tabulator | null;
}
type Props = {
  columns: Tabulator.Column[];
  rows: any;
  rowCountHeight: number;
  tableControl: any;
  tableOption: Tabulator.Options;
};
import { defineComponent, reactive, PropType, onMounted, watch, nextTick, ref } from 'vue';
export default defineComponent({
  props: {
    columns: {
      type: Object as PropType<Tabulator.Column[]>,
      required: true,
    },
    rows: {
      type: Object as PropType<any>,
      required: true,
    },
    rowCountHeight: {
      type: Number,
      default: 0,
    },
    tableControl: {
      type: Object as PropType<any>,
      required: true,
    },
    tableOption: {
      type: Object as PropType<Tabulator.Options>,
      required: false,
      default: undefined,
    },
  },
  emits: ['rowClick', 'rowDblClick'],
  setup(props, { emit }) {
    const tableTarget = ref<HTMLElement>();
    const state = reactive<State>({
      table: null,
    });
    watch(
      () => props.rows,
      async (newData) => {
        if (state.table) {
          state.table.replaceData(newData);
        }
      }
    );
    onMounted(async () => {
      await nextTick();
      let height = 0;
      if (props.rowCountHeight != 0) {
        height = props.rowCountHeight * 39 + 85 + 2;
      }
      const option: Tabulator.Options = new Object();
      option.layout = 'fitDataFill';
      option.reactiveData = true;
      option.data = props.rows;
      option.columns = props.columns;
      option.height = height == 0 ? '' : height;
      option.cellVertAlign = 'middle';
      option.pagination = 'local';
      option.paginationSize = 20;
      option.paginationSizeSelector = [20, 50, 100];
      option.paginationSizeSelector = {
        columnHeaders: false, //do not include column headers in downloaded table
        columnGroups: false, //do not include column groups in column headers for downloaded table
        rowGroups: false, //do not include row groups in downloaded table
        columnCalcs: false, //do not include column calcs in downloaded table
        dataTree: false, //do not include data tree in downloaded table
      };
      option.rowClick = (e: any, row: any) => {
        emit('rowClick', row._row.data);
      };
      option.rowDblClick = (e: any, row: any) => {
        emit('rowDblClick', row._row.data);
      };
      option.locale = true;
      option.langs = {
        'ja': {
          pagination: {
            page_size: '表示件数',
            page_title: 'Show Page',
            first: '', //text for the first page button
            first_title: '最初のページ', //tooltip text for the first page button
            last: '',
            last_title: '最後のページ',
            prev: '',
            prev_title: 'Prev Page',
            next: '',
            next_title: 'Next Page',
          },
        },
      };
      if (props.tableOption !== undefined) {
        Object.keys(props.tableOption).forEach((key) => {
          (option as any)[key] = (props.tableOption as any)[key];
        });
      }
      // option

      state.table = new Tabulator(tableTarget.value, option);
      state.table.setLocale('ja');
      //親コントロールへtableを伝達するよう
      (props.tableControl as any).setTable(state.table);
    });
    return {
      state,
      tableTarget,
    };
  },
});
