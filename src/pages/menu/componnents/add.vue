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
    <el-dialog :title="info.isAdd?'添加菜单':'编辑菜单'" :visible.sync="info.isshow" @closed="closed">
      <!-- <h1>菜单add</h1> -->
      <!-- 上面的 v-model里面的 form.name数据是下面
          return返回数据里面的 form属性里面的name
     -->

      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="菜单名称">
          <el-input v-model="form.title"></el-input>
        </el-form-item>

        <el-form-item label="上级菜单">
          <!-- 下拉菜单 -->
          <!-- 当form.pid发生修改的时候 下面的form.type就需要修改
                这是根据上面选择的顶级菜单做联动的
                所以这里用@change
           -->
          <el-select v-model="form.pid" placeholder="请选择上级菜单" @change="changePid">
            <!-- label是你选中的词  value是展示 的词 -->
            <!-- value中number类型就在前面加：要不然就是字符串 -->
            <el-option label="顶级菜单" :value="0"></el-option>
            <!-- list有几个 下拉菜单就应该有几个数据 -->
            <el-option v-for="item in list" :key="item.id" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="菜单类型">
          <!-- 上面做了选择 这里的就不能操作了 就是看的 所以添加 disabled -->
          <el-radio v-model="form.type" :label="1" disabled>目录</el-radio>
          <el-radio v-model="form.type" :label="2" disabled>菜单</el-radio>
        </el-form-item>


        <el-form-item label="菜单图标" v-if="form.type==1">
          <el-select v-model="form.icon" placeholder="请选择上级菜单">
            <!-- value=""   "" 里面的内容就是选中的变量 因为是变量所以vlaue前面加: -->
            <el-option v-for="item in icons" :key="item" :value="item">
              <!-- 变量记得加冒号 带引用item等都是变量 -->
              <i :class="item"></i>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="菜单地址" v-else>
          <el-select v-model="form.url" placeholder="请选择上级菜单">
            <!-- value=""   "" 里面的内容就是选中的变量 因为是变量所以vlaue前面加: -->
            <!-- 给用户看到的词用个label 要展示 的是name path是你页面的名称 -->
            <!-- value 选中的时候是path 但是需要加一个变量 / -->
            <el-option
              v-for="item in indexRoutes"
              :key="item.path"
              :label="item.name"
              :value="'/' + item.path"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <!-- 这里要求打开是1 关闭是2 而且是number类型
               所以这里应用的是 active-value 选中的值和
               inactive-value没有选择的值 
               要的number类型 所以前面还需要加 ：
           -->
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>

        <!-- <el-form-item>
          <el-button type="primary">添加</el-button>
          <el-button>取消</el-button>
        </el-form-item> -->
      </el-form>


      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
       <el-button type="primary" @click="add" v-if="info.isAdd"
          >添 加
          </el-button>
        <el-button type="primary" @click="update" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import { mapGetters, mapActions } from "vuex";

//indexRouters 就是路由规则  indexRouters就是所需要用的 let那个变量
//import 引入  页面中用到的变量都得在data中定义
import { indexRoutes } from "../../../router/index"

//接口写好之后 这里需要用接口就引入
import {reqMenuAdd,reqMenuDetail,reqMenuUpdate} from "../../../utils/request"

//下面要用弹框 所以引入
import {warningAlert,successAlert} from "../../../utils/alert"

export default {
  //传过来的变量只要再此接受下就能用了
  props: ["info"],
  components: {},
  data() {
    return {
      //图标在这里 上面用的时候就直接来这里取s
      icons: [
        "el-icon-s-tools",
        "el-icon-user",
        "el-icon-camera",
        "el-icon-message-solid",
      ],
      //路由   路由的值就是刚才的数组
      indexRoutes: indexRoutes,
      // 没有绑定数据的
      // form: {
      //   name: "",
      // },
      
      //根据后台要的给 要根后台要求是一至的
      form: {
        pid:0,
        title:"",
        icon:"",
        type:1,
        url:"",
        status:1
      },
    };
  },
  computed: {
    ...mapGetters({
      list:"menu/list"
    }),
  },
  methods: {
    //添加完成后要刷新列表数据   刷新数据直接重新请求列表数据就行
    ...mapActions({
      reqListAction:"menu/reqListAction"
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
        pid:0,
        title:"",
        icon:"",
        type:1,
        url:"",
        status:1
      }
    },
    //修改pid  这里经行判断 如果是0就是目录 不是0就是菜单
    changePid(){
      if(this.form.pid==0){
        this.form.type=1
      }else{
        this.form.type=2
      }
    },


    //点击了 添加按钮就要请求了
    add(){
      //在发参数之前 可先注释一下 然后 log下 看看是不是自己想要的东西
      // console.log(this.form);

      //请求成功之后就可以看结果了
      //reqMenuAdd（）请求的括号里面需要传一堆的参数 还要符合后端需求
      //后台要的是json  而this.form就是json 传过去就行
      reqMenuAdd(this.form).then(res=>{
        //判断 是否有数据 成功了就不添加了 
        //res.data.code == 200 成功打印的数据
        if (res.data.code == 200) {
            successAlert(res.data.msg);
          //消失之前还要回复初始值  所以在上面定义一个方法
            this.empty();

          //添加成功弹框消失 调用上面消失的就行
          this.cancel();

          //添加成功页表数据也要刷新
          this.reqListAction();

        }else{
          warningAlert(res.data.msg);
        }
      })
    },
    //获取菜单详情 一条输
    look(id){
      //收到id后 走请求  记得引入
      reqMenuDetail(id).then(res=>{
        //把list赋值给json  整个过程叫双向数据绑定
        //请求完成以后 把数据给form
        //但是缺少一个id  直接给一个id就行 而这个id 就是你传过来的id
        // this.form=res.data.list;
        // this.form.id=id

        if (res.data.code == 200) {
          this.form = res.data.list;
          this.form.id = id;
        } else {
          warningAlert(res.data.msg);
        }
      })
    },
    //修改按钮
    update(){
      //访问接口 接着在request里面写接口 然后修改数据
      //当发生修改的时候 form传过去
      reqMenuUpdate(this.form).then(res=>{
      if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          this.reqListAction();
        } else {
          warningAlert(res.data.msg);
        }
      })
    },
  },
  mounted() {},
};
</script>
<style scoped>
</style>