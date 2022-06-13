import { Template, Designer, Form, Viewer } from '@pdfme/ui';

import { generate, BLANK_PDF } from '@pdfme/generator';

export namespace PdfDesigner {
  export interface MyTemplate extends Template {
    fileName: string | null;
    fontName: string | undefined;
    list: {
      targetList: string[];
      span: number;
      count: number;
    }[];
  }

  export const InitListItem = (): MyTemplate['list'][0] => {
    return {
      targetList: [],
      span: 10,
      count: 1,
    };
  };
  //   Object.keys(storeApp.state.pdf.font)[0],
  export const InitMyTemplate = (fontName: string): MyTemplate => {
    return {
      fileName: null,
      fontName: fontName,
      basePdf: BLANK_PDF,
      columns: undefined,
      sampledata: undefined,
      schemas: [],
      list: [],
    };
  };
}

import { ComConvert } from '@/script/com/com-convert';

export class FileSelect {
  private _elm: null | HTMLElement = null;
  public SetRef = (e: any) => {
    this._elm = e;
  };
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public Complete = (arg: { data: any; fileName: string } | null) => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public Error = (message: string, title: string) => {};
  public ShowFileSelect = (arg?: any) => {
    return new Promise<{ data: any; fileName: string } | null>((resolve) => {
      try {
        if (this._elm) {
          this._elm.click();
        } else {
          resolve(null);
        }
        this.Complete = (arg: { data: any; fileName: string } | null) => {
          resolve(arg);
        };
      } catch (error) {
        resolve(null);
      }
    });
  };
  public FileChangeAndGetDataUrl = async (e: any) => {
    try {
      const files = e.target.files || e.dataTransfer.files;
      const file = files[0];
      const dataUrl = await ComConvert.FileToDataUrl(file);
      this.Complete({ data: dataUrl, fileName: file.name });
      e.target.value = '';
    } catch (error) {
      this.Error(String(error), '取込エラー');
    }
  };
  public FileChangeAndGetDataString = async (e: any) => {
    try {
      const files = e.target.files || e.dataTransfer.files;
      const file = files[0];
      const text = await ComConvert.FileToText(file);
      this.Complete({ data: text, fileName: file.name });
      e.target.value = '';
    } catch (error) {
      this.Error(String(error), '取込エラー');
    }
  };
}
