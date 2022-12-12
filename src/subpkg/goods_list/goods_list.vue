<!-- 点击楼层图片/搜索历史的关键词/分类页面的图片 跳转到当前商品列表页面 -->
<template>
  <view>
    <view class="goods-list">
      <view v-for="(item ,goods_id) in goodsList" :key="goods_id" @click="gotoDetail(item)">
        <!-- 2.3 使用组件 -->
        <goods-list-item :item="item"></goods-list-item>
      </view>
    </view>
  </view>
</template>

<script>
// 2.1 引入自定义组件
import goodsListItem from "/src/components/goods_list_item/goods_list_item";
export default {
  name: "goodsList",
  data() {
    return {
      // 1.1 设置请求的参数对象queryObj
      queryObj: {
        query: "", //点击home首页的楼层图片携带query=''参数，跳转到goods_list页面
        cat_id: "", //点击cate分类页面的三级分类图片，携带cid=''参数，跳转到goods_list页面
        pagenum: 1, //设置当前goods_list页面的页码值
        pageSize: 10, //设置页面每页显示10条数据
      },
      goodsList: [], //用于保存当goods_list页面一加载，发送获取商品列表数据的请求
      total: 0, //商品列表的条数
      isLoading: false, //3.1节流阀，避免多次加载数据
    };
  },
  onLoad(options) {
    //options 是一个内置参数对象，当onLoad触发，options中即携带了跳转时的参数
    // 1.2 当页面一加载，将跳转时携带的参数转存到queryObj对象中：
    this.queryObj.query = options.query || ""; //来自home首页的query=''参数转存到this.queryObj.query
    this.queryObj.cat_id = options.cat_id || ""; //来自cate分类的三级分类的cat_id=''参数转存到this.queryObj.cat_id
    // console.log(options);

    // 1.3通过页面跳转时携带的参数，发送请求，获取数据
    this.getGoodsList();
  },
  methods: {
    // 1.4 获取商品列表数据的方法
    async getGoodsList(cb) {
      this.isLoading = true; //3.2开启节流阀

      const { data: res } = await uni.$http.get(
        "/api/public/v1/goods/search",
        this.queryObj
      ); //this.queryObj是发送请求时携带的参数
      // console.log(res);
      this.isLoading = false; //3.3关闭节流阀
      cb && cb();

      if (res.meta.status !== 200) return uni.$showMsg(); //当返回的状态码不等于200时，表示数据请求失败，即return出去，并调用封装的uni.shoeMsg()方法用于提示请求失败
      this.goodsList = [...this.goodsList, ...res.message.goods]; //3.4转存获取到的商品列表数据
      this.total = res.message.total; //转存获取到的商品列表长度
    },

    // 5.1 点击跳转到商品详情页面
    gotoDetail(item) {
      // console.log(item);
      uni.navigateTo({
        url: "/subpkg/goods_detail/goods_detail?goods_id=" + item.goods_id,
      });
    },
  },
  // 3.5 上拉加载更多
  onReachBottom() {
    if (this.isLoading == true) return; //当节流阀开启时，表示正在获取数据，此时关闭节流阀并return，不进行触底发送请求
    if (this.queryObj.pagenum * this.queryObj.pageSize >= this.total)
      //当前的页码*10如果大于等于已有的数据数量 ，则return，并调用uni.$showMsg(''),数据已全部请求完毕，不再发送数据请求
      return uni.$showMsg("到底啦~");
    this.queryObj.pagenum++; //触底页码+1
    this.getGoodsList(); //再次请求数据
  },
  // 4.1 下拉刷新重置
  onPullDownRefresh() {
    this.queryObj.pagenum = 1;
    this.total = 0;
    this.isLoading = false;
    this.goodsList = [];
    // 再次发送数据请求，并携带参数，当请求完成后调用参数停止下拉刷新
    this.getGoodsList(() => {
      uni.stopPullDownRefresh();
    });
  },
  components: {
    goodsListItem, //2.2 注册组件
  },
};
</script>
<style scoped lang="scss">
/* @import url(); 引入css类 */
</style>