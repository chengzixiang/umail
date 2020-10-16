<template>
  <div>

    <!-- 刚开始弹框不出来  sync的值起一个变量叫 isshow isshow是不出来的刚开始
          sync=""  ""引号里面应该有一个值去控制他 并且是一个真假值 真就出来 假就不出来
     -->
     <!-- 添加完成实现后 但是会出问题 当显示的时候 再点击空白处会报错
          原因是 当点击空白处的时候 会将sync="false" sync的值写成false
          子组件直接去修改父组件的值是不行的
          子组件要修改 父组件的值就是 父变子变 子变父变
          ***为了解决这个问题所以前面传值的时候  需要传json 而不是变量
      -->
      <!-- 结束的时候 弹框关闭 刷新弹框 -->
    <el-dialog :title="info.isAdd?'添加管理员':'编辑管理员'" :visible.sync="info.isshow" @closed="closed">



      <!-- <h1>菜单add</h1> -->
      <!-- 上面的 v-model里面的 form.name数据是下面
          return返回数据里面的 form属性里面的name
     -->
      <el-form ref="form" :model="form" label-width="80px">

        <el-form-item label="所属角色">
          <!-- 下拉菜单 -->
          <!-- 当form.pid发生修改的时候 下面的form.type就需要修改
                这是根据上面选择的顶级菜单做联动的
                所以这里用@change
           -->
          <el-select v-model="form.roleid" placeholder="请选择上级菜单">
            <!-- label是你选中的词  value是展示 的词 -->
            <!-- value中number类型就在前面加：要不然就是字符串 -->
            <el-option label="请选择" disabled value=""></el-option>
            <!-- list有几个 下拉菜单就应该有几个数据 -->
            <el-option
             v-for="item in rolelist" 
             :key="item.id" 
             :label="item.rolename"
              :value="item.id">
              </el-option>
          </el-select>

        </el-form-item>

          <el-form-item label="用户名">
          <el-input v-model="form.username"></el-input>
        </el-form-item>

        <el-form-item label="密码">
          <el-input v-model="form.password"></el-input>
        </el-form-item>


        <el-form-item label="状态">
          <!-- 这里要求打开是1 关闭是2 而且是number类型
               所以这里应用的是 active-value 选中的值和
               inactive-value没有选择的值 
               要的number类型 所以前面还需要加 ：
           -->
          <el-switch
           v-model="form.status"
            :active-value="1" 
            :inactive-value="2">
            </el-switch>
        </el-form-item>

        <!-- <el-form-item>
          <el-button type="primary">添加</el-button>
          <el-button>取消</el-button>
        </el-form-item> -->
      </el-form>


      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
       <el-button type="primary" @click="add" v-if="info.isAdd">
        添 加
          </el-button>
        <el-button type="primary" @click="update" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import { mapGetters, mapActions } from "vuex";

//接口写好之后 这里需要用接口就引入
import {reqManageAdd,reqManageDel,reqManageDetail,reqManageUpdate} from "../../../utils/request"

//下面要用弹框 所以引入
import {warningAlert,successAlert} from "../../../utils/alert"

export default {
  //传过来的变量只要再此接受下就能用了
  props: ["info"],
  components: {},
  data() {
    return {
  
      // 没有绑定数据的
      // form: {
      //   name: "",
      // },
      
      //根据后台要的给 要根后台要求是一至的
      form: {
        roleid:"",
        username:"",
        passwoed:"",
        status:1
      },
    };
  },
  computed: {
    ...mapGetters({
      rolelist:"role/list"
    }),
  },
   methods: {
    //添加完成后要刷新列表数据   刷新数据直接重新请求列表数据就行
    ...mapActions({
      reqRoleListAction:"role/reqListAction",
      reqManageList:"manage/reqListAction",
      reqTotalAction:"manage/reqTotalAction",

    }),
    //按钮 取消
    cancel(){
      this.info.isshow=false;
    },
    //弹框消失 刷新弹框
    closed(){
      //如果是添加开的弹框，就什么都不做；如果是编辑开的弹框，就清除form
      if(!this.info.isAdd){
        this.empty()
      }
    },
    empty(){
        this.form={
          roleid:"",
          username:"",
          password:"",
          status:1
        }
      },

    //点击了 添加按钮就要请求了
    add(){
      console.log("asd");
      //在发参数之前 可先注释一下 然后 log下 看看是不是自己想要的东西
      // console.log(this.form);

      //请求成功之后就可以看结果了
      //reqMenuAdd（）请求的括号里面需要传一堆的参数 还要符合后端需求
      //后台要的是json  而this.form就是json 传过去就行
      reqManageAdd(this.form).then((res)=>{
        //判断 是否有数据 成功了就不添加了 
        //res.data.code == 200 成功打印的数据
        if (res.data.code == 200) {
            successAlert(res.data.msg);
          //消失之前还要回复初始值  所以在上面定义一个方法
            this.empty();

          //添加成功弹框消失 调用上面消失的就行
          this.cancel();

          //添加成功页表数据也要刷新
          this.reqManageList();

          //同时刷新一下 页面总数
          this.reqTotalAction();
        }else{
          warningAlert(res.data.msg);
        }
      })
    },
    //获取菜单详情 一条输
    look(uid){
      //收到id后 走请求  记得引入
      reqManageDetail(uid).then(res=>{
        //把list赋值给json  整个过程叫双向数据绑定
        //请求完成以后 把数据给form
        //但是缺少一个id  直接给一个id就行 而这个id 就是你传过来的id
        // this.form=res.data.list;
        // this.form.id=id

        if (res.data.code == 200) {
          this.form = res.data.list;
         this.form.password=""
        } else {
          warningAlert(res.data.msg);
        }
      })
    },
    //修改按钮
    update(){
      //访问接口 接着在request里面写接口 然后修改数据
      //当发生修改的时候 form传过去
      reqManageUpdate(this.form).then((res)=>{
      if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          this.reqManageList();
        } else {
          warningAlert(res.data.msg);
        }
      })
  },
},
  mounted() {
    console.log(this.rolelist);
    //如果菜单list没有请求过，就请求一下，如果请求过了，就不用请求了
    if(this.rolelist.length==0){
      this.reqRoleListAction()
    }
  },
};
</script>
<style scoped>
</style>