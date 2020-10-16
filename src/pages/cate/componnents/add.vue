<template>
  <div class="add">

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
    <el-dialog :title="info.isAdd?'添加商品分类':'编辑商品分类'" :visible.sync="info.isshow" @closed="closed">
      <!-- <h1>菜单add</h1> -->
      <!-- 上面的 v-model里面的 form.name数据是下面
          return返回数据里面的 form属性里面的name
     -->

      <el-form ref="form" :model="form" label-width="80px">

        
        <el-form-item label="上级分类">
          <!-- 下拉菜单 -->
          <!-- 当form.pid发生修改的时候 下面的form.type就需要修改
                这是根据上面选择的顶级菜单做联动的
                所以这里用@change
           -->
          <el-select
           v-model="form.pid"
            placeholder="请选择上级分类" 
            >
            <!-- label是你选中的词  value是展示 的词 -->
            <!-- value中number类型就在前面加：要不然就是字符串 -->
            <el-option label="顶级分类" :value="0"></el-option>
            <!-- list有几个 下拉菜单就应该有几个数据 -->
            <el-option 
            v-for="item in list" 
            :key="item.id" 
            :label="item.catename" 
            :value="item.id"></el-option>
          </el-select>
        </el-form-item>

          
        <el-form-item label="分类名称">
          <el-input v-model="form.catename"></el-input>
        </el-form-item>




        <!-- 原生上传文件  开始-->
        <!-- 设置一下只要二级分类才显示 -->
        <!-- 如果添加成功之后，再次添加上一次的文件，就不会再出发change；如果要解决这个bug,我们就在弹框消失的时候，将input也销毁 -->
        <!-- 当我上传一个文件时 fils没法刷新 但是把节点删除也可以重置 -->
        <!-- <el-form-item label="图片" v-if="form.pid!=0">
         <div class="my-upload">
            <h3>+</h3>
            <img class="img" v-if="imgUrl" :src="imgUrl"> -->
            <!-- 如果添加成功之后，再次添加上一次的文件，就不会再出发change；如果要解决这个bug,我们就在弹框消失的时候，将input也销毁 -->
        <!-- 当我上传一个文件时 fils没法刷新 但是把节点删除也可以重置 -->
            <!-- <input v-if="info.isshow" class="my-input" type="file" @change="getFile"> 
          </div>
        </el-form-item> -->
        <!-- 原生上传文件  结束-->




        <!-- ele-ui传文件  开始-->
        <el-form-item label="图片">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-change="getFile2"
          >
            <img
             v-if="imgUrl"
              :src="imgUrl"
               class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <!-- ele-ui上传文件  结束-->





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

//接口写好之后 这里需要用接口就引入
import {reqCateAdd,
        reqCateDetail,
        reqCateUpdate} from "../../../utils/request"

//下面要用弹框 所以引入
import {warningAlert,successAlert} from "../../../utils/alert"

export default {
  //传过来的变量只要再此接受下就能用了
  props: ["info"],
  components: {},
  data() {
    return {
      //图标在这里 上面用的时候就直接来这里取s

        //定义一个图片路径  想要用路径就必须在这定义
        imgUrl:"",
    
      //根据后台要的给 要根后台要求是一至的
      form: {
           pid:0,
       catename:"",
       //img 要文件类型 需要初始值 所以给他一个null 空对象
       img:null,
       status:1,
      },
    };
  },
  computed: {
    ...mapGetters({
      list:"cate/list"
    }),
  },
  methods: {
    //添加完成后要刷新列表数据   刷新数据直接重新请求列表数据就行
    ...mapActions({
      reqListAction:"cate/reqListAction"
    }),


    //原生上穿 获取文件
    getFile(e){
        //文件转换成路径 就能变成图片
        // 获取到当前信息
        let file = e.target.files[0];

        //验证一下 再上传  需求
        // 1.文件大小
        if(file.size>10*1024*1024){
            warningAlert("文件不能超过2M")
            return;
        }
        //2.是图片 获取图片后缀
        let imgExtArr=['.jpg','.png','.jpeg','.gif'];
        //通过截取 图片最后一个点 来回去 图片格式
        let extname = file.name.slice(file.name.lastIndexOf("."));

        //判断这个元素的 等不等于我的后缀名
        if(!imgExtArr.some(item=>item==extname)){
            warningAlert("文件格式不正确");
            return;
        };

        //获取到文件路径  URL.createObjectURL(file) 这个方法就是把文件中图片的路径取出来
        this.imgUrl=URL.createObjectURL(file)
        //讲文件保存在form.img
        this.form.img = file;

    },

    //文件状态改变的钩子 文件上传就会被调用
    getFile2(e){
    let file = e.raw;
      //URL.createObjectURL() 可以通过文件生成一个地址
      this.imgUrl = URL.createObjectURL(file);
      //将文件保存在form.img
      this.form.img = file;
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
      this.form={
        pid:0,
       catename:"",
       //img 要文件类型 需要初始值 所以给他一个null 空对象
       img:null,
       status:1,
      }
      this.imgUrl=""
    },


    //点击了 添加按钮就要请求了
    add(){
      //在发参数之前 可先注释一下 然后 log下 看看是不是自己想要的东西
      // console.log(this.form);

      //请求成功之后就可以看结果了
      //reqMenuAdd（）请求的括号里面需要传一堆的参数 还要符合后端需求
      //后台要的是json  而this.form就是json 传过去就行
      reqCateAdd(this.form).then(res=>{
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
      reqCateDetail(id).then(res=>{
        //把list赋值给json  整个过程叫双向数据绑定
        //请求完成以后 把数据给form
        //但是缺少一个id  直接给一个id就行 而这个id 就是你传过来的id
        // this.form=res.data.list;
        // this.form.id=id

        if (res.data.code == 200) {
          this.form = res.data.list;
          this.form.id=id;
          this.imgUrl=this.$imgPre + this.form.img
        } else {
          warningAlert(res.data.msg);
        }
      })
    },
    //修改按钮
    update(){
      //访问接口 接着在request里面写接口 然后修改数据
      //当发生修改的时候 form传过去
      reqCateUpdate(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          this.reqListAction();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
  },
  mounted() {},
};
</script>
<style lang="stylus" scoped>
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




.add >>>.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

</style>

