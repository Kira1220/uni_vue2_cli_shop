<!-- 分包 点击轮播图/商品列表页面的每一项，进入对应的详情页 -->
<template>
  <!-- 6. v-if="goods_info.goods_name" 解决商品价格闪烁的问题（商品详情数据请求回来之前，data中goods_info值为{},因此初次渲染页面时会导致商品价格，商品名称等闪烁的问题。通过判断good_info.good_name属性） -->
  <view v-if="goods_info.goods_name">
    <!-- 2.1 数据展示——商品详情的轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item, i) in goods_info.pics" :key="i">
        <image :src="item.pics_big" @click="preview(i)"></image>
      </swiper-item>
    </swiper>
    <!-- 4.1商品信息区域 -->
    <view class="goods-info-box">
      <!-- 商品价格 -->
      <view class="price">￥{{goods_info.goods_price}}</view>
      <!-- 信息主体区域 -->
      <view class="goods-info-body">
        <view class="goods-name">{{goods_info.goods_name}}</view>
        <view class="favi">
          <uni-icons type="star" size="18" color="gray"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <!-- 运费 -->
      <view class="transportation-expenses">快递： 免运费</view>
    </view>
    <!-- 5.1商品的图文区域 -->
    <view class="goods-detail-container">
      <text class="info-title">详情展示</text>
      <rich-text :nodes="goods_info.goods_introduce"></rich-text>
    </view>
    <!-- 7.1 底部的商品导航区域 -->
    <view class="goods_nav">
      <uni-goods-nav :fill="true" :options="options" :button-group="customButtonGroup" @click="onClick" @buttonClick="buttonClick" />
    </view>

  </view>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      goods_info: {}, //1.1 发送请求后获取到的商品详情信息
      options: [
        //7.2
        {
          icon: "shop",
          text: "进入店铺",
          infoBackgroundColor: "#007aff",
          infoColor: "#f5f5f5",
        },
        {
          icon: "cart",
          text: "购物车",
          info: "",
        },
      ],
      customButtonGroup: [
        {
          text: "加入购物车",
          backgroundColor: "linear-gradient(90deg, #FFCD1E, #FF8A18)",
          color: "#fff",
        },
        {
          text: "立即购买",
          backgroundColor: "linear-gradient(90deg, #FE6035, #EF1224)",
          color: "#fff",
        },
      ],
    };
  },
  onLoad(options) {
    //1.2 options保存了页面加载/跳转到当前页面时携带的参数
    // console.log(options);
    const goods_id = options.goods_id; //1.3 转存options中的goods_id参数为goods_id
    this.getGoodsDetail(goods_id); //1.4 调用方法获取商品的详情数据（goods_id发送请求时携带的实际参数）
  },
  methods: {
    // 1.5 获取商品的详情数据的方法
    async getGoodsDetail(goods_id) {
      const { data: res } = await uni.$http.get("/api/public/v1/goods/detail", {
        goods_id: goods_id, //携带的参数goods_id:参数goods_id 简写{goods_id}
      });
      // console.log(res);
      if (res.meta.status !== 200) return uni.$showMsg(); //状态码不等于200时，表示获取商品详情数据出错，return并调用方法弹窗提示

      // 5.2 使用字符串的replace()方法，为img标签添加行内style样式，解决图片底部有空白间隙的问题,
      // 5.3 使用字符串的replace()方法,将图片为.webp格式改为.jpg格式，从而解决.webp格式图片在ios不显示的问题
      res.message.goods_introduce = res.message.goods_introduce
        .replace(/<img/g, '<img style="display:block;"')
        .replace(/webp/g, "jpg");

      this.goods_info = res.message; //获取到的数据res.message转存到goods_info对象中
    },

    //3.1 轮播图的预览效果（点击轮播图的图片显示对应的图片进行预览）
    preview(i) {
      uni.previewImage({
        //uni-app的内置API uni.previewImage()预览图片 （详见https://uniapp.dcloud.net.cn/api/media/image.html）
        current: i, //预览时，默认显示图片的索引（current 为当前显示图片的链接/索引值）
        urls: this.goods_info.pics.map((x) => x.pics_big), //图片url地址的数组
      });
    },

    // 7.3
    onClick(e) {
      //点击店铺或购物车进入对应的页面
      // console.log(e);
      if (e.content.text == "进入店铺") {
        uni.navigateTo({
          url: "/subpkg/shop/shop",
        });
      }
      if (e.content.text == "购物车") {
        uni.switchTab({
          url: "/pages/cart/cart",
        });
      }
    },
    buttonClick(e) {
      // console.log(e);
      if (e.index == 0) {
        this.options[1].info++; //购物车提示信息+1
      }
      if (e.content.text == "立即购买") {
        console.log(123); //跳转到支付页面
      }
    },
  },
};
</script>
<style scoped lang="scss">
/* @import url(); 引入css类 */
swiper {
  height: 750rpx;
  image {
    width: 100%;
    height: 100%;
  }
}
.goods-info-box {
  padding: 10px 0 10px 10px;
  font-size: 12px;
  .price {
    color: #c00000;
    font-size: 18px;
    font-weight: 700;
    margin: 10px 0;
  }
  .goods-info-body {
    display: flex;
    justify-content: space-between; //主轴（横向）两边对齐
    font-size: 14px;
    .goods-name {
      margin-right: 10px;
    }
    .favi {
      color: gray;
      width: 120px;
      display: flex;
      flex-direction: column;
      justify-content: center; //主轴（纵向）居中
      align-items: center; //侧轴（横向）居中
      border-left: 1px solid #efefef;
    }
  }
  .transportation-expenses {
    color: gray;
    margin: 10px 0;
  }
}

.info-title {
  font-size: 18px;
  color: gray;
  display: block;
  margin: 10px;
}
.goods-detail-container {
  padding-bottom: 50px;
}
.goods_nav {
  padding: 0;
  display: block;
  position: sticky;
  bottom: 0;
  left: 0;
}
</style>