<!-- home 首页 -->
<template >
  <view>
    <!-- 4.1自定义搜索组件 -->
    <view class="search-box">
      <my-search @searchClick='gotoSearch'></my-search>
    </view>
    <!-- 1.轮播图的区域swiperList -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :cirecular="true">
      <swiper-item v-for="(item,i) in swiperList" :key="i">
        <navigator class="swiper-item" :url="`/subpkg/goods_detail/goods_detail?goods_id= ${item.goods_id}`">
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>

    <!-- 2.商品分类导航navList -->
    <view class="nav-list">
      <view class="nav-item" v-for="(item ,index) in navList" :key="index" @click="navClickHandler(item)">
        <image class="nav-img" :src="item.image_src"></image>
      </view>
    </view>

    <!-- 3.楼层区域floorList -->
    <view class="floor-list">
      <!-- 不同的楼层项 -->
      <view class="floor-item" v-for="(item,index) in floorList" :key="index">
        <!-- 对应的楼层标题图片 -->
        <image :src="item.floor_title.image_src" class="floor-title"></image>
        <!-- 楼层的图片区域 -->
        <view class="floor-img-box">
          <!-- 左侧大图片 -->
          <navigator class="left-img-box" :url="item.product_list[0].url">
            <image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
          </navigator>
          <!-- 右侧小图片 -->
          <view class="right-img-box">
            <navigator class="right-img-item" v-for="(its,indey) in item.product_list" :key="indey" :url="its.url">
              <image v-if="indey !== 0" :src="its.image_src" :style="{width:its.image_width + 'rpx'}" mode="widthFix"></image>
            </navigator>
          </view>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      swiperList: [], // 1-1.定义轮播图的数据列表
      navList: [], //2-1. 定义分类导航的数据列表
      floorList: [], //3-1. 定义楼层区域的数据列表
    };
  },
  onLoad() {
    this.getSwiperList(); //1-2.当页面一加载就调用方法，获取轮播图的数据
    this.getNavList(); //2-2. 当页面一加载即调用该方法，获取分类导航的数据
    this.getFloorList(); //3-2
  },
  methods: {
    async getSwiperList() {
      //1-3.获取轮播图数据的方法
      //1-3.1使用网络请求，获取轮播图的数据 {data: res}是es6的新写法，表示res的值转存给data
      const { data: res } = await uni.$http.get(
        "/api/public/v1/home/swiperdata"
      );
      // console.log(res);

      // 1-3.2当状态码不等于200时表示数据请求失败：
      /*       
        if (res.meta.status !== 200) {
          return uni.showToast({
            title: "数据请求失败！",
            duration: 1500,
            icon: "none",
          });
        } 
      */

      // 当数据请求失败后，经常要调用uni.showToast({...})方法来提示用户。此时，可以在main.js中全局封装一个uni.$showMsg()方法来简化uni.showToast()方法的调用。
      if (res.meta.status !== 200) return uni.$showMsg();
      uni.$showMsg("数据加载成功");

      //
      this.swiperList = res.message; //请求成功的数据转存到swiperList数组中
      // console.log(this.swiperList);
    },

    // 2.3 获取商品分类导航的数据
    async getNavList() {
      const { data: res } = await uni.$http.get("/api/public/v1/home/catitems");
      if (res.meta.status !== 200) return uni.$showMsg();
      // console.log(res);
      this.navList = res.message; //将数据转存到navList数组中
    },
    // 2.4 点击"分类"跳转到底部导航栏“分类”的页面
    navClickHandler(item) {
      if (item.name === "分类") {
        uni.switchTab({
          url: "/pages/cate/cate",
        });
      }
    },

    //3-3. 获取楼层列表数据
    async getFloorList() {
      const { data: res } = await uni.$http.get(
        "/api/public/v1/home/floordata"
      );
      if (res.meta.status !== 200) return uni.$showMsg();
      // console.log(this.floorList);

      // 3-4. 通过双层forEach循环，处理URL地址（实现：点击图片跳转到对应的商品详情页面。）
      /*
       * res.message.forEach((item)=>{}) 第一层循环，循环的是每一个楼层
       * item.product_list.forEach((i)=>{}) 第二层循环，循环的是每一个楼层里面的每一张图片
       * (i)=>{i.url='/subpkg/goods_list/goods_list'+i.navigator_url.split('?')[1]} 重构每一张图片i的url地址= 分包路径subpkg下的goods_list文件夹下的goods_list文件+ 携带的参数为 i.navigator_url.split('?')[1]
       * i.navigator_url.split('?')[1] i.navigator_url以？分割，得到数组第1个项。即得到携带的参数
       * 通过<navigator :url="XXX.url"></navigator>标签,实现跳转
       */
      res.message.forEach((floorItem) => {
        floorItem.product_list.forEach((productItem) => {
          productItem.url =
            "/subpkg/goods_list/goods_list?" +
            productItem.navigator_url.split("?")[1];
        });
      });
      // console.log(floorItem);
      this.floorList = res.message;
    },

    //4.2 响应点击事件，跳转到search分包页面
    gotoSearch() {
      uni.navigateTo({
        url: "/subpkg/search/search",
      });
    },
  },
};
</script>
<style scoped lang="scss">
/* @import url(); 引入css类 */
.search-box {
  position: sticky;
  top: 0;
  z-index: 999;
}
// 轮播图
swiper {
  height: 330rpx;
  .swiper-item,
  image {
    width: 100%;
    height: 100%;
  }
}

// 商品分类
.nav-list {
  display: flex;
  justify-content: space-around;
  margin: 15px 0;
  .nav-img {
    width: 128rpx;
    height: 140rpx;
  }
}

// 商品楼层
.floor-title {
  height: 60rpx;
  width: 100%;
  // display: flex;
}
.floor-img-box {
  display: flex;
  padding-left: 10rpx;
  justify-content: center;
}
.right-img-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
</style>