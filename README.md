# uni_vue2_cli_shop

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 终端启动项目运行在微信小程序的指令 npm run dev:mp-weixin
## 轮播图的接口：https://applet-base-api-t.itheima.net/slides
## 九宫格接口：https://applet-base-api-t.itheima.net/categories
## 本地生活 获取并渲染商铺列表的数据：https://applet-base-api-t.itheima.net/categories/${this.data.query.id}/shops


# 一、构建uni_vue2_cli_shop项目
  1. 创建根文件夹，打开终端或CMD
  2. 全局安装 vue-cli 指令：npm install -g @vue/cli@4.5.15 (Vue2创建的项目，脚手架版本要用@4的版本，用@5的版本运行项目会报错，这里推荐 @4.5.15)只需安装一次，之前安装过则可以跳过
  3. 通过 CLI 创建 uni-app 项目 指令：vue create -p dcloudio/uni-preset-vue uni_vue2_cli_shop
  4. 选择项目模板，选择默认模板
  5. 在vscode商店安装vue语法提示插件vetur 、 scss 插件 、uni-app-schemas插件（提供语法提示和校验工作）
  6. 进入uni_vue2_cli_shop目录，终端指定在微信小程序中启动项目 指令 npm run dev:mp-weixin
  7. 打开微信小程序开发者工具，点击➕，导入项目，打开uni-app(10)文件夹-->选择uni_vue2_cli_shop-->选择dist--> 选择dev--> 选择 mp-weixin 
  8. 安装sass 指令：npm install sass-loader node-sass
  9. 应用商店安装：小程序开发助手，wechat-snippet 

# 二、创建页面和配置tabBar底部导航栏效果
  1. 在pages文件夹下新建home cate cart admin四个文件夹，分别再创建对应的.vue文件
  2. 在pages.json中完成配置 
    {
      "pages": [
        {
          "path": "pages/home/home",
          "style": {
            "navigationBarTitleText": "首页"
          }
        },
        {...},{...}
      ]
      "tabBar": {
        "list": [
          {
            "pagePath": "pages/home/home",
            "text": "首页",
            "iconPath": "static/tab_icons/home.png",
            "selectedIconPath": "static/tab_icons/home-active.png"
          }, 
          {...},{...}
        ]
      },
    },

