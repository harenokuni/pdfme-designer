import { Font } from '@pdfme/ui';

export namespace Pdf {
  export let font: Font|null =null;

  export const GetFont = async () => {
    if (font === null) {
      font = {
        ipag: {
          data: await fetch('/assets/font/ipag.ttf').then((res) => res.arrayBuffer()),
          fallback: true,
        },
        ipagp: {
          data: await fetch('/assets/font/ipagp.ttf').then((res) => res.arrayBuffer()),
        },
      };
    }
    return font;
  };

  
  export interface TextSchema {
    type: 'text';
    rotate?: number | undefined;
    alignment?: 'left' | 'center' | 'right' | undefined;
    fontSize?: number | undefined;
    fontName?: string | undefined;
    fontColor?: string | undefined;
    backgroundColor?: string | undefined;
    characterSpacing?: number | undefined;
    lineHeight?: number | undefined;

    position?: {
      x: number;
      y: number;
    };
    width?: number;
    height?: number;
  }

  
  export interface BarcodeSchema {
    type: 'qrcode' | 'japanpost' | 'ean13' | 'ean8' | 'code39' | 'code128' | 'nw7' | 'itf14' | 'upca' | 'upce';
    rotate?: number | undefined;
    position: {
      x: number;
      y: number;
    };
    width: number;
    height: number;
  }
  
  export interface ImageSchema {
    rotate?: number | undefined;
    type: 'image';
    position: {
      x: number;
      y: number;
    };
    width: number;
    height: number;
  }
}
