<template>
  <div>
    <el-container class="box">
      <el-aside class="left" width="200px">
        <el-col>
          <!-- //左侧导航 -->
          <!-- //调整背景和样式 -->
          <!-- //router开启路由模式 el-menu加入router 下面的index直接 写 /名称 -->
          <!-- unique-opened 只展开一个子菜单 -->
          <el-menu
            class="el-menu-vertical-demo"
            background-color="#20222a"
            text-color="#fff"
            active-text-color="#ffd04b"
            router
            unique-opened
          >
          <el-menu-item index="/">
              <i class="el-icon-menu"></i>
              <span slot="title">首页</span>
            </el-menu-item>

            <!-- <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>系统设置</span>
              </template>
              <el-menu-item-group>

                <el-menu-item index="/menu">菜单管理</el-menu-item>
                <el-menu-item index="/role">角色管理</el-menu-item>
                <el-menu-item index="/manage">管理员管理</el-menu-item>
              </el-menu-item-group>

            </el-submenu>

            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>商城管理</span>
              </template>
              <el-menu-item-group> -->
<!-- 数据不能写死了 因为获取多少权限访问多少数据 -->
                <!-- <el-menu-item index="cate">商品分类</el-menu-item>
                <el-menu-item index="specs">商品规格</el-menu-item>
                <el-menu-item index="goods">商品管理</el-menu-item>
                <el-menu-item index="member">会员管理</el-menu-item>
                <el-menu-item index="banner">轮播图管理</el-menu-item>
                <el-menu-item index="seckill">秒杀活动</el-menu-item>
              </el-menu-item-group>

            </el-submenu> -->

<!-- 动态侧边栏 -->
              <!-- 判断一下 是否有二级菜单 然后再进行判断有哪些值 -->
            <div v-for="item in userInfo.menus" :key="item.id">
              <!-- 是目录 -->
              <!-- 判断根目录是否有子菜单 -->
              <el-submenu :index="item.id+''" v-if="item.children">
                <template slot="title">
                  <i :class="item.icon"></i>
                  <span>{{item.title}}</span>
                </template>
                <el-menu-item-group>
                  <!-- 判断有哪些菜单 -->
                  <el-menu-item v-for="i in item.children" :key="i.id" :index="i.url">{{i.title}}</el-menu-item>
                </el-menu-item-group>
              </el-submenu>

              <!-- 菜单 -->
              <!-- 判断有哪些菜单 -->
              <el-menu-item v-else :index="item.url">{{item.title}}</el-menu-item>
            </div>

          </el-menu>
        </el-col>
      </el-aside>
      <el-container>

        <el-header class="top">
            <div class="header-con">
            <h3>{{userInfo.username}}</h3>
            <el-button type="danger" @click="logOut()">退出登录</el-button>
        </div>
      </el-header>

        <el-main class="bottom">
          <!-- 引入ui面包屑模板 -->
          <!-- 设置每一个页面都在右上角有的首页标志 -->
          <el-breadcrumb v-if="$route.name" separator-class="el-icon-arrow-right">
            <!-- 判断一下$router.name有东西再出没有就不出 -->
            <!-- v-if判断 直接判断 有就是true 没有就false -->
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <!-- el-breadcrumb-item之间是不确定的词  所以用 name去做 -->
            <!-- 在router中index每一个二级路由加一个name属性 -->
            <!-- 引用的时候直接{{}} 中$route.name就行 -->
            <!-- 注意这里用的是route -->

            <!-- route和router的区别  
            route是局部对象是获取name,path,params,query等
            router是全局对象 包含了所有的路由包含了许多关键的对象和属性
             -->
            <el-breadcrumb-item>{{$route.name}}</el-breadcrumb-item>
          </el-breadcrumb>

          <!-- 因为main的内容是不确定的 所以再此设置二级路由出口 -->
          <router-view class="con"></router-view>
        </el-main>

      </el-container>
    </el-container>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  props: [],
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
    //先把数据取出来
      userInfo:"userInfo",
    }),
  },
    methods: {
    ...mapActions({
      changeUserInfoAction:"changeUserInfoAction"
    }),
    //退出
    logOut(){
      this.changeUserInfoAction({});
      this.$router.push("/login")
    }
  },
  mounted() {},
};
</script>
<style scoped>
.box {
  height: 100vh;
}
.left {
  background: #20222a;
}
.top {
  background: #b3c0d1;
}
.con{
  margin-top: 10px;
}
.header-con{
  float: right;
}
.header-con h3{
  float: left;
  line-height: 60px;
  font-weight: 400;
}
.header-con .el-button{
  float: left;
  margin-top: 10px;
}
</style>