<!-- 抽离出来的goods_list_item组件 商品列表-->
<template>
  <view class="goods-item">
    <!-- 商品左侧图片区域 -->
    <view class="goods-item-left">
      <image :src="item.goods_small_logo || defaultPic" class="goods-pic"></image>
    </view>
    <!-- 商品右侧信息区域 -->
    <view class="goods-item-right">
      <view class="goods-name">{{item.goods_name}}</view>
      <view class="goods-info-box">
        <view class="goods-price">￥{{item.goods_price | tofixed}}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "goodsListItem",
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      defaultPic: "/src/static/logo.png",
    };
  },
  filters: {
    // 过滤器，过滤数字保留两位小数点
    tofixed(num) {
      return Number(num).toFixed(2);
    },
  },
};
</script>
<style scoped lang="scss">
/* @import url(); 引入css类 */
.goods-item {
  // height: 130px;
  border-bottom: 1px solid #f0f0f0;
  padding: 10px 5px;
  display: flex;
  justify-content: space-between;
  .goods-item-left {
    margin-right: 5px;
    .goods-pic {
      width: 100px;
      height: 100px;
      display: block;
    }
  }
  .goods-item-right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 13px;
    .goods-price {
      font-size: 16px;
      font-weight: 700;
      color: #c00000;
    }
  }
}
</style>