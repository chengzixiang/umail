//引入axios 和 qs
import axios from "axios"
// axios的作用是什么呢：axios主要是用于向后台发起请求的，还有在请求中做更多是可控功能。
// 特点：支持浏览器和node.js
//             支持promise
//             能拦截请求和响应
//             能转换请求和响应数据
//             能取消请求
//             自动转换JSON数据

import qs from "qs"
// qs可通过npm install qs命令进行安装，是一个npm仓库所管理的包。
// 而qs.stringify()将对象 序列化成URL的形式，以&进行拼接。


import Vue from "vue"
//开发环境下使用
//把这个东西挂载到 vue上 这样图片就不用写了

import store from "../store"
import {warningAlert} from "./alert"
import router from "../router"

Vue.prototype.$imgPre="http://localhost:3000"

//定义一个基础路径
let baseUrl="/api";



//请求拦截  后台的app.js 后端拦截要打开  因为都要带token token在本地存储存这呢
axios.interceptors.request.use(req => {
    // console.log("---请求拦截----");
    // console.log(req);
    //登陆不需要token 所以判断一下
    if (req.url != baseUrl + "/api/userlogin") {
        //后端想要在req.headers后面加.authorization 字段 等于你的token
        req.headers.authorization = store.state.userInfo.token;
    }
    return req;
})




// 响应拦截 
//请求回来的数据打印查看
//res={}是后端返回的数据 必须return res返回去 要不然组件会报undefined
//res.config.url 请求地址
axios.interceptors.response.use(res => {
    console.group("=====本次请求路径是:" + res.config.url)
    console.log(res);
    console.groupEnd()
    //判断一下 是否掉线  
    if(res.data.msg=='登录已过期或访问权限受限'){
        warningAlert(res.data.msg)
        router.push("/login")
    }

    return res;
})


//当完成页面的添加样式完成后 紧接着 根据后台要求传输数据
/************ 菜单管理 **************/
//1.添加
//调用函数的的时候 必须给我参数 所以 一会要把参数给下面 
//params需要穿一个接送过去  参数中要的id等所有字段都要穿过去
export const reqMenuAdd= (params)=>{
    return axios({
        //根据后台要去去反回
        //路径 路径都是文件中给的 文件查看
        //baseUrl 当换了接口时需要去页面一个一个换，所以设置一个baseUrl这样可以只要换config.js文件内的url.
        url:baseUrl+"/api/menuadd",
        //请求方法
        method:"post",
        //传参 data
        //传递要求没有要求文件的 所以需要转一下
        data:qs.stringify(params)
    })
}

//列表接口 
export const reqMenuList=()=>{
    return axios({
        // baseUrl基础路径加上 后台要求的路径
        url:baseUrl+"/api/menulist",
        method:"get",
        params:{
            istree:true
        }
    })
}

//list中删除接口
export const reqMenuDel=(id)=>{
    return axios({
        url:baseUrl+"/api/menudelete",
        method:"post",
        data:qs.stringify({id:id})
    })
}

//编辑按钮 一条数据请求 
export const reqMenuDetail=(id)=>{
    return axios({
        // baseUrl基础路径加上 后台要求的路径
        url:baseUrl+"/api/menuinfo",
        method:"get",
        params:{
            id:id
        }
    })
}


// add.vue修改按钮
export const reqMenuUpdate=(params)=>{
    return axios({
        // baseUrl基础路径加上 后台要求的路径
        url:baseUrl+"/api/menuedit",
        method:"post",
        data:qs.stringify(params)
    })
}



//当完成页面的添加样式完成后 紧接着 根据后台要求传输数据
/************ 角色管理 **************/

//一进去页面就要取角色管理的 列表数据 也存在状态层

