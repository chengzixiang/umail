<template>
  <div class="add">
    <el-dialog
      :title="info.isAdd ? '活动添加' : '活动修改'"
      :visible.sync="info.isshow"
      @closed="close"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="活动名称" required="">
          <el-input v-model="form.title"></el-input>
        </el-form-item>

        <el-form-item label="活动期限">
          <el-date-picker
            v-model="value1"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="一级分类">
          <el-select
            v-model="form.first_cateid"
            @change="changeFirst"
            placeholder="请选择分类"
          >
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="二级分类">
          <el-select v-model="form.second_cateid" placeholder="请选择分类" @change="changeSecond">
            <el-option
              v-for="item in secondCateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品">
          <el-select v-model="form.goodsid" placeholder="请选择商品">
            <el-option
              v-for="item in goodsLists"
              :key="item.id"
              :label="item.goodsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="2"
          ></el-switch>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.isAdd"
          >添 加</el-button
        >
        <el-button type="primary" @click="update" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import {
  reqCateList,
  reqGoodsList,
  reqSeckillAdd,
  reqSeckillDetail,
  reqSeckillUpdate,
} from "../../../utils/request";
import { warningAlert, successAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  components: {},
  data() {
    return {
      form: {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
      },
      //时间
      value1: [],

      //二级分类的list
      secondCateList: [],
      //商品编号的list
      goodsLists: [],
    };
  },
  computed: {
    ...mapGetters({
      // 商品分类的list
      cateList: "cate/list",
      //   秒杀活动的list
      seckillList: "seckill/list",
      //   商品管理下的list
      goodsList: "goods/list",
    }),
  },
  methods: {
    ...mapActions({
      // 请求商品分类的list
      reqCateList: "cate/reqListAction",
      //  秒杀活动的list
      reqListAction: "seckill/reqListAction",
      // 商品管理的list
      reqGoodsList: "goods/reqListAction",
    }),

    // 一级分类变了，二级分类也改变
    changeFirst() {
      //一级改变，二级为空
      this.form.second_cateid = "";
      //   三级也为空
      this.form.goodsid = "";
      this.getSecondList();
    },
    // 二级修改了 ，获取三级的list
    changeSecond() {
      this.form.goodsid = "";
      this.getGoodsLists();
    },
    
    //二级分类list
    getSecondList() {
      reqCateList({ pid: this.form.first_cateid }).then((res) => {
        //二级分类list
        this.secondCateList = res.data.list;
      });
    },
    getGoodsLists() {
      reqGoodsList({
        fid: this.form.first_cateid,
        sid: this.form.second_cateid,}).then((res) => {
        //二级分类list
        this.goodsLists = res.data.list;
      });
    },

   
    //取消
    cancel() {
      this.info.isshow = false;
    },
    //弹框消失完成
    close() {
      //如果是添加开的弹框，就什么都不做；如果是编辑开的弹框，就清除form
      if (!this.info.isAdd) {
        this.empty();
      }
    },
    //数据重置
    empty() {
      this.form = {
      title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
      };
      //二级分类的list
      this.secondCateList = [];
      //商品属性list
      this.goodsAttrList = [];
    },
    //获得二级分类list

    //点击了添加按钮
    add() {
    
      reqSeckillAdd(this.form).then((res) => {
        if (res.data.code == 200) {
          //成功
          successAlert(res.data.msg);

          //数据重置
          this.empty();

          //弹框消失
          this.cancel();

          //list数据要刷新
          this.reqListAction();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //获取菜单详情 （1条）
    look(id) {
      //发请求
      reqSeckillDetail(id).then((res) => {
        if (res.data.code == 200) {
          // form没有ID
          this.form = res.data.list;
          //   补ID
          this.form.id = id;
          //   需要去请求二级分类的list
          this.getSecondList();
          this.getGoodsLists()
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //修改
    update() {
      reqSeckillUpdate(this.form).then((res) => {
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
  mounted() {
    //如果商品一级分类没有请求过，就请求一次
    if (this.cateList.length == 0) {
      this.reqCateList();
    }
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

</style>