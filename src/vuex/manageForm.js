export default{
    state: {
        loginModal: false, // 登录提示框
        regModal: false,  // 注册提示框
        postModal: false, // 发布微博提示框
        delModal: false, // 删博提示框
        modModal: false, // 修改资料提示框
        removeModal: false, // 取关提示框
        removeFansModal: false // 移粉提示框
    },
    mutations: {
        OPEN_FORM(state,formname){
            state[formname] = true
        },
        CLOSE_FORM(state,formname){
            state[formname] = false
        }
    },
    actions: {
        open_form(context,formname){
            context.commit('OPEN_FORM',formname);
        },
        close_form(context,formname){
            context.commit('CLOSE_FORM',formname);
        },
    }
}