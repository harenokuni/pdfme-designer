// import imageCompression from "browser-image-compression";

//[com] : 非同期処理系

import axios from 'axios';

export namespace ComImg {
  export interface IPromiseResult {
    requestName: string;
    error: boolean;
    errorMessage: any;
    attach: any;
    result: any;
  }

  export const InitPromiseResult = (requestName = ''): IPromiseResult => {
    return {
      requestName: requestName,
      error: false,
      errorMessage: null,
      attach: null,
      result: null,
    };
  };

  /**
   * * [com-img.ts]
   *   * URLを指定してDataUrlを取得する
   */
  export const GetDataUrl = (url: string) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<IPromiseResult>(async (resolve, reject) => {
      const promiseResult: IPromiseResult = InitPromiseResult('getFileImgData');
      try {
        const res = await axios({
          method: 'get',
          url: url,
          responseType: 'blob',
        });
        const ret = await ConvertBlobToDataUrl(res.data);
        if (ret.error) {
          //エラー情報伝達
          promiseResult.error = true;
          promiseResult.errorMessage = ret.errorMessage;
        } else {
          promiseResult.result = String(ret.result);
        }
      } catch (error) {
        promiseResult.error = true;
        promiseResult.errorMessage = `エラー検知：[${promiseResult.requestName}]\n${error}\n`;
      } finally {
        // eslint-disable-next-line no-unsafe-finally
        return resolve(promiseResult);
      }
    });
  };

  /**
   * * [com-img.ts]
   *   * fileオブジェクトからDataUrlを生成する
   */
  export const GetDataUrlByFileInput = (arg: { imgfile: File; maxWidth?: number; maxHeight?: number }) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<IPromiseResult>(async (resolve, reject) => {
      //-[arg]-----------------------
      const imgfile = arg.imgfile;
      const maxWidth = arg.maxWidth === undefined ? 1980 : arg.maxWidth;
      const maxHeight = arg.maxHeight === undefined ? 1980 : arg.maxHeight;
      //------------------------

      const promiseResult: IPromiseResult = InitPromiseResult('GetDataUrlByFileInput');
      try {
        const ret = await ConvertBlobToDataUrl(imgfile);
        if (ret.error) {
          //エラー情報伝達
          promiseResult.error = true;
          promiseResult.errorMessage = ret.errorMessage;
          return resolve(promiseResult);
        } else {
          const image = new Image();
          image.onload = function () {
            try {
              let MaxWidth = maxWidth;
              let MaxHeight = maxHeight;
              if (image.width < MaxWidth) {
                MaxWidth = image.width;
              }
              if (image.height < MaxHeight) {
                MaxHeight = image.height;
              }
              let width;
              let height;
              if (image.width > image.height) {
                // 横長の画像は横のサイズを指定値にあわせる
                const ratio = image.height / image.width;
                width = MaxWidth;
                height = MaxWidth * ratio;
              } else {
                // 縦長の画像は縦のサイズを指定値にあわせる
                const ratio = image.width / image.height;
                width = MaxHeight * ratio;
                height = MaxHeight;
              }
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              canvas.width = width;
              canvas.height = height;
              if (ctx) {
                ctx.drawImage(image, 0, 0, width, height);
              }
              promiseResult.result = canvas.toDataURL('image/jpeg');
            } catch (error) {
              promiseResult.error = true;
              promiseResult.errorMessage = `エラー検知：[${promiseResult.requestName}]\n${error}\n`;
            } finally {
              // eslint-disable-next-line no-unsafe-finally
              return resolve(promiseResult);
            }
          };
          image.src = String(ret.result);
        }
      } catch (error) {
        promiseResult.error = true;
        promiseResult.errorMessage = `エラー検知：[${promiseResult.requestName}]\n${error}\n`;
        return resolve(promiseResult);
      }
    });
  };

  /**
   * * [com-img.ts]
   *   * BlobからDataUrlへの変換
   */
  export const ConvertBlobToDataUrl = (dat: any) => {
    return new Promise<IPromiseResult>((resolve, reject) => {
      const promiseResult: IPromiseResult = InitPromiseResult('ConvertBlobToDataUrl');
      try {
        const reader = new FileReader();
        reader.onloadend = function () {
          promiseResult.result = String(reader.result);
          return resolve(promiseResult);
        };
        reader.readAsDataURL(dat);
      } catch (error) {
        promiseResult.error = true;
        promiseResult.errorMessage = `エラー検知：[${promiseResult.requestName}]\n${error}\n`;
        return resolve(promiseResult);
      }
    });
  };

  export interface ISize {
    w: number;
    h: number;
  }

  /**
   * * [com-img.ts]
   *   * 画像90°回転処理
   */
  export const RotateImgR90 = (dataurl: string, size: ISize, isRight: boolean) => {
    return new Promise<IPromiseResult>((resolve, reject) => {
      const promiseResult: IPromiseResult = InitPromiseResult('RotateImgR90');
      try {
        const image = new Image();
        image.onload = function () {
          try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = size.h;
            canvas.height = size.w;
            const r = isRight == true ? 90 : -90;
            if (ctx) {
              ctx.translate(canvas.width / 2, canvas.height / 2);
              ctx.rotate((r * Math.PI) / 180);
              ctx.translate(-size.w / 2, -size.h / 2);
              ctx.drawImage(image, 0, 0, size.w, size.h);
            }
            promiseResult.result = canvas.toDataURL('image/jpeg');
            return resolve(promiseResult);
          } catch (error) {
            promiseResult.error = true;
            promiseResult.errorMessage = `エラー検知：[${promiseResult.requestName}]\n${error}\n`;
            return resolve(promiseResult);
          }
        };
        image.src = dataurl;
      } catch (error) {
        promiseResult.error = true;
        promiseResult.errorMessage = `エラー検知：[${promiseResult.requestName}]\n${error}\n`;
        return resolve(promiseResult);
      }
    });
  };

  /**
   * * [com-img.ts]
   *   * 表示中画像サイズ取得
   */
  export const GetImgNaturalSize = (elm: HTMLImageElement): ISize => {
    return {
      w: elm.naturalWidth,
      h: elm.naturalHeight,
    };
  };
}
