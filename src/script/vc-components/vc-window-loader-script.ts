export class WindowLoaderData {
  public isShow: boolean;
  public zindex: number;
  constructor(zindex = 2000) {
    this.isShow = false;
    this.zindex = zindex;
  }
}

export class WindowLoader {
  public windowLoaderData: WindowLoaderData;
  constructor(windowLoaderData: WindowLoaderData) {
    this.windowLoaderData = windowLoaderData;
  }
  public Show = () => {
    this.windowLoaderData.isShow = true;
  };
  public Hide = () => {
    this.windowLoaderData.isShow = false;
    this.windowLoaderData.isShow = false;
  };
}

type Props = {
  data: WindowLoaderData;
};
import { defineComponent, PropType } from 'vue';
export default defineComponent({
  props: {
    data: {
      type: Object as PropType<WindowLoaderData>,
      required: true,
    },
  },
  setup(props: Props) {
    return {
      props,
    };
  },
});