# 三、home首页的制作：
  1. git相关： 
    * 打开项目终端创建分支 指令git branch 查看当前分支
    * 指令git checkout -b home创建home分支
    * 指令 git branch查看所有的分支，出现home表示分支创建成功

  2. 配置网络请求
    * 由于平台的限制，小程序项目中不支持axios，而且原生的wx.request() API功能较为简单，不支持拦截器等全局定制的功能，因此建议在uni-app项目中使用@escook/request-miniprogram第三包发起网络数据请求
    * 步骤：
    - 1. 打开CMD 或Power Shall 进入uni_vue2_cli_shop项目终端，输入指令npm install @escook/request-miniprogram
    - 具体的安装顺序在：https://www.npmjs.com/package/@escook/request-miniprogram
    - 2. 打开main.js入口文件，进行配置
      + import { $http } from '@escook/request-miniprogram' // 按需导入 $http 对象
      + uni.$http = $http  //在 uni-app 项目中，可以把 $http 挂载到 uni 顶级对象之上，方便全局调用
      + $http.baseUrl = 'https://www.example.com' //配置请求根路径

  3. 在需要发起网络请求的页面对应的js文件中使用请求方式————打开home.vue文件:
  4. 获取轮播图数据：
     + data(){
         return {
           swiperList : [], //1.定义轮播图的数据列表，将来获取到的轮播图数据将存到swiperList数组中
         }
       }
       onLoad(){ //小程序的页面声明周期onLoad(){}
         this.getSwiperList() //2. 当页面一加载时，调用onLoad(){}，随即调用this.getSwiperList(){}方法
       }
       methods{
         async getSwiperList(){
           const { data: res } = await uni.$http.get("/api/public/v1/home/swiperdata");
           if (res.meta.status !== 200) {
             return uni.showToast({
               title: "数据请求失败！",
               duration: 1500,
               icon: "none",
             });
           }
           this.swiperList = res.message;
         }
       }
    
  5. 展示轮播图数据:
     <template >
        <view>
          <!-- 轮播图的区域 -->
          <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :cirecular="true">
            <swiper-item v-for="(item,i) in swiperList" :key="i">
              <view class="swiper-item">
                <image :src="item.image_src"></image>
              </view>
            </swiper-item>
          </swiper>
        </view>
      </template>

  6. 配置小程序页面的分包
    - 点击home页面的轮播图进入对应的详情页面，该详情页即作为分包。只有点击了轮播图才加载对应的详情数据。步骤：
    - 1. 在src文件夹下创建与pages文件夹同级的subpkg文件夹-->创建goods_detail文件夹-->创建goods_detail.vue文件
    - 2. 进入pages.json文件，添加配置：
      * {
        "pages":[{
          "path":"pages/index/index",
          "style":{}
          },{
            "path":"pages/index2/index2",
            "style":{}
          },{...},...],

        "subPackages":[{ //分包的配置
          "root":"subpkg",// 分包所在的根路径是subpkg
          "pages":{
            "path":"goods_detail/goods_detail" //分包的路径
            "style":{} //设置分包的样式
          }
          "independent":"true" //是否为独立分包 默认是false时不用写该属性
        }],

        "tabBar":{...}
      }
  
  7. 封装uni.$showMsg()方法：
    - 1. 在home.vue页面中，当数据请求失败后，经常要调用uni.showToast({...})方法来提示用户。此时，可以在main.js中全局封装一个uni.$showMsg()方法来简化uni.showToast()方法的调用。
    - 2. 步骤：
      * 在main.js中，为uni对象挂载自定义的$showMsg()方法：
        uni.$showMsg = function(title = "数据加载失败", duration =1500) {
          uni.showToast({
            title,
            duration,
            icon: 'none'
          })
        }
      * 在home.vue中，当状态码不等于200时，说明请求数据失败，则直接return并调用uni.$showMsg() ：
        if (res.meta.status !== 200) return uni.$showMsg();

  8. 首页的分类导航制作：
     + data(){
         return {
           navList : [], //1.定义商品分类的数据列表，将来获取到的轮播图数据将存到navList数组中
         }
       }
       onLoad(){ //小程序的页面声明周期onLoad(){}
         this.getNavList() //2. 当页面一加载时，调用onLoad(){}，随即调用this.getNavList(){}方法
       }
       methods{
         async getNavList(){
           const { data: res } = await uni.$http.get("/api/public/v1/home/catitems");
           if (res.meta.status !== 200) {
             return uni.$showMsg();
           }
           this.navList = res.message;
         }
       }

  9. 渲染分类导航的UI结构，当点击第一项"分类"，切换到底部导航栏"分类"页面
    <view class="nav-list">
      <view class="nav-item" v-for="(item ,index) in navList" :key="index" @click="navClickHandler(item)">
        <image class="nav-img" :src="item.image_src"></image>
      </view>
    </view> 
    methods:{
      navClickHandler(item){
        if(item.name === "分类"){
          uni.switchTab({
            url:"pages/cate/cate"
          })
        }
      }
    } 

  10. 首页的楼层区域制作：
      + data(){
         return {
           floorList : [], //1.定义商品分类的数据列表，将来获取到的轮播图数据将存到navList数组中
         }
       }
       onLoad(){ //小程序的页面声明周期onLoad(){}
         this.getFloatList() //2. 当页面一加载时，调用onLoad(){}，随即调用this.getFloorList(){}方法
       }
       methods{
         async getFloorList(){
           const { data: res } = await uni.$http.get("/api/public/v1/home/floordata");
           if (res.meta.status !== 200) {
             return uni.$showMsg();
           }
           this.floorList = res.message;
         }
      } 
      
      + <view class="floor-list">
        <!-- 不同的楼层项 -->
        <view class="floor-item" v-for="(item,index) in floorList" :key="index">
          <!-- 对应的楼层标题图片 -->
          <image :src="item.floor_title.image_src" class="floor-title"></image>
          <!-- 楼层的图片区域 -->
          <view class="floor-img-box">
            <!-- 左侧大图片 -->
            <view class="left-img-box">
              <image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx'}" mode="widthFix"></  image>
            </view>
            <!-- 右侧小图片 -->
            <view class="right-img-box">
              <view class="right-img-item" v-for="(its,indey) in item.product_list" :key="indey">
                <image v-if="indey !== 0" :src="its.image_src" :style="{width:its.image_width + 'rpx'}" mode="widthFix"></image>
              </view>
            </view>
          </view>
        </view>
      </view>
  
  11. 点击楼层图片跳转到商品列表页面
    - 1. 修改标签<view></view>为导航标签<navigator :url="XXX"></navigator>
      <view class="floor-item" v-for="(item,index) in floorList" :key="index">
        <navigator class="left-img-box" :url="...">
          <image :src="item.product_list[0].image_src" ></image>
        </navigator>
        <view class="right-img-box" >
          <navigator class="right-img-item" v-for="(its,indey) in item.product_list" :key="indey" :url="...">
          <image v-if="indey !== 0" :src="its.image_src" ></image>
          </navigator>
        </view>
      </view>
   - 2. 通过双层forEach循环，处理URL地址（实现：点击图片跳转到对应的商品详情页面。
       * res.message.forEach((item)=>{}) 第一层循环，循环的是每一个楼层
       * item.product_list.forEach((i)=>{}) 第二层循环，循环的是每一个楼层里面的每一张图片
       * (i)=>{i.url='/subpkg/goods_list/goods_list'+i.navigator_url.split('?')[1]} 重构每一张图片i的url地址= 分包路径subpkg下的goods_list文件夹下的goods_list文件+ 携带的参数为 i.navigator_url.split('?')[1]
       * i.navigator_url.split('?')[1] i.navigator_url以？分割，得到数组第1个项。即得到携带的参数
       * 通过<navigator :url="XXX.url"></navigator>标签,实现跳转
      async getFloorList() {
        const { data: res } = await uni.$http.get("/api/public/v1/home/floordata");
        if (res.meta.status !== 200) return uni.$showMsg();

        res.message.forEach((floorItem) => {
          floorItem.product_list.forEach((productItem) => {
            productItem.url = "/subpkg/goods_list/goods_list?" + productItem.navigator_url.split("?")[1];
          });
        });

        this.floorList = res.message;
      }
   - 3. 给navigator添加绑定的url地址
      <navigator class="left-img-box" :url="">
        <image :src="item.product_list[0].image_src" ></image>
      </navigator>
      <view class="right-img-box" >
        <navigator class="right-img-item" v-for="(its,indey) in item.product_list" :key="indey" :url="...">
          <image v-if="indey !== 0" :src="its.image_src" ></image>
        </navigator>
      </view> 

  12. home页面完成，上传到git
    * 将本地的home分支进行本地的commit提交 
      git add .
      git commit -m "完成了home首页的开发"
    * 将本地的home分支合并到本地的master分支
      git checkout master
      git merge home
    * 删除本地的home分支
      git branch -d home

