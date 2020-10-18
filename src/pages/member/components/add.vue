<template>
  <div>

    <el-dialog :title="info.isAdd?'添加管理员':'编辑管理员'" :visible.sync="info.isshow">

      <el-form ref="form" :model="form" label-width="80px">

          <el-form-item label="手机号">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>

          <el-form-item label="昵称">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>

        <el-form-item label="密码">
          <el-input v-model="form.passwoed"></el-input>
        </el-form-item>


        <el-form-item label="状态">
          <el-switch
           v-model="form.status"
            :active-value="1" 
            :inactive-value="2">
            </el-switch>
        </el-form-item>

      </el-form>


      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import { mapGetters, mapActions } from "vuex";

//接口写好之后 这里需要用接口就引入
import {reqMemberList,reqMemberDetail,reqMemberUpdate} from "../../../utils/request"

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
        nickname:"",
        phone:"",
        passwoed:"",
        status:1
      },
    };
  },
  computed: {
    ...mapGetters({
      memberlist:"member/list"
    }),
  },
   methods: {
    //添加完成后要刷新列表数据   刷新数据直接重新请求列表数据就行
    ...mapActions({
      reqMemberList:"member/reqListAction",
    }),
    //按钮 取消
    cancel(){
      this.info.isshow=false;
    },
    //获取菜单详情 一条输
    look(uid){
      //收到id后 走请求  记得引入
      reqMemberDetail(uid).then(res=>{
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
      reqMemberUpdate(this.form).then((res)=>{
      if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.cancel();
          this.reqMemberList();
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