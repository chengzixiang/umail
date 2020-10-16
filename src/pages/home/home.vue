<template>
  <div>
    <h1>首页管理</h1>
    <div class="box" id="main"></div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import echarts from "echarts";
export default {
  props: [],
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      //一进页面就发请求
      list: "cate/list",
    }),
  },
  // list 有数据才要画图 list 拿到数据再画图
  watch: {
    list: {
      //list套json了 所以深度监听
      handler() {
        //判断长度 大于0 创建图表
        if (this.list.length > 0) {
          // 基于准备好的dom，初始化echarts实例
          var myChart = echarts.init(document.getElementById("main"));

          // 指定图表的配置项和数据
          var option = {
            title: {
              text: "商品分类",
            },
            tooltip: {},
            legend: {
              data: ["下级分类数量"],
            },
            xAxis: {
              //把list 数组取出来 组成一个新的  map方法
              data:this.list.map(item=>item.catename),
              
            },
            yAxis: {},
            series: [
              {
                name: "下级分类数量",
                type: "line",
                data: this.list.map(item=>item.children.length),
              },
            ],
          };

          // 使用刚指定的配置项和数据显示图表。
          myChart.setOption(option);
        }
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions({
      reqList: "cate/reqListAction",
    }),
  },
  mounted() {
    this.reqList();
    
  },
};
</script>
<style scoped>
.box {
  width: 80%;
  height: 400px;
  margin: 20px auto;
  border: 1px solid #cccccc;
}
</style>