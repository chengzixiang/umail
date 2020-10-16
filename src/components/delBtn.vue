<template>
<!-- // 这个组件是每个 组件都要用的 删除按钮
// 删除组件 -->
  <el-button @click="del" type="danger">删除</el-button>

</template>
<script>
export default {
  

  methods: {
   //删除
    del() {
      this.$confirm("你确定要删除吗？", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        confirmButtonClass:"el-button el-button--danger",
        type: "warning",
      })
        .then(() => {
          //点了确定按钮 有的是删除菜单 有的是删除角色
          //通过子传父 子组件点击后通知父组件 这里点击确定让各个页面自行做判定
          this.$emit("confirm")
         
        })
          .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
      }
      
  },
};
</script>
<style scoped>
</style>