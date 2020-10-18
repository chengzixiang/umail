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
    <el-dialog 
    :title="info.isAdd?'添加商品':'编辑商品'" 
    :visible.sync="info.isshow" 
    @closed="closed"
    @opened="opened"
    >
      <!-- <h1>菜单add</h1> -->
      <!-- 上面的 v-model里面的 form.name数据是下面
          return返回数据里面的 form属性里面的name
     -->
<!-- =====================2.绑定属性===================== -->
      <el-form ref="form" :model="form" label-width="80px">

        <!-- 一级菜单 -->
        <el-form-item label="一级分类">
            <!-- 下面的rolename 绑定在这  输入的什么内容都可以取到-->
<!-- =====================8.一级分类完成 发请求 获取二级分类===================== -->
            <!-- 给一个事件  选择完成的时候发送 -->
         <el-select v-model="form.first_cateid" @change="changeFirst">
           <el-option label="请选择" value="" disabled></el-option>
<!-- =====================7.属性添加===================== -->
            <!-- 获取到数据后但是二级菜单 是根据一级菜单来展示的 所以走请求调用ajax -->
            <!-- 获取到数据后 for循环 catename展示 选中就是id-->
           <el-option v-for="item in cateList" :key="item.id" :label="item.catename" :value="item.id"></el-option>
         </el-select>
        </el-form-item>
     
        <!-- 二级菜单 -->
        <el-form-item label="二级分类">
            <!-- 下面的rolename 绑定在这  输入的什么内容都可以取到-->
         <el-select v-model="form.second_cateid">
           <el-option label="请选择" value="" disabled></el-option>
<!-- =====================9.二级分类获取数据===================== -->
           <el-option v-for="item in secondCateList" :key="item.id" :label="item.catename" :value="item.id"></el-option>

         </el-select>
        </el-form-item>

        <!-- 商品名称 -->
         <el-form-item label="商品名称">
          <el-input v-model="form.goodsname"></el-input>
        </el-form-item>        

        <!-- 价格 -->
         <el-form-item label="价格">
          <el-input v-model="form.price"></el-input>
        </el-form-item>
        
        <!-- 市场价格 -->
         <el-form-item label="市场价格">
          <el-input v-model="form.market_price"></el-input>
        </el-form-item>
                
        <!-- 图片 -->
<!-- =====================11.图片操作===================== -->
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

        <!-- 商品规格 -->
        <el-form-item label="商品规格">
            <!-- 下面的rolename 绑定在这  输入的什么内容都可以取到-->
<!-- =====================14.2商品规格 添加事件 ===================== -->
         <el-select v-model="form.specsid" @change="changeSpecs">
           <el-option label="请选择" value="" disabled></el-option>
<!-- =====================13.商品规格 获取数据===================== -->
           <el-option v-for="item in specsList" :key="item.id" :label="item.specsname" :value="item.id"></el-option>
         </el-select>
        </el-form-item>

         <!-- 商品属性 -->
        <el-form-item label="商品属性">
            <!-- 下面的rolename 绑定在这  输入的什么内容都可以取到-->
            <!-- 下拉菜单多选 加一个 multiple 复选框 这个默认选中就是一个数组 所有下面默认样式给一个数组-->
<!-- =====================14.6商品属性值 修改置空 ===================== -->
         <el-select v-model="form.specsattr" multiple>
           <el-option label="请选择" value="" disabled></el-option>
<!-- =====================14.5商品属性 添加 ===================== -->
           <el-option 
                v-for="item in goodsAttrList" 
                :key="item" 
                :label="item" 
                :value="item"
           >
           </el-option>
         </el-select>
        </el-form-item>

        <!-- 是否新品 -->
        <el-form-item label="是否新品">
            <el-radio v-model="form.isnew" :label="1">是</el-radio>
            <el-radio v-model="form.isnew" :label="2">否</el-radio>
        </el-form-item>

        <!-- 是否热卖 -->
        <el-form-item label="是否热卖">
            <el-radio v-model="form.ishot" :label="1">是</el-radio>
            <el-radio v-model="form.ishot" :label="2">否</el-radio>
        </el-form-item>

        <!-- 状态 -->
        <el-form-item label="状态">
          <!-- 这里要求打开是1 关闭是2 而且是number类型
               所以这里应用的是 active-value 选中的值和
               inactive-value没有选择的值 
               要的number类型 所以前面还需要加 ：
           -->
          <el-switch
            v-model="form.status" 
            :active-value="1" 
            :inactive-value="2"
           >
           </el-switch>
        </el-form-item>

        <!-- 商品描述 -->
        <el-form-item label="商品描述">
            <!-- <textarea v-model="form.description" name="" id="" cols="30" rows="10"></textarea> -->
            <!-- 使用富文本
                    但是这样写会有问题因为弹框出来是有动画的 所以富文本加载完了 动画还没结束
                    动画结束的时候已经不显示了 所以在el-diaog设置 打开完成 这样就可以显示了
             -->
             <!-- 消失的时候 让节点消失 就清空了 -->
            <div v-if="info.isshow" id="editor">

    </div>
        </el-form-item>


      </el-form>


      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
