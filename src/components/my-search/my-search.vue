<!-- 自定义搜索组件 -->
<template>
  <!-- 2-2. 动态绑定样式:style="{'样式名':属性名}" -->
  <view class="my-search-container" :style="{'background-color':bgcolor}" @click="mySearchClick">
    <view class="my-search-box" :style="{'border-radius': radius +'rpx'}">
      <!-- 1-3.使用uni-ui提供放入图标组件，通过type修改不同图标 -->
      <uni-icons type="search" size="17"></uni-icons>
      <text class="placeholder">搜索</text>
    </view>
  </view>
</template>

<script>
import { uniIcons } from "@dcloudio/uni-ui"; //1-1.npm下载uni-ui组件后引入所需的组件
export default {
  name: "mySearch",
  props: {
    //2-1. 通过props定义背景颜色和圆角尺寸，并指定默认类型和值；在标签内通过style样式动态绑定的方式定义组件的样式；这样做的目的在于方便该自定义组件在不同的页面中可以快速通过父传子的组件通信方式修改自定义组件的这两种样式
    bgcolor: {
      //背景颜色
      type: String,
      default: "#c00000",
    },
    radius: {
      //圆角尺寸
      type: Number,
      default: 36, //单位是rpx
    },
  },
  data() {
    return {};
  },
  methods: {
    mySearchClick() {
      //自定义点击事件，当组件被点击时，向外发送一个名为searchClick的事件
      this.$emit("searchClick");
    },
  },
  components: {
    uniIcons, //1-2.注册组件
  },
};
</script>
<style scoped lang="scss">
/* @import url(); 引入css类 */
.my-search-container {
  height: 100rpx;
  // background-color: #c00000;
  padding: 0 20rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  .my-search-box {
    width: 100%;
    height: 72rpx;
    background-color: #ffffff;
    // border-radius: 36rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    .placeholder {
      font-size: 30rpx;
      margin-left: 10rpx;
    }
  }
}
</style>