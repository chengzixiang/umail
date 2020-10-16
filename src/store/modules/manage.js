//对于这个menu 他就有自己的 mutations state acions和 getters
//所以定义自己的状态 修改状态

//context 可以直接取状态里面的数据 他也可以取触发 mutation 还可以触发action 
//所以action是一个处理逻辑的地方 有仓库   mutations 没办法处理逻辑 因为他只要状态

// 一旦触发请求就要调用接口 所以 引入接口
import {reqManageList, reqManageCount} from "../../utils/request"



// 引入完模块之后 直接写状态层 写完直接给主键展示就行
/***要做的事列表数据 最后返回的是数组  
    提前定义一个空数组 稍后返回一个有数据的数组替换就可以*/
//状态
const state={
    //菜单列表数据 list
    list:[],
    // 设置分页展示多少条数据
    size:2,
    //设置总数 这样就可以算出有多少条数据
    total:0,
    //设置变量 控制页码  默认第一页
    page:1,
}
//修改状态
const mutations={
    //专门修改 state的 list
    changeList(state,arr){
        state.list=arr;
    },
    // 修改total 总页数
    changeTotal(state,num){
        state.total = num;
    },
    //修改页面 展示每个页码的数据
    changePage(state,page){
        state.page=page;
    }
}
//
const actions={
    //页面触发页面请求 得到列表数据后 再去修改
    reqListAction(context){
        // 页面一旦触发 reqListActiom立刻发送请求 就去获取列表数据
        //发请求获取列表数据就得ajax请求 然后查看后台 数据
        //再次先要写一下接口 取request里面写接口
        /*size 这里是每一次请求都是2 这里是设置一页设置几个 
           所以这里和前面list页面分页的 page-size希望统一 \
           用的时候上面定义好 下面直接用 context就是仓库
           */
          
           //当前页面第几个 就展示第几个  然后就该操作页面点了页码 发送请求
           //删除完当前页码数据的时候 会发生暂无数据 而不是刷新到前一个页面的数据
           //  所以在页面请求做判断
        reqManageList({page:context.state.page,size:context.state.size}).then(res=>{
            // 成功之后修改数组 替换一下 赋值的数据就是你查看的数据 所以这里是res.data.list
            let list=res.data.list?res.data.list:[];

            //如果取到的数据是null,并且不是第一页，那么就页码减1，重新请求list
                if(context.state.page>1&&list.length==0){
                    context.commit("changePage",context.state.page-1)
                    context.dispatch("reqListAction")
                    return;
                }

            context.commit('changeList',list)
        })
    },
    // 总数的请求  这里还得获取一下
    // 一进页面就要 获取总数 所以一进页面就要触发
    reqTotalAction(context){
        reqManageCount().then(res=>{
            //请求完成的时候 返回一个总数
            context.commit("changeTotal",res.data.list[0].total)
        })
    },

    //点击页码 刷新数据
    //调用action的时候 给一个页码 page
    changePageAction(context,page){
        //修改页码
        context.commit("changePage",page);
        //发起list请求  然后查看 ui官方 的给的内容 
        //page修改后 重新发送列表请求  所以这里只要触发上面的 reqListAction 就行
        // dispatch 触发当前页码的 action  触发当前页码的就用dispatch
        context.dispatch('reqListAction')
        
    }
}
//导出数据
const getters={
    // 完成以后导出就可以用了
    list(state){
        return state.list
    },
    //是状态就可以导出
    size(state){
        return state.size
    },
    //外面的 组件 list还有用 所以这里导出
    total(state){
        return state.total;
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