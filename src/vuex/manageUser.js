import axios from 'axios'

export default{
    state: {
        username: '',
        user: '',
        userId: '',
        blogNum: '',
        followNum: '',
        followerNum: ''
      },
    mutations: {
        SET_USER(state,payload){
            state.username = payload.username
            state.userId = payload.userId
            sessionStorage.setItem('username',payload.username)
            sessionStorage.setItem('userId',payload.userId)
        },
        LOGIN_OUT(state){
            sessionStorage.removeItem('username')
            sessionStorage.removeItem('userId')
            state.blogNum = 0
            state.followNum = 0
            state.followerNum = 0
            state.username = ''
            state.userId = ''
            state.user = ''
        },
        CLEAR_BLOG(state,rootState){
            rootState.blog_store.blogList = [];
        },
        GET_INFO(state){
            axios.post('server/getInfo',{username: state.username,userId: state.userId}).then(res=>{
                state.user = res.data.user.userInfo[0];
                state.blogNum = res.data.user.blogNum;
                state.followNum = res.data.user.followNum;
                state.followerNum = res.data.user.followerNum;
            }).catch(error=>{
                console.log(error);
            })
        }
    },
    actions: {
        set_user(context,payload){
            context.commit('SET_USER',payload);
        },
        login_out(context){
            context.commit('LOGIN_OUT');
            context.commit('CLEAR_BLOG',context.rootState);
        },
        get_info(context){
            context.commit('GET_INFO');
        }
    }
}