import { reqSpecsCount, reqSpecsList } from "../../utils/request"

const state = {
    //菜单列表数据 list
    list:[],
    // 设置分页展示多少条数据
    size:2,
    //设置总数 这样就可以算出有多少条数据
    total:0,
    //设置变量 控制页码  默认第一页
    page:1,
}
const mutations = {
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
const actions = {
    //页面请求
    reqListAction(context,bool) {
        //发请求
        //做一个判断 防止其他页面想要获取完整数据
        let params = bool?{}:{ page: context.state.page, size: context.state.size }
        reqSpecsList(params).then(res => {
           // 成功之后修改数组 替换一下 赋值的数据就是你查看的数据 所以这里是res.data.list
            let list = res.data.list ? res.data.list : []

            //如果取到的数据是null,并且不是第一页，那么就页码减1，重新请求list
            if(context.state.page>1&&list.length==0){
                context.commit("changePage",context.state.page-1)
                context.dispatch("reqListAction")
                return;
            }
            //当页面拿到数据的时候是一个字符串 把字符串变成数组 然后才能赋值
            list.forEach(item=>{
                item.attrs=JSON.parse(item.attrs)
            })
            
            context.commit("changeList", list)
        })
    },
    //获取总数的请求
    // 总数的请求  这里还得获取一下
    // 一进页面就要 获取总数 所以一进页面就要触发
    reqTotalAction(context){
        reqSpecsCount().then(res=>{
            context.commit("changeTotal",res.data.list[0].total)
        })
    },
    //组件修改了页码
    changePageAction(context,page){
        //修改页码
        context.commit("changePage",page)
        //发起list请求
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