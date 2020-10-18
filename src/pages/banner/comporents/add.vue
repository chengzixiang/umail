<template>
  <div>


    <el-dialog 
      :title="info.isAdd?'添加轮播图':'编辑轮播图'" 
      :visible.sync="info.isshow" 
      @closed="closed"
    >

      <el-form ref="form" :model="form" label-width="80px">

         <el-form-item label="标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
                

          <el-form-item label="图片">
           <!-- 图片上传 -->
           <div class="my-upload">
            <h3>+</h3>
            <img class="img" v-if="imgUrl" :src="imgUrl">
            <!-- 如果添加成功之后，再次添加上一次的文件，就不会再出发change；如果要解决这个bug,我们就在弹框消失的时候，将input也销毁 -->
            <!-- 当我上传一个文件时 fils没法刷新 但是把节点删除也可以重置 -->
            <input v-if="info.isshow" class="my-input" type="file" @change="getFile"> 
          </div>
        </el-form-item>


        <el-form-item label="状态">

          <el-switch
            v-model="form.status" 
            :active-value="1" 
            :inactive-value="2"
           >
           </el-switch>
        </el-form-item>

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


import {
        reqBannerAdd,
        reqBannerDetail,
        reqBannerUpdate,
        } from "../../../utils/request"

import {warningAlert,successAlert} from "../../../utils/alert"

export default {


  props: ["info"],
  components: {},
  data() {
    return {
         

      form: {
        title:"",
        img:null,
        status:1,
      },


        imgUrl:"",
    };
  },

  computed: {
    ...mapGetters({
       list: "banner/list",
    }),
  },

  methods: {
    ...mapActions({
        reqListAction: "banner/reqListAction",
    }),

        getFile(e){

       let file = e.target.files[0];

        if(file.size>10*1024*1024){
            warningAlert("文件不能超过2M")
            return;
        }
        
        let imgExtArr=['.jpg','.png','.jpeg','.gif'];
        let extname = file.name.slice(file.name.lastIndexOf("."));

        
        if(!imgExtArr.some(item=>item==extname)){
            warningAlert("文件格式不正确");
            return;
        };


        this.imgUrl=URL.createObjectURL(file)
        this.form.img = file;
    },


    
    cancel(){
      this.info.isshow=false;
    },
    
    closed(){
      
      if(!this.info.isAdd){
        this.empty()
      }
    },
    empty(){
      this.form = {
        title:"",
        img:null,
        status:1,
      },
        
        this.imgUrl="";
    },
    add(){

      reqBannerAdd(this.form).then(res=>{
        if (res.data.code == 200) {
            successAlert(res.data.msg);
          
            this.empty();
          this.cancel();
          this.reqListAction();

        }else{
          warningAlert(res.data.msg);
        }
      })
    },
    look(id) {
      reqBannerDetail(id).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list;
          this.form.id = id;
          this.imgUrl = this.$imgPre + this.form.img;
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    
    update(){
      reqBannerUpdate(this.form).then(res=>{
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
.my-upload {
  width: 150px;
  height: 150px;
  border: 1px dashed #ccc;
  position: relative;
}

.my-upload h3 {
  text-align: center;
  line-height: 150px;
  font-size: 30px;
  font-weight: 400;
}

.my-upload .my-input {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  cursor: pointer;
  opacity: 0;
}

.my-upload .img {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
</style>