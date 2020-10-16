//放公共组件
//所有这个文件夹里面的 都需要在这里注册
import Vue from "vue"

//注册删除组件
import delBtn from "./delBtn.vue"

//创建公共组件
let obj={
    delBtn,
}
//注册公共组件 （Vue.component 实例化一个组件component就是组件）
for(let i in obj){
    Vue.component(i,obj[i])
}