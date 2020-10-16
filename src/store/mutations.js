//这是根级别的状态 state mutation gette
export const state={
    //1.定义一个用户信息 最后的值是一个json 所以开始就定义成一个对象
    // userInfo:{}
    //1.1 一进页面应该判断一下页面有没有存过 有就把本地存储给你 没有就是{}
    userInfo: sessionStorage.getItem("userInfo") ? JSON.parse(sessionStorage.getItem("userInfo")) : {}
}
export const mutations={
    //2.修改用户信息
    changeUserInfo(state,info){
        //2.1 信息操作 给一个 具体信息 回头就把 userInfo改成那个具体的值了
        state.userInfo = info;
        //2.2 刷新还要在 所以本地存储操作（在本地存储中存储一份）
        //本地存储就是用sessionStorage和localStorage
        //sessionStorage和localStorage只要存就去就变成了字符串
        //直接存数据丢失 JSON.stringify(info)先变字符串 数据就不会丢失
        
        // if (info.id) {
            sessionStorage.setItem("userInfo", JSON.stringify(info))
        // } else {
        //     sessionStorage.removeItem("userInfo")
        // }
    }
}
export const getters={
    //3.导出数据 
    userInfo(state) {
        return state.userInfo;
    }
}
//用户在页面触发的时候 并不直接触发mutation 先触发action然后才触发mutation
//所以完成后 去action 设置