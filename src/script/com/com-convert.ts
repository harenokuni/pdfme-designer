/*-------------------------------------------------------------------
com-comvert.ts
-------------------------------------------------------------------*/

// [ node module ] --------------------------------------------------
import moment from 'moment';
import { PhoneNumberUtil, PhoneNumber, PhoneNumberFormat } from 'google-libphonenumber';

//--------------------------------------------------------------
export namespace ComConvert {
  const typeOf = (obj: any) => {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
  };

  export const ToString = (value: any) => {
    try {
      if (value === null || value === undefined) return '';
      let text = '';
      switch (typeOf(value)) {
        case 'array':
        case 'object':
          text = '\n' + JSON.stringify(value, null, 2);
          break;
        default:
          text = `${value}`;
      }
      return text;
    } catch {
      return '';
    }
  };

  export const ToStringNullable = (value: any) => {
    try {
      if (value === null || value === undefined) return null;
      let text = '';
      switch (typeOf(value)) {
        case 'array':
        case 'object':
          text = '\n' + JSON.stringify(value, null, 2);
          break;
        default:
          text = `${value}`;
      }
      return text;
    } catch {
      return '';
    }
  };

  export const Int = (i: any) => {
    try {
      const str = String(i).replace(/(\\|,|-$)/g, '');
      const num = parseInt(str, 10);
      if (isNaN(num)) {
        return 0;
      } else {
        return num;
      }
    } catch (error) {
      console.log(`Comvert.Int(${i})`, i, error);
      return 0;
    }
  };

  export const IntNullable = (i: any) => {
    try {
      if (i === null) return null;
      if (i === '') return null;
      const str = String(i).replace(/(\\|,|-$)/g, '');
      const num = parseInt(str, 10);
      if (isNaN(num)) {
        return null;
      } else {
        return num;
      }
    } catch (error) {
      console.log(`Comvert.Int(${i})`, i, error);
      return null;
    }
  };

  export const Float = (i: any, digits = 0) => {
    try {
      const str = `${String(i).replace(/(\\|,|-$)/g, '')}`;
      const num = Math.floor(Number(str) * Math.pow(10, digits));
      if (isNaN(num)) {
        return 0;
      } else {
        return num / Math.pow(10, digits);
      }
    } catch {
      return 0;
    }
  };

  export const FloatNullable = (i: any, digits = 0) => {
    try {
      if (i === null) return null;
      if (i === '') return null;
      const str = `${String(i).replace(/(\\|,|-$)/g, '')}`;
      const num = Math.floor(Number(str) * Math.pow(10, digits));
      if (isNaN(num)) {
        return null;
      } else {
        return num / Math.pow(10, digits);
      }
    } catch {
      return null;
    }
  };

  /**
   * 指定した文字数にカットした文字を返却する
   * @param  text 対象の文字列
   * @param  len カットしたい文字数
   * @param  addWard 省略文字（省略した場合「...」）
   * @returns カンマが挿入された文字列
   */
  export const CutLen = (text: string, len: number, addWard = '') => {
    if (text === null) return '';
    if (len === 0) return text;
    return text.substring(0, len) + addWard;
  };

  export const LenB = (str: string) => {
    let len = 0;
    for (let i = 0; i < str.length; i++) {
      str[i].match(/[ -~]/) ? (len += 1) : (len += 2);
    }
    return len;
  };

  /**
   * 指定した文字数にカットした文字を返却する
   * @param  text 対象の文字列
   * @param  len カットしたい文字数(バイト計算)
   * @param  w 省略文字（省略した場合「...」）
   * @returns カンマが挿入された文字列
   */
  export const CutLenB = (text: string, len: number, w: string | undefined = undefined) => {
    if (text === null) return '';
    if (len === 0) return '';
    w = w == undefined ? '...' : w;
    let tempStr = '';
    for (let i = 0; i < text.length; i++) {
      if (text[i].match(/[ -~]/)) {
        //半角
        if (LenB(tempStr + w) + 1 > len) {
          break;
        }
      } else {
        //全角
        if (LenB(tempStr + w) + 2 > len) {
          break;
        }
      }
      tempStr += text[i];
    }
    text = tempStr + w;
    return text;
  };

