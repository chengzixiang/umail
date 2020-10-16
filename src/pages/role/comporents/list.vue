<template>
  <div>
    <!-- <h1>菜单table</h1> -->
    <!-- 一个数组两个子组件都要用到的话 写入vuex 状态层的话直接取就可以用 -->
    <!-- 状态层整个写完之后再 经行对接组件 -->
    <!-- 状态层在store的 modules里面 -->
    <!-- 当状态层完成之后 只要导入数据导入方法  调用方法就行就行 -->

    <el-table
      :data="list"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      :tree-props="{ children: 'children'}"
    >
      <el-table-column prop="id" label="角色编号" sortable width="180">
      </el-table-column>
      <el-table-column prop="rolename" label="角色名称" sortable width="180">
      </el-table-column>
       <!-- 遇到不能原样输出的东西在标签里面 加一个 template -->

      <el-table-column prop="status" label="状态"> 
        <template slot-scope="scope">
            <!-- scope后面的 row是该条 id的完整数据
            不展示原始数据的 方法就是 slot-scope="scope"
            scope是 不是原样展示的数据 就用 scope.id 等 -->
            <el-button v-if="scope.row.status==1" type="primary">启用</el-button>
            <el-button v-else type="info">禁用</el-button>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="操作">
          <template slot-scope="scope">
              <!-- 设置一个变量 通过真假判断
                    真就是添加 假就是修改
               -->
               <!-- 首先点击编辑按钮 让弹框出来
                  这里面点击的编辑按钮 add.vue中的isshow要变成一个真值 isshow是menu里面的
                  所以用自定义事件
                -->
                <!-- 点击的按钮 获取到当前条的数据 根据后台要求传-->
              <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
              <!-- <el-button type="danger" @click="del(scope.row.id)">删除</el-button> -->
               <!-- 写完公共删除组件 测试一下 -->
               <!-- 当子组件点击完成后 父组件绑定事件 父组件就要做删除的事
                    父组件要删除哪条数据 走id就行 应为id是控制数据的
                -->
                <!-- 根据后台修改删除按钮 后台要一个id -->
               <del-btn @confirm="dele(scope.row.id)"></del-btn>
          </template> 
        </el-table-column>

    </el-table>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert, warningAlert } from '../../../utils/alert';
import {reqRoleDel} from "../../../utils/request"
export default {
  props: [],
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      //这个menu模块就是 store下面的 modules的menu
      //导数据
      list:"role/list"
      }),
    },
    methods: {
    ...mapActions({
        //导方法对
        reqListAction:"role/reqListAction"
    }),
    //编辑id
    //发一个请求 赋值给form  在add中操作
    edit(id){
      //触发这个事件 menu要经行绑定 点击后应该把这个id传走  传到menu 
      //menu接受到这个id  而这个id在event事件上
      this.$emit("edit",id)
    },

    //删除
    //()收到这个id
    // del(id) {
    //   this.$confirm("你确定要删除吗？", "删除提示", {
    //     confirmButtonText: "删除",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   })
    //     .then(() => {
    //       //点了确定按钮 发送请求 从数据删除内容并且 刷新页面
    //       //删除就要调用ajax  所以返回 request写接口
    //       //收到的id传入 reqMenuDel()中
    //       reqMenuDel(id).then(res=>{
    //         if(res.data.code==200){
    //           successAlert(res.data.msg)
    //           this.reqListAction();
    //         }else{
    //           warningAlert(res.data.msg)
    //         }
    //       })
    //     })
    //       .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "已取消删除",
    //       });
    //     });
    //   },


      //通过公共组件删除
      //这里收到一个id 
      dele(id){
        //这里就不用做弹框了 直接做删除的逻辑就行
        //点了确定按钮 发送请求 从数据删除内容并且 刷新页面
        //删除就要调用ajax  所以返回 request写接口
        //收到的id传入 reqMenuDel()中
        reqRoleDel(id).then(res=>{
            if(res.data.code==200){
              successAlert(res.data.msg)
              this.reqListAction();
            }else{
              warningAlert(res.data.msg)
            }
          })
      }
    },
    mounted() {
      //设置一进页面就触发请求 
      this.reqListAction();
    },
};
</script>
<style scoped>
</style>