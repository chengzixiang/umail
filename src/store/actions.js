//跟级别下的 actions
export const actions={
    //登陆成功设值
    //组件触发修改userInfo
    changeUserInfoAction(context,info){
        context.commit("changeUserInfo",info)
    }
    //页面给一个对象 直接commit去修改他 返回值
}