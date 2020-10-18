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
      <el-table-column prop="id" label="用户编号" sortable width="180">
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" sortable width="180">
      </el-table-column>
      <el-table-column prop="phone" label="手机号" sortable width="180">
      </el-table-column>
     
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
                <!-- 点击的按钮 要求是你删除的那条的数据 也就是可以获取到当前条的数据 -->
              <el-button type="primary" @click="edit(scope.row.uid)">编辑</el-button>
 
          </template> 
        </el-table-column>

    </el-table>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert, warningAlert } from '../../../utils/alert';
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
      list:"member/list",
      }),
    },
    methods: {
    ...mapActions({
        //导方法对
        reqListAction:"member/reqListAction",
    }),
    //编辑id
    //发一个请求 赋值给form  在add中操作
    edit(id){
      //触发这个事件 menu要经行绑定 点击后应该把这个id传走  传到menu 
      //menu接受到这个id  而这个id在event事件上
      this.$emit("edit",id)
    },

    },
    mounted() {
      //设置一进页面就触发请求 
      this.reqListAction();
    },
};
</script>
<style scoped>
</style>