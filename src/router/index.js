import Vue from 'vue'
import Router from 'vue-router'
//路由和状态层 都是 互相使用  首先先引入仓库
import store from "../store"

Vue.use(Router)

//路由独享守卫
function checkedEnter(path, next) {
  let menus_url = store.state.userInfo.menus_url;
  if (menus_url.includes(path)) {
    next()
  } else {
    next("/")
  }
}


//首页下面的二级路由规则
//定义一个 indexRoures 把二级路由写外面 然后下面 直接 ...indexRoutes引入就行
//export 是导出该内容 导出以后其他页面也可以用
export let indexRoutes = [
  {
    path: "menu",
    name:"菜单管理",
    component: () => import("../pages/menu/menu.vue"),

    //每一个都要判断所以提出来

    // beforeEnter(to,from,next){
      

    //   //如何查看有权限 menus_url有和路径就有
    //   // store.state.userInfo.menus_url;这那个数组
      
    //   let menus_url = store.state.userInfo.menus_url;
    //   console.log(menus_url)
    //   //然后查看数组里面有没有/menu  判断如果这个包含了
    //   // /menu 那么就显示 否则就去到home

    //   if(menus_url.includes('/menu')){
    //     console.log(menus_url.includes('/menu')?1:2)
    //     next()
    //   }else{
    //     next("/")
    //   }
    // },

    beforeEnter(to,from,next){
      checkedEnter("/menu",next)
    }
  },
  {
    path: "role",
    name: "角色管理",
    component: () => import("../pages/role/role.vue"),
    beforeEnter(to, from, next) {
      checkedEnter('/role', next)
    }
  },
  {
    path: "manage",
    name: "管理员管理",
    component: () => import("../pages/manage/manage.vue"),
    beforeEnter(to, from, next) {
      checkedEnter('/manage', next)
    }
  },
  {
    path: "cate",
    name: "商品分类",
    component: () => import("../pages/cate/cate.vue"),
    beforeEnter(to, from, next) {
      checkedEnter('/cate', next)
    }
  },
  {
    path: "specs",
    name: "商品规格",
    component: () => import("../pages/specs/specs.vue"),
    beforeEnter(to, from, next) {
      checkedEnter('/specs', next)
    }
  },
  {
    path: "goods",
    name: "商品管理",
    component: () => import("../pages/goods/goods.vue"),
    beforeEnter(to, from, next) {
      checkedEnter('/goods', next)
    }
  },
  {
    path: "member",
    name: "会员管理",
    component: () => import("../pages/member/member.vue"),
    beforeEnter(to, from, next) {
      checkedEnter('/member', next)
    }
  },
  {
    path: "banner",
    name: "轮播图管理",
    component: () => import("../pages/banner/banner.vue"),
    beforeEnter(to, from, next) {
      checkedEnter('/banner', next)
    }
  },
  {
    path: "seckill",
    name: "秒杀活动",
    component: () => import("../pages/seckill/seckill.vue"),
    beforeEnter(to, from, next) {
      checkedEnter('/seckill', next)
    }
  },
]

// 设置一个let router  在最后再导出
let router =  new Router({
  routes: [
  //写完首页然后配置一级路由
    {
      //path配置的是 浏览器后面的路径
      path:"/login",
      //配置组件调用的路径 
      component:()=>import("../pages/login/login.vue")
    },
    {
      //这个/是localhost8080一进去的时候就是 /
      path:"/",
      component:()=>import("../pages/index/index.vue"),
      //写好配置文件后 再此写入二级路由 
      //子组件
      children:[
        {
          path:"",
          component:()=>import("../pages/home/home.vue"),
        },
        ...indexRoutes
      ]
    },
  ]
})

/* ==========================登陆拦截============================= */
// router.beforeEach() 登陆操作  导航守卫
//to”: 即将要进入的目标 路由对象;（这个对象中包含name，params，meta等属性）
// "from": 当前导航正要离开的路由对象；（这个对象中包含name，params，meta等属性）
// “next”: Function: 确保要调用 next 方法，否则钩子就不会被 resolved
router.beforeEach((to, from, next) => {
  //1.如果是登陆 直接next
  if (to.path == '/login') {
    next()
    return;
  }

  //2.如果去的不是登陆想要跳转访问 首先判断一下有没有登陆 如果登陆过就next
  //没有登陆过就只能到 （"/login"）
  //3. 使用仓库 首先在上面引入  因为仓库没有存储 login 所以只要不是login都会打印仓库
  //如果store.state.userInfo这是一个json随便.一个 没有就是undefined undefined就去登陆
  if (store.state.userInfo.token) {
    next();
    return;
  }
  next("/login")
//4. 登陆完成后 开始权限验证
    //1.菜单管理为例 首先因为只有权限获取到才能获取到菜单 
    //针对某一个单独的菜单 这个时候就用到了 路由独享守卫(beforeEnter)
    //看上面
})



export default router