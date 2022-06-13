declare module 'tabulator-tables' {
  export class Tabulator {
     constructor(target: any, options: Options)
     clearFilter();
     download(type:"xlsx"|"csv",filename:string,obje:any):any;
     replaceData( data: any ):any;
     setFilter(filter:Tabulator.Filter|Tabulator.Filter[])
     setLocale(lang:string):any;
  };

  export namespace Tabulator {

    export interface Options {
      // General Table Configuration
      height?: string|number;
      minHeight?: string|number;
      maxHeight?: string|number;
      virtualDom?: boolean;
      virtualDomBuffer?:number;
      virtualDomHoz?:number;
      placeholder?:string;
      footerElement?:string;
      tooltips?:boolean|Function;
      tooltipGenerationMode?:string;
      history?:boolean|Function;
      keybindings?:boolean|Function;
      locale?:string|boolean;
      langs?:any;
      downloadConfig?:any;
      downloadRowRange?:string;
      htmlOutputConfig?:any;
      reactiveData?:boolean;
      tabEndNewRow?:boolean|any|Function;
      validationMode?:string;
      textDirection?:string;
      invalidOptionWarnings?:boolean;
      // Columns
      columns?:Column[];
      autoColumns?:boolean;
      autoColumnsDefinitions?:any;
      layout?:string;
      layoutColumnsOnNewData?:boolean;
      responsiveLayout?:boolean;
      responsiveLayoutCollapseStartOpen?:boolean;
      responsiveLayoutCollapseUseFormatters?:boolean;
      responsiveLayoutCollapseFormatter?:Function;
      cellHozAlign?:"left"|"center"|"right";
      cellVertAlign?:"top"|"middle"|"bottom";
      headerHozAlign?:"left"|"center"|"right";
      columnMinWidth?:number;
      columnMaxWidth?:number;
      resizableColumns?:boolean;
      movableColumns?:boolean;
      tooltipsHeader?:boolean|Function;
      columnHeaderVertAlign?:string;
      headerFilterPlaceholder?:string;
      scrollToColumnPosition?:string;
      scrollToColumnIfVisible?:boolean;
      columnCalcs?:string|boolean;
      nestedFieldSeparator?:string|boolean;
      headerVisible?:boolean;
      // Rows
      rowFormatter?:Function|boolean;
      rowFormatterPrint?:Function|boolean;
      rowFormatterClipboard?:Function|boolean;
      rowFormatterHtmlOutput?:Function|boolean;
      addRowPos?:string;
      selectable?:boolean|number|string;
      selectableRollingSelection?:boolean;
      selectablePersistence?:boolean;
      selectableCheck?:Function;
      movableRows?:boolean;
      movableRowsConnectedTables?:string|any;
      movableRowsSender?:string|Function|boolean;
      movableRowsReceiver?:string|Function;
      movableRowsConnectedElements?:string|any;
      movableRowsElementDrop?:Function;
      resizableRows?:boolean;
      scrollToRowPosition?:string;
      scrollToRowIfVisible?:boolean;
      // Data
      index?:string;
      data?:array;
      ajaxURL?:string|boolean;
      ajaxParams?:any;
      ajaxConfig?:string|any;
      ajaxContentType?:string|any;
      ajaxURLGenerator?:Function;
      ajaxRequestFunc?:Function;
      ajaxFiltering?:boolean;
      ajaxSorting?:boolean;
      ajaxProgressiveLoad?:boolean;
      ajaxProgressiveLoadDelay?:number;
      ajaxProgressiveLoadScrollMargin?:number;
      ajaxLoader?:boolean|Function;
      ajaxLoaderLoading?:string;
      ajaxLoaderError?:string;
      
      
      initialSort?:array;
      sortOrderReverse?:boolean;
      headerSort?:boolean;
      headerSortTristate?:boolean;
      headerSortElement?:string;
      // Filtering
      initialFilter?:array;
      initialHeaderFilter?:array;
      headerFilterLiveFilterDelay?:number;
      // Row Grouping
      groupBy?:string|Function|array;
      groupValues?:array;
      groupHeader?:Function|array;
      groupHeaderPrint?:Function|array;
      groupHeaderClipboard?:Function|array;
      groupHeaderDownload?:Function|array;
      groupHeaderHtmlOutput?:Function|array;
      groupStartOpen?:boolean|Function|array;
      groupToggleElement?:string|boolean;
      groupClosedShowCalcs?:boolean;
      // Pagination
      pagination?:string;
      paginationSize?:number;
      paginationSizeSelector?:boolean|array;
      paginationElement?:any;
      paginationDataReceived?:object;
      paginationDataSent?:object;
      paginationAddRow?:string;
      paginationButtonCount?:number;
      // Persistent Configuration
      persistenceID?:string;
      persistenceMode?:boolean|string;
      persistentLayout?:boolean;
      persistentSort?:boolean;
      persistentFilter?:boolean;
      // Clipboard?
      clipboard?:boolean;
      clipboardCopyRowRange?:string|Function;
      clipboardCopyFormatter?:Function;
      clipboardPasteParser?:string|Function;
      clipboardPasteAction?:string|Function;
      // Data Tree
      dataTree?:boolean;
      dataTreeFilter?:boolean;
      dataTreeSort?:boolean;
      dataTreeElementColumn?:string|boolean;
      dataTreeBranchElement?:boolean;
      dataTreeChildIndent?:number;
      dataTreeChildField?:string;
      dataTreeCollapseElement?:boolean|string|any;
      dataTreeExpandElement?:boolean|string|any;
      dataTreeStartExpanded?:boolean|array|Function;
      dataTreeSelectPropagate?:boolean;
      dataTreeChildColumnCalcs?:boolean;
      // Printing?
      printAsHtml?:boolean;
      printStyled?:boolean;
      printRowRange?:string;
      printConfig?:object;
      printHeader?:boolean|string|any|Function;
      printFooter?:boolean|string|any|Function;
      printFormatter?:Function|boolean;
      // Menus
      rowContextMenu?:array;
      rowClickMenu?:array;
      groupContextMenu?:array;
      groupClickMenu?:array;
      

      rowClick?:Function;
      rowDblClick?:Function;
      
    }

    export interface Filter {
      field: string;
      type: 
      | '='
      | '!='
      | 'like'
      | 'Keywords'
      | 'starts'
      | 'ends'
      | '<'
      | '<='
      | '>'
      | '>='
      | 'in'
      | 'regex';
      value: string | number | null | any[] | RegExp;
    }

    export interface Column {
      title: string;
      field?: string;
      cellClick?: any;
      hozAlign?: 'left' | 'center' | 'right';
      vertAlign?: 'top' | 'middle' | 'bottom';
      cssClass?: string;
      cellDblClick?: any;
      formatter?: any;
      headerSort?: any;
      width?: number;
      formatterParams?: any;
      sorter?: string;
      columns?: Column[];
      visible?: boolean;
      tooltip?: any;
    }
  }
  export default Tabulator;
}
