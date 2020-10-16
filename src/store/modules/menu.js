//对于这个menu 他就有自己的 mutations state acions和 getters
//所以定义自己的状态 修改状态

// 一旦触发请求就要调用接口 所以 引入接口
import {reqMenuList} from "../../utils/request"



// 引入完模块之后 直接写状态层 写完直接给主键展示就行
/***要做的事列表数据 最后返回的是数组  
    提前定义一个空数组 稍后返回一个有数据的数组替换就可以*/
//状态
const state={
    //菜单列表数据 list
    list:[]
}
//修改状态
const mutations={
    //专门修改 state的 list
    changeList(state,arr){
        state.list=arr;
    }
}
//
const actions={
    //页面触发页面请求 得到列表数据后 再去修改
    reqListAction(context){
        // 页面一旦触发 reqListActiom立刻发送请求 就去获取列表数据
        //发请求获取列表数据就得ajax请求 然后查看后台 数据
        //再次先要写一下接口 取request里面写接口
        reqMenuList().then(res=>{
            // 成功之后修改数组 替换一下 赋值的数据就是你查看的数据 所以这里是res.data.list
            context.commit('changeList',res.data.list)
        })
    }
}
//导出数据
const getters={
    // 完成以后导出就可以用了
    list(state){
        return state.list
    }
}
//要是有数组 假如想要用 menu/list取到 还需要设置命名空间
//namespaced:true, 命名空间
export default{
    state,
    mutations,
    actions,
    getters,
    namespaced:true,
}
//模块定好以后在 store的 index.js引入