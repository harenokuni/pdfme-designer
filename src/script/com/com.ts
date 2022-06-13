/*-------------------------------------------------------------------
  com.ts
-------------------------------------------------------------------*/
export namespace Com {

  export namespace Obj {
    /**
     *  テキスト値取得
     */
    export const Copy = <T>(obj: T): T => {
      return JSON.parse(JSON.stringify(obj));
    };
    
  }

  export namespace ObjControl {
   /**
     * オブジェクト比較
     * true 相違有り
     */
    export const Compare = (a: any, b: any): boolean => {
      const objectSort = (obj: any) => {
        if (obj === null) {
          return null;
        }
        // ソートする
        const sorted = Object.entries(obj).sort();
        for (const i in sorted) {
          const val = sorted[i][1];
          if (typeof val === 'object') {
            sorted[i][1] = objectSort(val);
          }
        }
        return sorted;
      };
      const aJSON = JSON.stringify(objectSort(a));
      const bJSON = JSON.stringify(objectSort(b));
      return aJSON !== bJSON;
    };
  }

  export namespace Function {
    export const Sleep = (time: number) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, time);
      });
    };
    export const RandomInt = (min: number, max: number) => {
      return Math.floor(Math.random() * (max + 1 - min)) + min;
    };
  }
}