# 四、分类页面制作cate
  1. git 创建cate分支：在根目录下打开git bash 输入指令git checkout -b cate
  2. 分类页面的基本结构 
      <view class="scroll-view-container">
        <scroll-view scroll-y="true"  :style="{height: wh + 'px'}"><!-- 左侧滑动区 -->
          <block v-for="(item ,cat_id) in cateList" :key="cat_id"><!-- 2.4遍历左侧的一级标题项目-->
           <view>{{item.cat_name}}</view>
          </block>
        </scroll-view>
        <scroll-view scroll-y="true" :style="{height: wh +'px'}"><!-- 右侧滑动区 -->
          <view v-for="(item2, indey) in cateLevel2" :key="indey"><!--遍历右侧的二级标题-->
          <view>/ {{ item2.cat_name }} /</view>
          </view>
        </scroll-view>
      </view>
  3. 具体的步骤见cate.vue
  4. 分类页面完成，通过git上传到git hub
    * 将本地的cate分支进行本地的commit提交 
      git add .
      git commit -m "完成了cate分类页面的开发"
    * 将cate分支提交到git hub远程仓库
      git push -u origin cate
    * 将本地的cate分支中的代码合并到本地的master分支
      git checkout master
      git merge cate
      git push
    * 删除本地的cate分支
      git branch -d cate