  /**
   * 指定した文字数にカットした文字を返却する
   * @param  text 対象の文字列
   * @param  len カットしたい文字数(バイト計算)
   * @param  w 埋める文字 半角で指定すること
   * @returns カンマが挿入された文字列
   */
  export const PaddingLeft = (text: string | number | null, len: number, w: string, ryaku = ''): string => {
    text = text == null ? '' : String(text);
    const textlen = LenB(text);
    len = len - LenB(ryaku);
    if (textlen <= len) {
      return w.repeat(len - textlen) + text;
    } else {
      let str = '';
      for (let i = 0; i < text.length; i++) {
        if (text[text.length - i - 1].match(/[ -~]/)) {
          //半角
          if (LenB(str) + 1 > len) {
            break;
          }
        } else {
          //全角
          if (LenB(str) + 2 > len) {
            break;
          }
        }
        str = text[text.length - i - 1] + str;
      }
      text = str;
      return ryaku + w.repeat(len - LenB(text)) + text;
    }
  };

  /**
   * 指定した文字数にカットした文字を返却する
   * @param  text 対象の文字列
   * @param  len カットしたい文字数(バイト計算)
   * @param  w 埋める文字
   * @returns カンマが挿入された文字列
   */
  export const PaddingRight = (text: string | number | null, len: number, w: string, ryaku = ''): string => {
    text = text == null ? '' : String(text);
    const textlen = LenB(text);
    len = len - LenB(ryaku);
    if (textlen <= len) {
      return text + w.repeat(len - textlen);
    } else {
      let str = '';
      for (let i = 0; i < text.length; i++) {
        if (text[i].match(/[ -~]/)) {
          //半角
          if (LenB(str) + 1 > len) {
            break;
          }
        } else {
          //全角
          if (LenB(str) + 2 > len) {
            break;
          }
        }
        str = str + text[i];
      }
      text = str;
      return text + w.repeat(len - LenB(text)) + ryaku;
    }
  };

  /**
   * 数値をカンマを挿入した文字列に変換する
   * @param  num 数値
   * @returns カンマが挿入された文字列
   */
  export const InserComma = (num: number | string | null, digits = 0) => {
    if (num === null) {
      num = '0';
    }
    const delimiter = '.';
    const numString = num.toString();
    const delimitExp = new RegExp('(\\d)(?=(\\d{3})+$)', 'g'); //
    const decimalDelimitExp = new RegExp('(\\d)(?=(\\d{3})+(\\.\\d+))', 'g'); //
    let ret = '';
    if (numString.indexOf(delimiter) > -1) {
      ret = numString.replace(decimalDelimitExp, '$1,');
    } else {
      ret = numString.replace(delimitExp, '$1,');
    }
    if (digits === 0) return ret;

    if (numString.indexOf(delimiter) > -1) {
      const m = ret.replace(/[0-9]+\./g, '');
      // console.log('InserComma', ret, m);
      if (m.length < digits) {
        ret = `${ret}${Array(digits + 1 - m.length).join('0')}`;
      }
    } else {
      ret = `${ret}.${Array(digits + 1).join('0')}`;
    }

    return ret;
  };

  /**
   * PDF用の数値変換関数
   * ※半角0ゼロをアルファベットのオーOに変換する
   * @param  num 数値
   * @returns カンマが挿入、0がOに変換された文字列
   */
  export const InserCommaPDF = (num: number | string | null) => {
    if (num === null) {
      num = '0';
    }
    const delimiter = '.';
    const numString = num.toString();
    const delimitExp = new RegExp('(\\d)(?=(\\d{3})+$)', 'g'); // 整数のときはこっちで置換。
    const decimalDelimitExp = new RegExp('(\\d)(?=(\\d{3})+(\\.\\d+))', 'g'); // 小数のときはこっちで置換。
    const isDecimal = () => {
      // 整数か小数かをわけわけ。
      if (numString.indexOf(delimiter) > -1) {
        return true;
      } else {
        return false;
      }
    };
    if (isDecimal()) {
      // 小数ですよ。って言われたら。
      return numString.replace(decimalDelimitExp, '$1,').replace(/0/g, 'O');
    } else {
      // 小数ですよ。って言われなかったら。
      return numString.replace(delimitExp, '$1,').replace(/0/g, 'O');
    }
  };

  /**
   * momentオブジェクト変換用
   * @param  date 文字列、日付オブジェクト
   * @returns 変換OKならmomentオブジェクト、それ以外はnull
   */
  export const Moment = (date: any): moment.Moment | null => {
    try {
      if (date === null) return null;
      if (date === '') return null;
      date = date.replace(/\\/g, '-');
      if (moment(date).isValid() == false) {
        return null;
      }
      return moment(date);
    } catch {
      return null;
    }
  };

