<!-- 搜索页面分包 -->
<template>
  <view>
    <!-- 1.顶部搜索框的制作 -->
    <view class="search-box">
      <uni-search-bar placeholder="自定义背景色" @input="input" focus="true" radius="100" cancelButton='none'>
      </uni-search-bar>
    </view>
    <!-- 3.4 通过v-for搜索列表展示 
    3.5 点击搜索建议的 Item 项，跳转到商品详情页面：@click -->
    <view class="sugg-list">
      <view class="sugg-item" v-for="(item,i) in searchResults" :key="i" @click="gotoDetail(item.goods_id)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="arrowright" size="15"></uni-icons>
      </view>
    </view>

    <!-- 4. 搜索历史的基本结构
    4.2 v-if="keyWord.length ==0" 当搜索框的关键词为0时，才显示搜索历史模块 
    4.7 uni-icons标签内绑定点击事件，清空搜索历史记录 @click="cleanHistory"-->
    <!-- 搜索历史 -->
    <view class="history-box" v-if="keyWord.length==0">
      <!-- 标题区域 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
      </view>
      <!-- 列表区域 -->
      <!-- 5.1 点击搜索历史记录跳转到商品列表页面 -->
      <view class="history-list">
        <uni-tag :text="item" v-for="(item, i) in historyList" :key="i" @click="gotoGoodsList(item)">
        </uni-tag>
      </view>
    </view>

  </view>
</template>

<script>
export default {
  name: "search",
  options: {
    styleIsolation: "shared",
  },
  data() {
    return {
      timer: null, //计时器
      keyWord: "", //搜索关键词
      searchResults: [], //3.1搜索结果列表
      // historyList: ["连衣裙", "电脑", "手机"], //4.1 搜索关键词的历史记录
      historyList: [], //4.1 搜索关键词的历史记录
    };
  },
  methods: {
    // input输入事件的处理函数,当搜索框内输入文字时，输入的值= res
    input(res) {
      // 设置防抖定时器，用户在输入框停顿时间超过500毫秒时才触发定时器
      clearTimeout(this.timer); //清除timer对应的延时器（为下一次触发定时器而清空this.timer的值）
      this.timer = setTimeout(() => {
        //如果500毫秒内没有触发新的输入事件，则为搜索关键词赋值
        this.keyWord = res;
        // console.log(this.keyWord);
        // 3.2 根据关键词，查询搜索建议列表
        this.getSearchList();
      }, 500);
    },

    // 3.3 获取搜索结果数据转存给searchReasults数组
    async getSearchList() {
      if (this.keyWord === "") {
        this.searchResults = [];
        return;
      }
      const { data: res } = await uni.$http.get(
        "/api/public/v1/goods/qsearch",
        { query: this.keyWord }
      );
      if (res.meta.status !== 200) return uni.$showMsg();
      this.searchResults = res.message;

      // 4.3查询到搜索建议后调用saveSearchHistory()方法，将搜索关键词存入historyList数组中
      this.saveSearchHistory();
    },

    // 3.6点击搜索建议的 Item 项，跳转到商品详情页面：
    gotoDetail(goods_id) {
      uni.navigateTo({
        url: "/subpkg/goods_detail/goods_detail?goods_id=" + goods_id,
      });
    },

    // 4.4 查询到搜索建议后调用saveSearchHistory()方法，将搜索关键词存入historyList数组中,保存搜索关键词为历史记录
    saveSearchHistory() {
      this.historyList.unshift(this.keyWord); //将搜索关键词加在historyList数组前面
      // console.log(this.historyList);
      let histories = new Set(this.historyList); //数组去重
      this.historyList = Array.from(histories);
      // console.log(histories);
      // console.log(this.historyList);

      // 4.5 调用uni.setStorageSync(key,value)将搜索历史记录持久化存储到本地
      uni.setStorageSync("keyWord", JSON.stringify(this.historyList));
    },

    // 4.8 清空搜索历史记录,
    cleanHistory() {
      this.historyList = [];
      uni.clearStorageSync(); //清除本地存储的历史记录
    },

    //5.2 点击搜索历史的item项，跳转到商品列表页面，处理函数
    gotoGoodsList(keyWord) {
      uni.navigateTo({
        url: "/subpkg/goods_list/goods_list?query=" + keyWord,
      });
    },
  },
  onLoad() {
    // 4.6 在onLoad生命周期函数中，加载本地存储的搜索历史记录
    this.historyList = JSON.parse(uni.getStorageSync("keyWord") || "[]");
  },
};
</script>
<style scoped lang="scss">
/* @import url(); 引入css类 */
// 在sass里面，修改uni-ui内置组件的样式，通过::deep 组件名可以查找到对应组件的class名
// ::v-deep .uni-searchbar {
//   background-color: #c00000;
// }
.search-box {
  background-color: #c00000;
  width: 100%;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 999;
}
.sugg-list {
  padding: 0 8px;
  .sugg-item {
    padding: 13px 0;
    font-size: 12px;
    border-bottom: 1px solid #efefef;
    // 每一item的文字和>flex布局，主轴上文字和箭头两端对齐，侧轴居中对齐
    display: flex;
    justify-content: space-between;
    align-items: center;
    .goods-name {
      // 文字在一行显示，溢出隐藏，并用...显示
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: 3px;
    }
  }
}
.history-box {
  padding: 0 5px;
  // border: 1px solid red;
  .history-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    font-size: 12px;
    border: 1px solid #efefef;
  }
  .history-list {
    display: flex;
    flex-wrap: wrap;
    ::v-deep uni-tag {
      padding: 3px;
      .uni-tag {
        display: block;
        color: black;
        background-color: #ccc;
        border: none;
      }
    }
  }
}
</style>