# 五、搜索相关的内容
  1. 创建git分支search
    * 终端打开git bash
    * git branch 查看当前分支
    * git checkout -b search 创建并切换进入search分支
    * git branch 查看，出现search表示分支创建成功

  2. 创建自定义搜索组件my-search，并将组件放入分类页面的顶部区域
    - 1. 在src文件夹下创建与pages同级别的components文件夹-->创建my-search文件夹-->创建my-search.vue文件为自定义的组件
    - 2. 在cate分类页面使用my-search自定义组件，则在cate.vue中：
      * 引入自定义组件 import mySearch from "../../components/my-search/my-search";
      * 注册组件 components: {mySearch,},
      * 使用组件 <my-search></my-search>
    
     # -3. 自定义搜索组件my-search的基本布局
      * uni-app 的扩展组件uni-ui的安装和使用：
       - uni-ui是Dcloud提供的一个跨端ui组件库，它是基于vue组件的，flex布局的，无dom的跨全端ui框架。uni-ui不包括基础组件，它是基础组件的补充。（uni-ui组件包括：......)
       - uni-ui组件的安装方式： https://uniapp.dcloud.net.cn/component/uniui/quickstart.html
      * npm安装具体步骤：
        1. 在根目录下新建vue.config.js文件，并粘贴
        module.exports = {
		      transpileDependencies:['@dcloudio/uni-ui']
        }
        2. 项目终端输入指令npm i @dcloudio/uni-ui   或   yarn add @dcloudio/uni-ui
        3. 配置easycom规则，让 npm 安装的组件支持 easycom。打开项目根目录下的 pages.json 并添加 easycom 节点：
        "easycom": {
        	"autoscan": true,
        	"custom": {
        		// uni-ui 规则如下配置
        		"^uni-(.*)": "@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue"
        	}
        },
        4. 在my-search自定义组件页面内引用组件：import {uniBadge} from '@dcloudio/uni-ui'
        5. 注册组件 components：{uniBadge}
        6. 在 template 中使用组件：<uni-badge text="1"></uni-badge>

    - 4. 通过设置props属性，动态绑定组件style样式，增加自定义组件在不同页面的使用时的灵活性（具体见my-search页面的步骤2）
    - 5. 通过点击事件，在自定义组件内通过this.$emit('事件名')向外发送事件，在对应的使用自定义组件的页面中通过 @事件名='响应事件'，做出对应的事件响应，跳转到search分包页面(具体见cate页面的步骤9，home页面的步骤4)

  # 3. 搜索建议页面search.vue
    - 1. 新建search分包页面。在subpkg文件夹-->新建search文件夹-->search.vue文件
    - 2. pages.json文件配置分包
      "subpackages":[{
        "root": "subpkg",
        "pages": [{
          "path": "search/search",
          "style": {}
        }]
      }] 
    - 3. 顶部搜索框的制作：
      <view class="search-box">
        <uni-search-bar placeholder="自定义背景色" @input="input" focus="true" radius="100" cancelButton='none'>
        </uni-search-bar>
      </view>
      其中uni-search-bar 是uni-ui的内置组件。@focus='true'用于实现搜索框内自动聚焦；radius=100表示搜索框的圆角尺寸；cancel Button='none'用于内置组件的“取消按钮”不显示，@input='input' 绑定input输入框事件，这些内置组件的功能的具体用法都可以在uni-app官网查找。

      data() {
        return {
          timer: null, //1.计时器
          keyWord: "", //2.搜索关键词
          searchResults: [], //3.1搜索结果列表
        };
      },
      methods: {
        // input输入事件的处理函数,当搜索框内输入文字时，输入的值= res
        input(res) {
          // 设置防抖定时器，用户在输入框停顿时间超过500毫秒时才触发定时器
          clearTimeout(this.timer); //清除timer对应的延时器
          this.timer = setTimeout(() => {
            //如果500毫秒内没有触发新的输入事件，则为搜索关键词赋值
            this.keyWord = res;
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
        },
      }
    — 展示搜索建议列表searchResults ,点击搜索建议的 Item 项，跳转到商品详情页面@click="gotoDetail(item.goods_id)"
      <view class="sugg-list">
        <view class="sugg-item" v-for="(item,i) in searchResults" :key="i" @click="gotoDetail(item.goods_id)">
          <view class="goods-name">{{item.goods_name}}</view>
          <uni-icons type="forward" size="15"></uni-icons>
        </view>
      </view>
      gotoDetail(goods_id) {
        uni.navigateTo({
          url: "/subpkg/goods_detail/goods_detail?goods_id=" + goods_id,
        });
      },

   - 4. 搜索历史
  
  # 4. 分支的合并与提交
    * 将本地的search分支进行本地提交 
      git add .
      git commit -m "完成了搜索功能的开发"
    * 将本地的search分支合并到本地的master分支
      git checkout master
      git merge search
      git push
    * 将本地的search分支推送到GitHub
     git push -u origin search
    * 删除本地的home分支
      git branch -d search

# 六、商品列表页面 goodslist
  1. 创建goodslist分支--在根目录下打开git bash 输入指令git checkout -b goodslist
  2. 进入商品列表页面的三个途径：
    - 1. 在home首页的楼层区域，点击楼层内的图片进入商品列表页面（携带的参数是）
    - 2. 在cate分类页面，点击右侧的分类图片进入（携带的参数是）
    - 3. 在search搜索页面，点击搜索历史的关键词进入
  3. 进入src>subpkg>goods_list>goods_list.vue页面，编辑：
  <template>
    <view class="goods-list">
      <block v-for="(item ,goods_id) in goodsList" :key="goods_id">
        <view class="goods-item">
          <view class="goods-item-left">   //商品左侧图片区域
            <image :src="item.goods_small_logo || defaultPic" class="goods-pic"></image>
          </view>
          <view class="goods-item-right">    //商品右侧信息区域
            <view class="goods-name">{{item.goods_name}}</view>
            <view class="goods-info-box">
              <view class="goods-price">￥{{item.goods_price.toFixed(2)}}</view>
            </view>
          </view>
        </view>
      </block>
    </view>
  </template>
  data() {
    return {
      queryObj: {// 1.1 设置请求的参数对象queryObj
        query: "", //点击home首页的楼层图片携带query=''参数，跳转到goods_list页面
        cat_id: "", //点击cate分类页面的三级分类图片，携带cid=''参数，跳转到goods_list页面
        pagenum: 1, //设置当前goods_list页面的页码值
        pageSize: 10, //设置页面每页显示10条数据
      },
      goodsList: [], //用于保存当goods_list页面一加载，发送获取商品列表数据的请求
      total: 0, //商品列表的条数
      defaultPic: "/src/static/logo.png", //图片加载失败时显示此默认图片的路径
    };
  },
  onLoad(options) {
    //options 是一个内置参数对象，当onLoad触发，options中即携带了跳转时的参数
    // 1.2 当页面一加载，将跳转时携带的参数转存到queryObj对象中：
    this.queryObj.query = options.query || "";   //来自home首页的query=''参数转存到this.queryObj.query
    this.queryObj.cat_id = options.cat_id || ""; //来自cate分类的三级分类的cat_id=''参数转存到this.queryObj.cat_id
    this.getGoodsList(); // 1.3通过页面跳转时携带的参数，发送请求，获取数据
  },
  methods: {
    async getGoodsList() {// 1.4 获取商品列表数据的方法
      const { data: res } = await uni.$http.get("/api/public/v1/goods/search", this.queryObj); //this.queryObj是发送请求时携带的参数
      if (res.meta.status !== 200) return uni.$showMsg(); //当返回的状态码不等于200时，表示数据请求失败，即return出去，并调用封装的uni.shoeMsg()方法用于提示请求失败
      this.goodsList = res.message.goods; //转存获取到的商品列表数据
      this.total = res.message.total; //转存获取到的商品列表长度
    },
  },

  4. 把商品的item项封装为自定义的组件。新建components>goods_list_item>goods_list_item.vue :
    <view class="goods-item">
      <view class="goods-item-left">
        <image :src="item.goods_small_logo || defaultPic" class="goods-pic"></image>
      </view>
      <view class="goods-item-right">
        <view class="goods-name">{{item.goods_name}}</view>
        <view class="goods-info-box">
          <view class="goods-price">￥{{item.goods_price.toFixed(2)}}</view>
        </view>
      </view>
    </view>
    props: {
      item: { //接收goods_list传递的值
        type: Object,
        default: {},
      },
    },
    data() {
      return {
        defaultPic: "/src/static/logo.png",
      };
    },
    * 在goods_list.vue中：
      引入组件：import goodsListItem from "/src/components/goods_list_item/goods_list_item";
      注册： components: {goodsListItem, 
      使用：      
      <block v-for="(item ,goods_id) in goodsList" :key="goods_id">
        <goods-list-item :item="item"></goods-list-item>
      </block>

  5. 实现上拉加载更多
    - 1. 在page.json中，找到goods_list分包，并在style中添加"onReachBottomDistance": 100,
      {
        "root": "subpkg",
        "pages": [{
          "path": "goods_list/goods_list",
          "style": {
            "onReachBottomDistance": 100,
          }
        }]
      } 
    - 2. goods_list.vue中：
     data() {
       return {
         isLoading: false, //3.1节流阀，避免多次加载数据
       };
      },
     onLoad(options) {
      this.getGoodsList();
     },
     methods: {
       async getGoodsList() {
         this.isLoading = true; //3.2开启节流阀
         const { data: res } = await uni.$http.get("/api/public/v1/goods/search",this.queryObj);
         this.isLoading = false; //3.3关闭节流阀
         if (res.meta.status !== 200) return uni.$showMsg(); //当返回的状态码不等于200时，表示数据请求失败，即return出去，并调用封装的uni.shoeMsg()方法用于提示请求失败
         this.goodsList = [...this.goodsList, ...res.message.goods]; //3.4 通过解构赋值的方式，保存获取到的商品列表数据
         this.total = res.message.total; //转存获取到的商品列表长度
       },
     },
     onReachBottom() { // 3.5 上拉加载更多
       if (this.isLoading == true) return;
       if (this.queryObj.pagenum * this.queryObj.pageSize >= this.total)
         return uni.$showMsg("到底啦~");
       this.queryObj.pagenum++;
       this.getGoodsList();
     },

  6. 下拉重置商品列表
    - 1. 在page.json中，找到goods_list分包，并在style中添加"enablePullDownRefresh": true,"backgroundColor": "#F8F8F8"
    - 2. 
      methods: {
        async getGoodsList(cb) {
          this.isLoading = true;
          const { data: res } = await uni.$http.get("/api/public/v1/goods/search",this.queryObj ); //this.queryObj是发送请求时携带的参数
          this.isLoading = false; //3.3关闭节流阀
          cb && cb();
          ... ...
        },
      },
      onPullDownRefresh() {// 4.1 下拉刷新重置
        this.queryObj.pagenum = 1;
        this.total = 0;
        this.isLoading = false;
        this.goodsList = [];
        this.getGoodsList(() => { 
          uni.stopPullDownRefresh();
        });
      },

  7. 点击商品item项跳转到商品详情页面
    <view v-for="(item ,goods_id) in goodsList" :key="goods_id" @click="gotoDetail(item)">
      <goods-list-item :item="item"></goods-list-item>
    </view>
    gotoDetail(item) {
      uni.navigateTo({
        url: "/subpkg/goods_detail/goods_detail?goods_id=" + item.goods_id,
      });
    },   

  8. 分支的合并与提交
  * 将goodslist分支进行本地提交
    git add .
    git commit -m "完成了商品列表页面的开发"
  * 将本地的goodslist分支推送到码云
    git push -u origin goodslist
  * 将本地goodslist分支中的代码合并到master分支
    git checkout master
    git merge goodslist
    git push
  * 删除本地的goodslist分支
    git branch -d goodslist

# 七、商品详情页面goodsdetail.vue
  1. 创建分支，添加编译模式
    * 根目录打开git bash,输入git checkout -b goodsdetail
    * 在微信开发者工具中，添加编译模式subpkg/goods_detail/goods_detail 携带参数goods_id= 395

  2. 获取商品详情数据
    - 1. 获取商品详情页面
      data() {
        return {
          goods_info: {},                     //1.1 发送请求后获取到的商品详情信息
        };
      },
      onLoad(options) {                       //1.2 options保存了页面加载/跳转到当前页面时携带的参数
        const goods_id = options.goods_id;    //1.3 转存options中的goods_id参数为goods_id
        this.getGoodsDetail(goods_id);        //1.4 调用方法获取商品的详情数据（goods_id发送请求时携带的实际参数）
      },
      methods: {
        async getGoodsDetail(goods_id) {      // 1.5 获取商品的详情数据的方法
          const { data: res } = await uni.$http.get("/api/public/v1/goods/detail", 
          {goods_id: goods_id, });            //携带的参数goods_id:参数goods_id 简写{goods_id}

          if (res.meta.status !== 200) return uni.$showMsg();         //状态码不等于200时，表示获取商品详情数据出错，return并调用方法弹窗提示
          this.goods_info = res.message;                              //获取到的数据res.message转存到goods_info对象中
        },

  3. 通过v-for循环遍历，展示轮播图数据
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item, i) in goods_info.pics" :key="i">
        <image :src="item.pics_big"></image>
      </swiper-item>
    </swiper>

  4. 点击轮播图的图片显示对应的图片进行预览
    <image :src="item.pics_big" @click="preview(i)"></image> 给图片标签添加点击事件
    preview(i) {
      uni.previewImage({          //uni-app的内置API uni.previewImage()预览图片 （详见https://uniapp.dcloud.net.cn/api/media/image.html）
        current: i,               //预览时，默认显示图片的索引（current 为当前显示图片的链接/索引值）
        urls: this.goods_info.pics.map((x) => x.pics_big), //map(()=>{})方法遍历出每一项pic_big大图地址，返回的结果是一个图片地址组成的数组
      });
    },

  5. 渲染商品信息区域
    <view class="goods-info-box">
      <view class="price">￥{{goods_info.goods_price}}</view><!-- 商品价格 -->
      <view class="goods-info-body"><!-- 信息主体区域 -->
        <view class="goods-name">{{goods_info.goods_name}}</view>
        <view class="favi">
          <uni-icons type="star" size="18" color="gray"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <view class="transportation-expenses">快递： 免运费</view><!-- 运费 -->
    </view>

  6. 渲染商品的图文区域 
    <view class="goods-detail-container">
      <text class="info-title">详情展示</text>
      <rich-text :nodes="goods_info.goods_introduce"></rich-text>
    </view>
    * rich-text是uni-app的内置组件（具体用法在：https://uniapp.dcloud.net.cn/component/rich-text.html）
    async getGoodsDetail(goods_id) {
      const { data: res } = await uni.$http.get("/api/public/v1/goods/detail", {
        goods_id
      });
      if (res.meta.status !== 200) return uni.$showMsg(); 
     * 使用字符串的replace()方法，为img标签添加行内style样式，解决图片底部有空白间隙的问题,
     * 使用字符串的replace()方法,将图片为.webp格式改为.jpg格式，从而解决.webp格式图片在ios不显示的问题
      res.message.goods_introduce = res.message.goods_introduce
        .replace(/<img/g, '<img style="display:block;"')
        .replace(/webp/g, "jpg");

      this.goods_info = res.message; //获取到的数据res.message转存到goods_info对象中
    },

  7. 底部的商品导航区域
    <view class="goods_nav">
      <uni-goods-nav :fill="true" :options="options" :button-group="customButtonGroup" @click="onClick" @buttonClick="buttonClick" />
    </view>
      options: [
        {icon: "shop",
          text: "进入店铺",
          infoBackgroundColor: "#007aff",
          infoColor: "#f5f5f5",
        },{icon: "cart",
          text: "购物车",
          info: "",
        },
      ],
      customButtonGroup: [
        {text: "加入购物车",
          backgroundColor: "linear-gradient(90deg, #FFCD1E, #FF8A18)",
          color: "#fff",
        },{text: "立即购买",
          backgroundColor: "linear-gradient(90deg, #FE6035, #EF1224)",
          color: "#fff",
        },
      ],
    * <uni-goods-nav>是uni-app的扩展组件，具体见https://uniapp.dcloud.net.cn/component/uniui/uni-goods-nav.html

  8. 分支的合并与提交
   - 1. 将goodsdetail分支进行本地提交
    git add .
    git commit -m "完成了商品详情页面的开发"
   - 2. 本地的goodsdetail分支推送到GitHub
    git push -u origin goodsdetail
   - 3. 本地goodsdetail分支合并到master分支
    git checkout master
    git merge goodsdetail
    git push
   - 4. 删除本地的goodsdetail分支
    git branch -d goodsdetail

# 八、购物车页面
# 九、登录与支付
# 十、发布