//1.添加
//调用函数的的时候 必须给我参数 所以 一会要把参数给下面 
//params需要穿一个接送过去  参数中要的id等所有字段都要穿过去
export const reqRoleAdd= (params)=>{
    return axios({
        //根据后台要去去反回
        //路径 路径都是文件中给的 文件查看
        //baseUrl 当换了接口时需要去页面一个一个换，所以设置一个baseUrl这样可以只要换config.js文件内的url.
        url:baseUrl+"/api/roleadd",
        //请求方法
        method:"post",
        //传参 data
        //传递要求没有要求文件的 所以需要转一下
        data:qs.stringify(params)
    })
}

//列表接口 
export const reqRoleList=()=>{
    return axios({
        // baseUrl基础路径加上 后台要求的路径
        url:baseUrl+"/api/rolelist",
        method:"get",
    })
}

//list中删除接口
export const reqRoleDel=(id)=>{
    return axios({
        url:baseUrl+"/api/roledelete",
        method:"post",
        data:qs.stringify({id:id})
    })
}

//编辑按钮 一条数据请求 
export const reqRoleDetail=(id)=>{
    return axios({
        // baseUrl基础路径加上 后台要求的路径
        url:baseUrl+"/api/roleinfo",
        method:"get",
        params:{
            id:id
        }
    })
}


// add.vue修改按钮
export const reqRoleUpdate=(params)=>{
    return axios({
        // baseUrl基础路径加上 后台要求的路径
        url:baseUrl+"/api/roleedit",
        method:"post",
        data:qs.stringify(params)
    })
}

/************ 管理员管理 **************/

//一进去页面就要取角色管理的 列表数据 也存在状态层

//1.添加
//调用函数的的时候 必须给我参数 所以 一会要把参数给下面 
//params需要穿一个接送过去  参数中要的id等所有字段都要穿过去
export const reqManageAdd= (params)=>{
    return axios({
        //根据后台要去去反回
        //路径 路径都是文件中给的 文件查看
        //baseUrl 当换了接口时需要去页面一个一个换，所以设置一个baseUrl这样可以只要换config.js文件内的url.
        url:baseUrl+"/api/useradd",
        //请求方法
        method:"post",
        //传参 data
        //传递要求没有要求文件的 所以需要转一下
        data:qs.stringify(params)
    })
}

//管理员列表总数  页数
export const reqManageCount=()=>{
    return axios({
        url:baseUrl+"/api/usercount",
    })
}


//列表接口 根据后台需要 后台要数据 所以用 params
//传递参数还得是  params={page：1，size：10}
export const reqManageList=(params)=>{
    return axios({
        // baseUrl基础路径加上 后台要求的路径
        url:baseUrl+"/api/userlist",
        method:"get",
        params:params
    })
}

//list中删除接口
export const reqManageDel=(uid)=>{
    return axios({
        url:baseUrl+"/api/userdelete",
        method:"post",
        data:qs.stringify({uid:uid})
    })
}

//编辑按钮 一条数据请求 
export const reqManageDetail=(uid)=>{
    return axios({
        // baseUrl基础路径加上 后台要求的路径
        url:baseUrl+"/api/userinfo",
        method:"get",
        params:{
            uid:uid
        }
    })
}


// add.vue修改按钮1111
export const reqManageUpdate=(params)=>{
    return axios({
        // baseUrl基础路径加上 后台要求的路径
        url:baseUrl+"/api/useredit",
        method:"post",
        data:qs.stringify(params)
    })
}


/******************************** 登陆接口 **************************/
export const reqLogin = (params) => {
    return axios({
        url: baseUrl + "/api/userlogin",
        method: "post",
        data: qs.stringify(params)
    })
}


/************ 商品分类管理 **************/
//1.添加
//添加 params={pid:1,catename:"123",img:File,state:1}
//传的params 带文件了 就不能用qs.stringify转了 得用 FormData
export const reqCateAdd= (params)=>{
    let data = new FormData()
    //后端要什么就一直append就行 前面的字段是名字 后面的是值
    /*
    data.append("pid",1)
    data.append("catename","123")
    data.append("img",File)
    data.append("status",1)
    **/
   //params的字段包括这些了 所以这里直接 for in
    for(let i in params){
        data.append(i,params[i])
    }

    return axios({
        //根据后台要去去反回
        //路径 路径都是文件中给的 文件查看
        //baseUrl 当换了接口时需要去页面一个一个换，所以设置一个baseUrl这样可以只要换config.js文件内的url.
        url:baseUrl+"/api/cateadd",
        //请求方法
        method:"post",
        //传参 data
        //传递要求没有要求文件的 所以需要转一下
        data:data
    })
}

