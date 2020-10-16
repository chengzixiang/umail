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
    <el-dialog :title="info.isAdd?'添加角色':'编辑角色'" :visible.sync="info.isshow" @closed="closed">
      <!-- <h1>菜单add</h1> -->
      <!-- 上面的 v-model里面的 form.name数据是下面
          return返回数据里面的 form属性里面的name
     -->

      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="角色名称">
            <!-- 下面的rolename 绑定在这  输入的什么内容都可以取到-->
          <el-input v-model="form.rolename"></el-input>

        </el-form-item>
        <!-- 树形控件 -->
        <!--  树形控件 页面选择完成后  点击添加按钮  需要绑定数据 
                但是这里的树形控件跟form没有关联 
        -->
        <el-form-item label="角色权限">
        <!-- data是用来展示的数组 就是菜单管理的数据
            菜单列表的数据是下面经行判断过的 而 menuList就是那个数据
        -->
        <!-- ref="tree" 这个内容是那你从 ui模板中获取的 
                模板中 告诉你 想要获取 树形结构的值 如何取key
         -->
          <el-tree
            ref="tree"
            :data="menuList"
            show-checkbox
            node-key="id"
            :props="{children: 'children',label: 'title',}"
          >
           <!--props配置 children: 'children' 判断有没有子节点 label: 'title' 用来获取展示的词 -->
          </el-tree>
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
          <!-- 当你编辑的 时候 修改数据  你的树形控件拿不到值 所以得 又拿出再赋值 -->
        <el-button type="primary" @click="update" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import { mapGetters, mapActions } from "vuex";

//接口写好之后 这里需要用接口就引入
import {reqRoleAdd,reqRoleDetail,reqRoleUpdate, reqRoleList} from "../../../utils/request"

//下面要用弹框 所以引入
import {warningAlert,successAlert} from "../../../utils/alert"

export default {
  //传过来的变量只要再此接受下就能用了
  props: ["info"],
  components: {},
  data() {
    return {
         
      
      //根据后台要的给 要根后台要求是一至的
      //对于添加页面来说 数据就不需要了 根据后台要的 从新写
      //form完成后 传给后端 
      form: {
        rolename:"",
        menus:'[]',
        status:1
      },
    };
  },
  computed: {
    ...mapGetters({
        //菜单管理的list
      menuList:"menu/list" 
    }),
  },
  methods: {
    //添加完成后要刷新列表数据   刷新数据直接重新请求列表数据就行
    ...mapActions({
        /*请求菜单的list   这里经行判断 如果没有菜单管理的权限 直接到角色管理
        那么状态层就没有菜单管理的数据  所以这里判断 如果长度大于0就不用访问了*/
        reqMenuListAction:"menu/reqListAction",
        //角色管理的列表页还没有引入 所以这里引入 要不然无法刷新 角色的list
        reqRoleList:"role/reqListAction",
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
      this.form = {
          //虽然form重置了  但是跟节点没有关系 这里树形控件也要清空
        rolename:"",
        menus:'[]',
        status:1
      };
      //树形控件设置值
      this.$refs.tree.setCheckedKeys([])
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
        // 根据要求 规定是这样去取的 先测试一下  得到的结果是一个数组
        /*可以得到当前选中的节点 对应的id  所选择的id 返回的是一个数组 
            这个数组应该放到form的menus上面    */
        // console.log(this.this.$refs.tree.getCheckedKeys());

        // 后台要的字符串 方法 把数组放 json.stringify() 里面
        this.form.menus=JSON.stringify(this.$refs.tree.getCheckedKeys());
        //得到的结果应该是一个对象 把所有数据都给你了
        // console.log(this.$refs.getCheckedNodes());

      //在发参数之前 可先注释一下 然后 log下 看看是不是自己想要的东西
      // console.log(this.form);

      //请求成功之后就可以看结果了
      //reqRoleAdd（）请求的括号里面需要传一堆的参数 还要符合后端需求
      //后台要的是json  而this.form就是json 传过去就行
      reqRoleAdd(this.form).then(res=>{
        //判断 是否有数据 成功了就不添加了 
        //res.data.code == 200 成功打印的数据
        if (res.data.code == 200) {
            successAlert(res.data.msg);
          //消失之前还要回复初始值  所以在上面定义一个方法
            this.empty();

          //添加成功弹框消失 调用上面消失的就行
          this.cancel();

          //添加成功页表数据也要刷新 这里是 角色管理的列表页
          //虽然这数据刷新了 但是树形结构没有清空  所以 取ui模板查看如何清空
          this.reqRoleList();

        }else{
          warningAlert(res.data.msg);
        }
      })
    },
    //获取菜单详情 一条输
    look(id){
      //收到id后 走请求  记得引入
      reqRoleDetail(id).then(res=>{
        //把list赋值给json  整个过程叫双向数据绑定
        //请求完成以后 把数据给form
        //但是缺少一个id  直接给一个id就行 而这个id 就是你传过来的id
        // this.form=res.data.list;
        // this.form.id=id

        if (res.data.code == 200) {
          this.form = res.data.list;
          this.form.id=id;
          //给树形控件赋值就行
           this.$refs.tree.setCheckedKeys(JSON.parse(this.form.menus))
        } else {
          warningAlert(res.data.msg);
        }
      })
    },
    //修改按钮
    update(){
      //访问接口 接着在request里面写接口 然后修改数据
      //当发生修改的时候 form传过去

      //数据什么都要就是没有 树形控件 先把他取出来
      this.form.menus=JSON.stringify(this.$refs.tree.getCheckedKeys())
      reqRoleUpdate(this.form).then(res=>{
      if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          this.reqRoleList();
        } else {
          warningAlert(res.data.msg);
        }
      })
    },
  },
  mounted() {
    //   在这里判断一下 如果菜单list没有请求过 就请求一下  请求过 就不用请求了
    if(this.menuList.length==0){
        this.reqMenuListAction()
    }
  },
};
</script>
<style scoped>
</style>