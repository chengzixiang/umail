<template>
  <div>
    <!-- <h1>菜单管理</h1> -->
    <!-- 父组件定义一个变量 来控制子组件 在data中定义-->
    
    <el-button type="primary" @click="willAdd">添加</el-button>
    <!-- 下面的table表格和from表单都是有逻辑的
          所以将其宅出去
     -->

    <!-- 表格组件 -->
    <!-- 绑定事件 一旦事件触发 就知道点了编辑 -->
    <v-list @edit="edit"></v-list>
    <!-- 表单添加组件 -->
    <!-- 传过去只要讲 下面定义的变量名和 传的名写一致 并且在变量明前加冒号 -->
    <!-- 给自己的子组件起个名叫add -->
    <v-add :info="info" ref="add"></v-add>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
//写好摘出来的 table和from 先引入
import vList from "./componnents/list"
import vAdd from "./componnents/add"
export default {
  props: [],
  components: {
    vAdd,
    vList,
  },
  data() {
    return {
      //这是添加弹框的状态 默认是不出来的  这样写会出问题子修改父是不行的所以 要传json
      // isshow:false
      //传递给add的数据
      info:{
        // 多定义一个变量判断是怎么出来的 如果是真 则是add添加出来的
        isshow:false,
        isAdd:true
      }
    };
  },
  computed: {
    ...mapGetters({}),
  },

  methods: {
      ...mapActions({}),
      //点击添加按钮就  弹出添加框
      willAdd(){
        this.info.isshow=true;
        this.info.isAdd=true;
      },
      //编辑 让弹框出来
      //这个地方可以接受到id
      edit(id){
        this.info.isshow=true;
        this.info.isAdd=false;
        //收到id后 让add组件发起获取详情的请求
        //父组件要调用子组件的方法 用 ref
        this.$refs.add.look(id)
      },
  },
  
  mounted() {},
};
</script>
<style scoped>
</style>