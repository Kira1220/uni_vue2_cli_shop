<!-- cate 分类页面 -->
<template>
  <view>
    <view class="scroll-view-container">
      <!-- 左侧滑动区 -->
      <scroll-view scroll-y="true" class="left-srcoll-view" :style="{height: wh + 'px'}">
        <block v-for="(item ,cat_id) in cateList" :key="cat_id">
          <!-- 3.2 -->
          <view :class="['left-scroll-view-item', cat_id === active ? 'active' : '']" @click="activeChange(cat_id)">{{item.cat_name}}</view>
        </block>
      </scroll-view>

      <!-- 右侧滑动区 -->
      <scroll-view scroll-y="true" class="right-srcoll-view" :style="{height: wh +'px'}" :scroll-top="scrollTop +'px'">
        <!-- 6.2 :scroll-top="scrollTop" 绑定动态绑定页面的scroll-top的滚动距离 -->

        <!-- 5.1 循环渲染展示右侧的二级分类数据-->
        <view class="cate-lv2" v-for="(item2, indey) in cateLevel2" :key="indey">
          <view class="cate-lv2-title">/ {{ item2.cat_name }} /</view>
          <!-- 5.3 循环渲染三级分类数据 -->
          <view class="cate-lv3-list">
            <!-- 7.1 @click="gotoGoodsList(item3)"点击三级分类的item项跳转到对应页面 -->
            <view class="cate-lv3-item" v-for="(item3, indez) in item2.children" :key="indez" @click="gotoGoodsList(item3)">
              <image :src="item3.cat_icon.replace('dev','web')"></image>
              <text>{{item3.cat_name}}</text>
            </view>
          </view>
        </view>

      </scroll-view>

    </view>
  </view>
</template>

<script>
export default {
  name: "cate",
  data() {
    return {
      wh: 0, //1.1 定义一个属性用于保存数据--设备可用的空白高度
      cateList: [], //2.1 定义左侧的分类数据
      active: 0, //3.1 active用于判断标签内是否添加.active样式，默认index=0 active=0时，表示给索引为0 的item项添加.active标签
      cateLevel2: [], //4.1 定义右侧的二级分类列表
      scrollTop: 0, //6.1 解决小bug，点击左侧一级分类下拉三级分类再点击其他的一级分类时，页面数据需要从顶部开始展示
    };
  },
  onLoad() {
    const sysInfo = uni.getSystemInfoSync(); //1.2小程序的API-- uni.getSystemInfoSync()方法可以获取设备相关的数据
    // console.log("得到设备可用的空白的高度：" + sysInfo.windowHeight);
    this.wh = sysInfo.windowHeight; //1.3
    // console.log(this.wh);

    this.getCateList(); // 2.2调用方法获取左侧的分类列表数据
  },
  methods: {
    // 2.3 get请求获取分类数据cateList
    async getCateList() {
      const { data: res } = await uni.$http.get("/api/public/v1/categories");
      if (res.meta.status !== 200) return uni.$showMsg();
      this.cateList = res.message;
      // console.log(this.cateList);

      // 4.2 保存为二级分类数据,默认展示第一项二级分类数据
      this.cateLevel2 = res.message[0].children;
      // console.log(this.cateLevel2);
    },

    // 3.3 点击更换active的数值，使得.active样式跟随变化
    activeChange(index) {
      this.active = index;

      // 4.3 重新为二级分类数据赋值，展示的二级分类数据跟随左侧的一级分类的点击变化，进行展示
      this.cateLevel2 = this.cateList[index].children;
      // console.log(this.cateLevel2);

      // 6.3 判断scroll-top的数值.当前的页面的scrollTop值是否等于1，如果等于1 ，则将其修改为0.使得动态绑定的:scroll-top值在0 或1 之间。每次点击不同的一级分类，右侧的二级分类内容都是从头开始展示的
      this.scrollTop = this.scrollTop === 1 ? 0 : 1;
    },

    //7.2 点击跳转到对应分包页面，通过携带三级分类的项目的参数区分进入不同的页面
    gotoGoodsList(item3) {
      uni.navigateTo({
        url: "/subpkg/goods_list/goods_list?cat_id=" + item3.cat_id,
        success: (result) => {},
        fail: () => {},
        complete: () => {},
      });
    },
  },
};
</script>
<style scoped lang="scss">
/* @import url(); 引入css类 */
.scroll-view-container {
  display: flex;
  .left-srcoll-view {
    width: 120px; //固定的宽度或高度可使用px为单位
  }
  .left-scroll-view-item {
    background-color: #f7f7f7;
    line-height: 60px;
    text-align: center;
    font-size: 12px;

    &.active {
      //&表示标签的样式 既包含.left-scroll-view-item 又包含.active
      background: #ffffff;
      position: relative;

      &::before {
        //给同时拥有.left-scroll-view-item 和.active 样式的标签添加before伪元素
        content: "";
        display: block;
        width: 3px;
        height: 30px;
        background-color: #c00000;
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
      }
    }
  }
}
// 5.2
.cate-lv2-title {
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  padding: 15px 0;
}
// 5.4
.cate-lv3-list {
  display: flex;
  flex-wrap: wrap;

  .cate-lv3-item {
    width: 33.33%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;

    image {
      width: 60px;
      height: 60px;
    }
    text {
      font-size: 12px;
    }
  }
}
</style>