  /**
   * 不確定な日付データをフォーマットされた日付に変換される
   * @param  date 文字列、日付オブジェクト
   * @returns 変換OKならmomentオブジェクト経由で指定したフォーマット、それ以外はnull
   */
  export const MomentFormatNullable = (date: string | null, f = 'YYYY-MM-DD HH:mm:ss.SSS') => {
    try {
      if (date === null) return null;
      if (date === '') return null;
      date = date.replace(/\//g, '-');
      if (moment(date).isValid() == false) {
        return null;
      }
      return moment(date).format(f);
    } catch {
      return null;
    }
  };

  /**
   * 不確定な日付データをフォーマットされた日付に変換される
   * @param  date 文字列、日付オブジェクト
   * @returns 変換OKならmomentオブジェクト経由で指定したフォーマット、それ以外は空文字
   */
  export const MomentFormat = (date: string, f = 'YYYY-MM-DD HH:mm:ss.SSS') => {
    try {
      if (date === null) return '';
      if (date === '') return '';
      date = date.replace(/\//g, '-');
      if (moment(date).isValid() == false) {
        return '';
      }
      return moment(date).format(f);
    } catch {
      return '';
    }
  };

  export const FormatDate = (date: Date, format: string) => {
    try {
      format = format.replace(/yyyy/g, date.getFullYear().toString());
      format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
      format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2));
      format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2));
      format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
      format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
      format = format.replace(/fff/g, ('00' + date.getMilliseconds()).slice(-3));
      format = format.replace(/D/g, getDay(date.getDay()));
      return format;
    } catch {
      return '';
    }
  };

  const getDay = (d: number) => {
    switch (d) {
      case 0:
        return '日';
      case 1:
        return '月';
      case 2:
        return '火';
      case 3:
        return '水';
      case 4:
        return '木';
      case 5:
        return '金';
      case 6:
        return '土';
    }
    return '';
  };

  export const Wareki = (yyyy: any, withoutUnit = false): string => {
    try {
      if (yyyy > 2019) {
        if (withoutUnit) {
          return `R${String(yyyy - 2018)}`;
        } else {
          return `R${String(yyyy - 2018)} (${String(yyyy)}年)`;
        }
      } else if (yyyy == 2019) {
        if (withoutUnit) {
          return `R1/H31`;
        } else {
          return `R1/H31 (${String(yyyy)}年)`;
        }
      } else if (yyyy > 1989) {
        if (withoutUnit) {
          return `H${String(yyyy - 1988)}`;
        } else {
          return `H${String(yyyy - 1988)} (${String(yyyy)}年)`;
        }
      } else if (yyyy == 1989) {
        if (withoutUnit) {
          return `H1/S64`;
        } else {
          return `H1/S64 (${String(yyyy)}年)`;
        }
      } else if (yyyy > 1926) {
        if (withoutUnit) {
          return `S${String(yyyy - 1925)}`;
        } else {
          return `S${String(yyyy - 1925)} (${String(yyyy)}年)`;
        }
      } else {
        return `${String(yyyy)}`;
      }
    } catch {
      return '';
    }
  };

  export const WarekiToYYYYMMDD = (wareki: string | null): number => {
    try {
      let YYYYMMDD = '';
      if (wareki === null || wareki === '') return 0;
      //和暦→YYYY変換
      const arr = wareki.replace(/日/g, '').replace(/月/g, '-').replace(/年/g, '-').split('-');
      if (arr.length > 0) {
        if (/令和/.test(arr[0]) === true) {
          YYYYMMDD += String(Int(arr[0].replace(/令和/g, '')) + 2018);
        } else if (/平成/.test(arr[0]) === true) {
          YYYYMMDD += String(Int(arr[0].replace(/平成/g, '')) + 1988);
        } else if (/昭和/.test(arr[0]) === true) {
          YYYYMMDD += String(Int(arr[0].replace(/昭和/g, '')) + 1925);
        }
      }
      if (YYYYMMDD.length === 0) return 0;
      //念の為桁数を揃える
      YYYYMMDD = ('0000' + YYYYMMDD).slice(-4);
      //月日の変換
      for (let i = 1; i <= 2; i++) {
        if (arr.length > i && arr[i] !== '') {
          YYYYMMDD += ('00' + arr[i]).slice(-2);
        } else {
          YYYYMMDD += '00';
        }
      }
      // console.log('arr', arr);
      // console.log('変換後', wareki, YYYYMMDD);
      return Int(YYYYMMDD);
    } catch (error) {
      console.error(error);
      return 0;
    }
  };

  export const Tel = (tel: string) => {
    const temp = tel.replace(/-/, '');
    if (/^0\d{9,10}$/.test(temp) == false) {
      return tel;
    }
    // 日本の国コード
    const region = 'JP';
    const util: PhoneNumberUtil = PhoneNumberUtil.getInstance();
    // 番号と地域を設定
    const number: PhoneNumber = util.parseAndKeepRawInput(temp, region);
    // 電話番号の有効性チェック
    if (!util.isValidNumberForRegion(number, region)) {
      return tel;
    }
    // ハイフン付きの形式で返却
    return util.format(number, PhoneNumberFormat.NATIONAL);
  };

  /**
   * 住所文字列からJIS都道府県コードに変換する
   * @param  address 都道府県が先頭に含まれる文字列
   * @returns JIS都道府県コード、変換不可ならnull
   */
  export const PrefectureCode = (address: string): number | null => {
    if (/(^北海道)/.test(address) == true) return 1;
    if (/(^青森県)/.test(address) == true) return 2;
    if (/(^岩手県)/.test(address) == true) return 3;
    if (/(^宮城県)/.test(address) == true) return 4;
    if (/(^秋田県)/.test(address) == true) return 5;
    if (/(^山形県)/.test(address) == true) return 6;
    if (/(^福島県)/.test(address) == true) return 7;
    if (/(^茨城県)/.test(address) == true) return 8;
    if (/(^栃木県)/.test(address) == true) return 9;
    if (/(^群馬県)/.test(address) == true) return 10;
    if (/(^埼玉県)/.test(address) == true) return 11;
    if (/(^千葉県)/.test(address) == true) return 12;
    if (/(^東京都)/.test(address) == true) return 13;
    if (/(^神奈川県)/.test(address) == true) return 14;
    if (/(^新潟県)/.test(address) == true) return 15;
    if (/(^富山県)/.test(address) == true) return 16;
    if (/(^石川県)/.test(address) == true) return 17;
    if (/(^福井県)/.test(address) == true) return 18;
    if (/(^山梨県)/.test(address) == true) return 19;
    if (/(^長野県)/.test(address) == true) return 20;
    if (/(^岐阜県)/.test(address) == true) return 21;
    if (/(^静岡県)/.test(address) == true) return 22;
    if (/(^愛知県)/.test(address) == true) return 23;
    if (/(^三重県)/.test(address) == true) return 24;
    if (/(^滋賀県)/.test(address) == true) return 25;
    if (/(^京都府)/.test(address) == true) return 26;
    if (/(^大阪府)/.test(address) == true) return 27;
    if (/(^兵庫県)/.test(address) == true) return 28;
    if (/(^奈良県)/.test(address) == true) return 29;
    if (/(^和歌山県)/.test(address) == true) return 30;
    if (/(^鳥取県)/.test(address) == true) return 31;
    if (/(^島根県)/.test(address) == true) return 32;
    if (/(^岡山県)/.test(address) == true) return 33;
    if (/(^広島県)/.test(address) == true) return 34;
    if (/(^山口県)/.test(address) == true) return 35;
    if (/(^徳島県)/.test(address) == true) return 36;
    if (/(^香川県)/.test(address) == true) return 37;
    if (/(^愛媛県)/.test(address) == true) return 38;
    if (/(^高知県)/.test(address) == true) return 39;
    if (/(^福岡県)/.test(address) == true) return 40;
    if (/(^佐賀県)/.test(address) == true) return 41;
    if (/(^長崎県)/.test(address) == true) return 42;
    if (/(^熊本県)/.test(address) == true) return 43;
    if (/(^大分県)/.test(address) == true) return 44;
    if (/(^宮崎県)/.test(address) == true) return 45;
    if (/(^鹿児島県)/.test(address) == true) return 46;
    if (/(^沖縄県)/.test(address) == true) return 47;
    return null;
  };

  export const ConvertByte = (size: number): string => {
    const kb = 1024;
    const mb = Math.pow(kb, 2);
    const gb = Math.pow(kb, 3);
    const tb = Math.pow(kb, 4);
    let target = null;
    let unit = 'byte';
    if (size >= tb) {
      target = tb;
      unit = 'TB';
    } else if (size >= gb) {
      target = gb;
      unit = 'GB';
    } else if (size >= mb) {
      target = mb;
      unit = 'MB';
    } else if (size >= kb) {
      target = kb;
      unit = 'KB';
    }
    const res = target !== null ? Math.floor((size / target) * 100) / 100 : size;
    return `${res}  ${unit}`;
  };

  export const Hankaku = (str: string): string => {
    str = str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => {
      return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
    });

    const kanaMap = {
      ガ: 'ｶﾞ',
      ギ: 'ｷﾞ',
      グ: 'ｸﾞ',
      ゲ: 'ｹﾞ',
      ゴ: 'ｺﾞ',
      ザ: 'ｻﾞ',
      ジ: 'ｼﾞ',
      ズ: 'ｽﾞ',
      ゼ: 'ｾﾞ',
      ゾ: 'ｿﾞ',
      ダ: 'ﾀﾞ',
      ヂ: 'ﾁﾞ',
      ヅ: 'ﾂﾞ',
      デ: 'ﾃﾞ',
      ド: 'ﾄﾞ',
      バ: 'ﾊﾞ',
      ビ: 'ﾋﾞ',
      ブ: 'ﾌﾞ',
      ベ: 'ﾍﾞ',
      ボ: 'ﾎﾞ',
      パ: 'ﾊﾟ',
      ピ: 'ﾋﾟ',
      プ: 'ﾌﾟ',
      ペ: 'ﾍﾟ',
      ポ: 'ﾎﾟ',
      ヴ: 'ｳﾞ',
      ヷ: 'ﾜﾞ',
      ヺ: 'ｦﾞ',
      ア: 'ｱ',
      イ: 'ｲ',
      ウ: 'ｳ',
      エ: 'ｴ',
      オ: 'ｵ',
      カ: 'ｶ',
      キ: 'ｷ',
      ク: 'ｸ',
      ケ: 'ｹ',
      コ: 'ｺ',
      サ: 'ｻ',
      シ: 'ｼ',
      ス: 'ｽ',
      セ: 'ｾ',
      ソ: 'ｿ',
      タ: 'ﾀ',
      チ: 'ﾁ',
      ツ: 'ﾂ',
      テ: 'ﾃ',
      ト: 'ﾄ',
      ナ: 'ﾅ',
      ニ: 'ﾆ',
      ヌ: 'ﾇ',
      ネ: 'ﾈ',
      ノ: 'ﾉ',
      ハ: 'ﾊ',
      ヒ: 'ﾋ',
      フ: 'ﾌ',
      ヘ: 'ﾍ',
      ホ: 'ﾎ',
      マ: 'ﾏ',
      ミ: 'ﾐ',
      ム: 'ﾑ',
      メ: 'ﾒ',
      モ: 'ﾓ',
      ヤ: 'ﾔ',
      ユ: 'ﾕ',
      ヨ: 'ﾖ',
      ラ: 'ﾗ',
      リ: 'ﾘ',
      ル: 'ﾙ',
      レ: 'ﾚ',
      ロ: 'ﾛ',
      ワ: 'ﾜ',
      ヲ: 'ｦ',
      ン: 'ﾝ',
      ァ: 'ｧ',
      ィ: 'ｨ',
      ゥ: 'ｩ',
      ェ: 'ｪ',
      ォ: 'ｫ',
      ッ: 'ｯ',
      ャ: 'ｬ',
      ュ: 'ｭ',
      ョ: 'ｮ',
      '。': '｡',
      '、': '､',
      ー: 'ｰ',
      '「': '｢',
      '」': '｣',
      '・': '･',
    };
    const reg = new RegExp('(' + Object.keys(kanaMap).join('|') + ')', 'g');
    return str
      .replace(reg, (match) => {
        return (kanaMap as any)[match];
      })
      .replace(/゛/g, 'ﾞ')
      .replace(/゜/g, 'ﾟ');
  };

  export const FileToDataUrl = (file: any) => {
    return new Promise<any>((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          return resolve(String(reader.result));
        };
        reader.readAsDataURL(file);
      } catch (error) {
        return reject(error);
      }
    });
  };
  export const FileToText = (file: any) => {
    return new Promise<any>((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload  = () => {
          return resolve(String(reader.result));
        };
        reader.readAsText(file);
      } catch (error) {
        return reject(error);
      }
    });
  };
}
