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