//列表接口 
//这可以传参但是参数不确定 所以给一个参数
export const reqCateList=(params)=>{
    return axios({
        // baseUrl基础路径加上 后台要求的路径
        url:baseUrl+"/api/catelist",
        method:"get",
        params:params,
    })
}

//list中删除接口
export const reqCateDel=(id)=>{
    return axios({
        url:baseUrl+"/api/catedelete",
        method:"post",
        data:qs.stringify({id:id})
    })
}

//编辑按钮 一条数据请求 
export const reqCateDetail=(id)=>{
    return axios({
        // baseUrl基础路径加上 后台要求的路径
        url:baseUrl+"/api/cateinfo",
        method:"get",
        params:{
            id:id
        }
    })
}


// add.vue修改按钮
export const reqCateUpdate=(params)=>{
    let data = new FormData()
    for(let i in params){
        data.append(i,params[i])
    }
    return axios({
        // baseUrl基础路径加上 后台要求的路径
        url:baseUrl+"/api/cateedit",
        method:"post",
        data:data
    })
}



/*********商品规格管理***************/
//添加
export const reqSpecsAdd = (params) => {
    return axios({
        url: baseUrl + "/api/specsadd",
        method: "post",
        data: qs.stringify(params)
    })
}

//管理员总数
export const reqSpecsCount = () => {
    return axios({
        url: baseUrl + "/api/specscount",
    })
}

//列表 params={page:1,size:10}
export const reqSpecsList = (params) => {
    return axios({
        url: baseUrl + "/api/specslist",
        method: "get",
        params: params
    })
}
//删除
export const reqSpecsDel = (id) => {
    return axios({
        url: baseUrl + "/api/specsdelete",
        method: "post",
        data: qs.stringify({ id: id })
    })
}

//1条
export const reqSpecsDetail = (id) => {
    return axios({
        url: baseUrl + "/api/specsinfo",
        method: "get",
        params: {
            id: id
        }
    })
}

//修改
export const reqSpecsUpdate = (params) => {
    return axios({
        url: baseUrl + "/api/specsedit",
        method: "post",
        data: qs.stringify(params)
    })
}



/************ 商品管理 **************/
//1.添加接口
export const reqGoodsAdd=(form)=>{
    //穿一个json 但是涉及到文件 所有用 form.data
    let data = new FormData()
    for(let i in form){
        data.append(i,form[i])
    }
    return axios({
        url:baseUrl+"/api/goodsadd",
        method:"post",
        data:data,
    })
}
//2.总数
export const reqGoodsCount=()=>{
    return axios({
        url:baseUrl+"/api/goodscount",
        method:"get",
    })
}
//3.列表数据
export const reqGoodsList=(params)=>{
    return axios({
        url:baseUrl+"/api/goodslist",
        method:"get",
        params:params,
    })
}
//4.商品详情
export const reqGoodsDetail=(params)=>{
    return axios({
        url:baseUrl+"/api/goodsinfo",
        method:"get",
        //这里的传值格式 params={id:'1'}
        params:params,
    })
}
//5.商品修改
export const reqGoodsUpdate=(form)=>{
    //穿一个json 但是涉及到文件 所有用 form.data
    let data = new FormData()
    for(let i in form){
        data.append(i,form[i])
    }
    return axios({
        url:baseUrl+"/api/goodsedit",
        method:"post",
        data:data,
    })
}
//6.删除
export const reqGoodsDel=(params)=>{
    return axios({
        url:baseUrl+"/api/goodsdelete",
        method:"post",
        //这里的传值格式 params={id:'1'}
        //这里post 请求 得 qs.stringfig转一下
        data:qs.stringify(params),
    })
}