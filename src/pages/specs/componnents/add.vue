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
    <el-dialog :title="info.isAdd?'添加规格':'编辑规格'" :visible.sync="info.isshow" @closed="closed">
      <!-- <h1>菜单add</h1> -->
      <!-- 上面的 v-model里面的 form.name数据是下面
          return返回数据里面的 form属性里面的name
     -->

      <el-form ref="form" :model="form" label-width="80px">

        <el-form-item label="规格名称">
          <el-input v-model="form.specsname"></el-input>
        </el-form-item>

        <!-- 遍历attArr  -->
        <el-form-item label="规格属性"
          v-for="(item, index) in attrArr"
          :key="index"
         >
          <div class="con">
            <div class="input-wrap">
              <!-- 每一个value控制一个输入框 -->
              <el-input v-model="item.value"></el-input>
            </div>
            <!-- 判断是不是第0个 是就是删除 不是就是新增 -->
            <!-- 当点击了 新增规格属性 -->
           <el-button 
              type="primary" 
              v-if="index == 0"
              @click="addAttr"
           >新增规格属性</el-button>
            <el-button type="danger" v-else @click="del(index)">删除</el-button>
          </div>
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
import {reqSpecsAdd,
        reqSpecsDetail,
        reqSpecsUpdate} from "../../../utils/request"

//下面要用弹框 所以引入
import {warningAlert,successAlert} from "../../../utils/alert"

export default {
  //传过来的变量只要再此接受下就能用了
  props: ["info"],
  components: {},
  data() {
   
    return {
    //商品规格属性数组 在这定义一个数组 有一条数据 就有一个value对应 value就控制一个输入框
        attrArr:[
          {value:''},
          {value:''},
        ],
      //根据后台要的给 要根后台要求是一至的
      form: {
         specsname: "",
        attrs: "",
        status: 1,
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
      //列表和总数再添加成功之后 总数也要刷新 从状态层导出来
      reqListAction: "specs/reqListAction",
      reqTotalAction: "specs/reqTotalAction",
    }),

    // 新增规格属性
    addAttr() {
      this.attrArr.push({ value: "" });
    },
    //删除规格属性  给一个下标 index 就可以删除
    del(index) {
      this.attrArr.splice(index, 1);
    },


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
       this.attrArr=[
          {value:''},
          {value:''},
        ];
        this.form={
            specsname: "",
            attrs: "",
            status: 1,
        }
    },
      //验证一下 信息必填
        checkedData() {
        if (this.form.specsname == "") {
        warningAlert("规格名称不能为空");
        return false;
        };
      //  因为有一个添加是不能删除的 所以这里验证 所有属性必填
        if (this.attrArr.some((item) => item.value == "")) {
              warningAlert("所有的属性值都必填");
              //结束当前函数 结束的是 自己 但是没有结束add 一旦拆除去就拦不住了 
              return false;
            }
            //如果上面都没有拦 就代表验证过了
          return true
      },

    //点击了 添加按钮就要请求了
    add(){  

      if(!this.checkedData()){
        return;
      }
        
      // console.log(this.attrArr); 返回的是一个{value:"s"},{value:"m"},
      //把所有 value的值取出来 组成一个数组的方法 用 map(item=>item.value)
      //map可以返回一个新数组 后面的函数return的结果就是你 返回数组的每一项，每一项的value取出来就拼成一个新数组
      // 但是后端要的是 this.form.attrs=['s',1]
      //所以 this.form.attrs = this.attrArr.map(item=>item.value)
      //结果要字符串 转一下 JSON.stringfiy


      //在发参数之前 可先注释一下 然后 log下 看看是不是自己想要的东西
      // console.log(this.form);  

      //请求成功之后就可以看结果了
      //reqMenuAdd（）请求的括号里面需要传一堆的参数 还要符合后端需求
      //后台要的是json  而this.form就是json 传过去就行

      this.form.attrs = JSON.stringify(this.attrArr.map(item=>item.value))
      reqSpecsAdd(this.form).then(res=>{
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
          //总数也要刷新
          this.reqTotalAction();

        }else{
          warningAlert(res.data.msg);
        }
      })
    },
    //获取菜单详情 一条输
    look(id){
      //收到id后 走请求  记得引入
      reqSpecsDetail(id).then(res=>{
        //把list赋值给json  整个过程叫双向数据绑定
        //请求完成以后 把数据给form
        //但是缺少一个id  直接给一个id就行 而这个id 就是你传过来的id
        // this.form=res.data.list;
        // this.form.id=id

        if (res.data.code == 200) {
          //第0个数据 就是你要的那个
          this.form = res.data.list[0];

          //attr赋值给的不是form  赋值给的是数组 attr得转一下 json.parse  
          //当这个格式转后面的 [{value:'s'},{value:'l'},{value:'xl'}]  ---map-->['s','l','xl']
        //还是用map .map(item=>({value:item}))
          this.attrArr=JSON.parse(this.form.attrs).map(item=>({value:item}));

          this.form.id = id;
        } else {
          warningAlert(res.data.msg);
        }
      })
    },
    //修改按钮
    update(){

      if(!this.checkedData()){
        return;
      }
      //访问接口 接着在request里面写接口 然后修改数据
      //当发生修改的时候 form传过去

      //修改的时候又得把数据拿出来 转一下
      this.form.attrs = JSON.stringify(this.attrArr.map(item=>item.value))
      reqSpecsUpdate(this.form).then(res=>{
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
.con {
  display: flex;
}
.input-wrap {
  flex: 1;
}
</style>