<!-- =====================3.添加===================== -->
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
// 富文本 编辑器引入
import E from "wangeditor"

import { mapGetters, mapActions } from "vuex";

//接口写好之后 这里需要用接口就引入
import {
        reqCateList,
        reqGoodsAdd,
        reqGoodsDetail,
        reqGoodsUpdate,
        } from "../../../utils/request"

//下面要用弹框 所以引入
import {warningAlert,successAlert} from "../../../utils/alert"

export default {

  
  //传过来的变量只要再此接受下就能用了
  props: ["info"],
  components: {},
  data() {
    return {
         
      
      //1.初始化form
      form: {
        first_cateid:'',
        second_cateid:'',
        goodsname:'',
        price:'',
        market_price:'',
        img:null,
        description:'',
        specsid:'',
        specsattr:[], //后端要的是 '[]'，所以在 请求前要转换格式
        isnew:1,
        ishot:1,
        status:1,
      },

//9.================  9.定义一个变量 用于获取二级路由需要的数组
        //二级分类的list
        secondCateList:[],
//11. ================== 11.首先图片的地址展示
        //图片地址
        imgUrl:"",
//14.================  14.定义一个变量 用于获取商品属性 
        goodsAttrList:[],
    };
  },

  computed: {
    ...mapGetters({
//4. ============== 4.状态层取数据
      cateList:"cate/list" ,
//13. ============= 13. 商品规格状态层数据
      //商品规格list
      specsList: "specs/list",
    }),
  },

  methods: {

      //弹框打开完成的时候 再添加
      //富文本的值还得获取出来 再给编辑器
        opened(){
          //富文本 
          //定义一个变量 上面能用下面能用  定义在this
          this.editor = new E("#editor");
          this.editor.create();
          //创建完成以后再赋值
          this.editor.txt.html(this.form.description)
        },



    //添加完成后要刷新列表数据   刷新数据直接重新请求列表数据就行
    ...mapActions({
//5.  ==========================  5.商品分类请求
        //请求商品分类list接口    可能没有去过商品分类页面  所以请求也拿过来  
        reqCateList:"cate/reqListAction",
        //商品规格list
        reqSpecsList: "specs/reqListAction",
//17 =============================  17.添加完成刷新页面
        //goods list
        reqListAction: "goods/reqListAction",
        //goods count
        reqTotalAction: "goods/reqTotalAction",


    }),

//8.   ==================  8.一级分类修改了 获取二级分类的list
        changeFirst(){
            // 通过pid 传给一级分类 就可以获取到 pid一级分类下的 二级分类所以数据
            // 上面引入 reqCateList 接口 然后在这里传参
//10.   ==================  10.当一级分类修改的时候 二级分类置空
            this.form.second_cateid='',
            this.getSecondList()
        },
        //因为被重复调用 所以拿出来 
       getSecondList(){
          reqCateList({pid:this.form.first_cateid}).then(res=>{
            //获取到数据之后 讲数组取出来放到 二级路由展示 
            //定义数组 等于数据 得到结果
            this.secondCateList=res.data.list
          })
       },

//12. ==================== 12.图片操作
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

//14.================  14.3商品规格 改变事件 计算商品属性的数组
        changeSpecs(){
//14.================  14.6商品规格发生修改置空
          this.form.specsattr=[];
          this.getAttrsArr();

          // 在specsList中找到 找到哪一条数据的id和当前this.form.specsid是一样的。
          // 把这条数据的attrs赋值给goodsAttrList;
          // 找到这个数据的方法 就是 find
          let obj = this.specsList.find((item) => item.id == this.form.specsid);
          this.goodsAttrList = obj.attrs;
        },
      //获得商品属性数组 因为下面调用不需要被置空 但是上面需要所以 写出来
        getAttrsArr() {
         //在specsList中找到 找到哪一条数据的id和当前this.form.specsid是一样的。
          // 把这条数据的attrs赋值给goodsAttrList;
          // 找到这个数据的方法 就是 find
          let obj = this.specsList.find((item) => item.id == this.form.specsid);
          this.goodsAttrList = obj.attrs;
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
//16.================ 16. 表单信息置空
      this.form = {
        first_cateid:'',
        second_cateid:'',
        goodsname:'',
        price:'',
        market_price:'',
        img:null,
        description:'',
        specsid:'',
        specsattr:[], //后端要的是 '[]'，所以在 请求前要转换格式
        isnew:1,
        ishot:1,
        status:1,
      },
        //二级分类的list
        this.secondCateList=[];

        //图片地址
        this.imgUrl="";
        //定义一个变量 用于获取商品属性 
        this.goodsAttrList=[];

    },

    checkedData() {
        if (this.form.first_cateid == "") {
              warningAlert("一级菜单请添加");           
              return false;
        };
        if (this.form.second_cateid == "") {
              warningAlert("二级菜单请添加");           
              return false;
        };
          if (this.form.goodsname == "") {
              warningAlert("商品名称不能为空");
              return false;
        };
          if (this.form.price == "") {
              warningAlert("价格不能为空");
              return false;
        };
          if (this.form.market_price == "") {
              warningAlert("市场价格不能为空");
              return false;
        };
        if (this.imgUrl == "") {
            warningAlert("图片不能为空");
            return false;
      };
      if (this.form.specsid == "") {
              warningAlert("商品规格请添加");           
              return false;
        };
        if (this.form.specsattr == "") {
              warningAlert("商品属性请添加");           
              return false;
        };
            //如果上面都没有拦 就代表验证过了
          return true
    },



//3.   =============================3.添加
    //点击了 添加按钮就要请求了
    add(){

      if(!this.checkedData()){
        return;
      }
//15.   =============================15.传参
      // let data = this.form;
      // data.specsattr=JSON.stringify(this.form.specsattr)  等于下面的
      let data = {
        ...this.form,
        specsattr: JSON.stringify(this.form.specsattr),
      };

       // 富文本传参
       //将富文本编辑器的内容取出来给form.description
        this.form.description = this.editor.txt.html();

      reqGoodsAdd(data).then(res=>{
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
//17 =============================  17.1 添加完成刷新页面
          this.reqListAction();
          this.reqTotalAction();

        }else{
          warningAlert(res.data.msg);
        }
      })
    },
    //获取菜单详情 一条输
    look(id){
      //收到id后 走请求  记得引入
//18 =============================  18. list点了编辑  这边得到了一个goods的详情获取
      //要的是一个json
      reqGoodsDetail({id:id}).then(res=>{
        //把list赋值给json  整个过程叫双向数据绑定
        //请求完成以后 把数据给form
        //但是缺少一个id  直接给一个id就行 而这个id 就是你传过来的id
        this.form=res.data.list;
        this.form.id=id

        if (res.data.code == 200) {
  // 首先 获取到一级菜单
          this.form = res.data.list;

  //其次1. 需要请求一下二级分类的list 二级分类的list 根据第一级的list请求
          this.getSecondList();

  //其次2. 图片操作
          this.imgUrl = this.$imgPre + this.form.img;

  /*其次3， 商品属性 修改 从字符串转成数组 [] 
              这里列表都获取不到 所以文字肯定也不显示
              商品规格发生改变 重新计算一下数组
              */
            this.form.specsattr=JSON.parse(this.form.specsattr);
            //一进去就要获取一下商品属性的数组
            this.getAttrsArr();

            //给富文本编辑器赋值   会报错 说txtundefined 
            //因为编辑器这个时候没有创建 所以得等有编辑器再赋值 所以这里应该再上面定义一个控制
            // this.editor.txt.html(this.form.description)
        } else {
          warningAlert(res.data.msg);
        }
      })
      
    },
//19 =============================  19. 点了修改 改变数据
    //修改按钮
    update(){

      if(!this.checkedData()){
        return;
      }
      //因为也可能 更新掉form.discretion 所以这里也要取一下
      this.editor.txt.html(this.form.description)


      //访问接口 接着在request里面写接口 然后修改数据
      //当发生修改的时候 form传过去
      //只有一个值需要通过stringfy去转 剩下的原样输出
      let data={
        ...this.form,
        specsattr:JSON.stringify(this.form.specsattr)
      }
      reqGoodsUpdate(data).then(res=>{
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
  mounted() {

//6.  =======================6. 判断 cataList有没有值
    //   在这里判断一下 如果商品一级分类list没有请求过 就请求一下  请求过 就不用请求了
    if(this.cateList.length==0){
        this.reqCateList()
    };
//13.  =======================6. 判断 规格List有没有值
    //   在这里判断一下 如果规格List没有请求过 就请求一下  请求过 就不用请求了
    // 但是这里有bug 虽然获取到数据 但是只有前两条 想要解决这个问题得从specs.js解决
    /* 解决这个问题就是 reqSpecsList() ()里面的值 在外面定义一个参数 这个参数经行判断
        但是的有一个值进行判断  所以在 reqListAction(context) 在里面再加一个参数判断 就可以了*/
        this.reqSpecsList(true);

  },
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