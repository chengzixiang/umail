<template>
  <div>

    <el-table
      :data="list"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      :tree-props="{ children: 'children'}"
    >
      <el-table-column prop="id" label="分类编号" sortable width="180">
      </el-table-column>
      <el-table-column prop="catename" label="分类名称" sortable width="180">
      </el-table-column>
       <!-- 遇到不能原样输出的东西在标签里面 加一个 template -->
      <el-table-column label="图片"> 
        <template slot-scope="scope">
          <!-- 设置图片不显示 设置个条件 -->
            <img v-if="scope.row.img!='null'" :src="$imgPre+scope.row.img" alt="">
        </template>
      </el-table-column>

      <el-table-column prop="status" label="状态"> 
        <template slot-scope="scope">

            <el-button v-if="scope.row.status==1" type="primary">启用</el-button>
            <el-button v-else type="info">禁用</el-button>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="操作">
          <template slot-scope="scope">
  
                <!-- 点击的按钮 要求是你删除的那条的数据 也就是可以获取到当前条的数据 -->
              <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
               <!-- 删除组件  -->
               <del-btn @confirm="dele(scope.row.id)"></del-btn>
          </template> 
        </el-table-column>

    </el-table>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert, warningAlert } from '../../../utils/alert';
import {reqCateDel} from "../../../utils/request"
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
      list:"cate/list"
      }),
    },
    methods: {
    ...mapActions({
        //导方法对
        reqListAction:"cate/reqListAction"
    }),
    //编辑id
    //发一个请求 赋值给form  在add中操作
    edit(id){
      //触发这个事件 cate要经行绑定 点击后应该把这个id传走  cate 
      //cate接受到这个id  而这个id在event事件上
      this.$emit("edit",id)
    },

      //通过公共组件删除
      dele(id){
        reqCateDel(id).then(res=>{
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
img{
    width: 100px;
    height: 100px;
}
</style>