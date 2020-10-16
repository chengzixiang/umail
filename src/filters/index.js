//整合过滤器

import Vue from "vue"
//注册价格过滤器
import filterPrice from "./filterPrice"
let obj ={
    filterPrice,
}
for(let i in obj){
    Vue.filter(i,obj[i])
}