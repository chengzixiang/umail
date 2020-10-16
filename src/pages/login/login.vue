<template>
  <div class="login">
    <div class="box">
        <h1 class="center">登陆</h1>
        <div>
<!-- 3.变量传上来 ======================================= -->
          <!-- clearable是输入内容后面有叉号 -->
          <el-input class="top" placeholder="请输入内容" v-model="form.username" clearable></el-input>
        </div>
        <div>
          <!-- show-password是输入内容后面有眼睛可以看见密码 -->
         <el-input class="top" placeholder="请输入密码" v-model="form.password" clearable show-password></el-input>
        </div>
        <div>
          <!-- 给登陆写一个跳转进入 -->
          <el-button class="top center" type="primary" @click="login">登陆</el-button>
        </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
// 4.  得判断是否成功 所以需要ajax请求  先引入==========================================
import {reqLogin} from "../../utils/request";
import {successAlert,warningAlert} from "../../utils/alert";
export default {
  props: [],
  components: {},
  data() {
    return {
// 1.  登陆验证 先写接口==========================================
// 2.  有两个输入框获取用户输入的值 所以这里设置一个变量接收==========================================
      form:{
        //名字跟后端保持一致方便使用
        username:"",
        password:"",
      }
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({
      //5.2先引进来   后面的值 因为不是任何模块下的 直接写就行
      changeUserInfoAction:"changeUserInfoAction",
    }),
      //登陆
      //$router路由push是跳转到
      login(){
// 5.  当点了登陆按钮就要登陆 要把用户填的数据传走==========================================
        reqLogin(this.form).then(res=>{
         //5.1  list 数据都是需要用的 应该把他存起来
        // 判断成功失败 存储list
             if(res.data.code==200){
              //登陆成功 先弹一个弹框
              successAlert("登陆成功");
              //res.data.list 就是用户登陆信息 是一个json 存储数据提供给很多组件使用 
              //存值存在状态层  因为不属于任何模块 所以应该存在根级别下 根级别的状态在mutations里面写  取值的时候用 vuex取值更方便
           //5.3这时就要触发action 这时候数据存起来
              //但是这个数据刷一下就没了所以用本地存储  希望刷新还有 所以回到 mutilation里面操作
              this.changeUserInfoAction(res.data.list);
              // console.log(this.$store);
            //5.4  登陆成功跳转页面   
              this.$router.push("/")
 // 6.  登陆拦截  没有登陆的 无法访问   在router操作  ==========================================

            }else{  
              warningAlert(res.data.msg)
            }
        })
      },

  },
  mounted() {},
};
</script>
<style scoped>
.login{
  height: 100vh;
  width: 100vw;
  background: linear-gradient(to right,#563443,#373b5a);
  position: relative;
}
.box{
  width:400px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  padding: 20px;
  background: #FFF;
  border-radius: 20PX;
}
.top{
  margin-top: 10px;
}
.center{
  width: 100%;
  text-align: center;
}
</style>