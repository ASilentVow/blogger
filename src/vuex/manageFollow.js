import axios from 'axios'
import iview from 'iview'

export default{
    state: {
        mayFollowList: "",
        pageSize: 0, // 可能关注列表查询页数
        btnIndex: -1,
        followList: "", // 关注列表
        followerList: "", // 粉丝列表
        loading: false, // 关注列表加载动画
        loading2: false, // 粉丝列表加载动画
        btnLoading: false // 按钮加载动画
    },
    mutations: {
        // 获取想关注列表
        GET_MAY_FOLLOW(state,payload){
            axios.post('server/mayFollow',{_id: payload.rootState.user_store.userId, page: state.pageSize}).then(res=>{
                state.mayFollowList = res.data;
            }).catch(error=>{
                console.log(error);
            })
        },
        // 改变查询页数
        CHANGE_PAGE_SIZE(state){
            state.pageSize = state.pageSize + 1;
            state.mayFollowList = "";
        },
        // 清空列表
        CLEAR_FOLLOW_LIST(state){
            state.mayFollowList = ""
            state.pageSize = 0
        },
        // 加关注
        FOLLOW(state,payload){
            // id为对方id，_id为用户id
            axios.post('server/follow',{id: payload.id, _id:payload.rootState.user_store.userId}).then(res=>{
                if(res.data.status === 1){
                    iview.Notice.success({
                        title: res.data.msg,
                        desc: '',
                        duration: 3
                    })
                }
                state.pageSize = 0;
                this.commit('GET_FOLLOW_LIST',{rootState: payload.rootState});
                this.commit('GET_MAY_FOLLOW',{rootState: payload.rootState, page: state.pageSize})
                this.commit('GET_INFO');
            }).catch(error=>{
                console.log(error);
            })
        },
        // 获取关注列表
        GET_FOLLOW_LIST(state,payload){  
            state.loading = true;
            let pageSize = payload.pageSize - 1;
            axios.post('server/getFollow',{username: payload.rootState.user_store.username, pageSize: pageSize}).then(res=>{
                state.followList = res.data.followList;
                state.loading = false;
            }).catch(error=>{
                console.log(error);
            })
        },
        // 取消关注
        REMOVE_FOLLOW(state,payload){
            state.btnLoading = true;
            axios.post('server/removeFollow',{username: payload.rootState.user_store.username, id: payload.id}).then(res=>{
                if(res.data.status === 1){
                    iview.Notice.success({
                        title: res.data.msg,
                        desc: '',
                        duration: 3
                    })
                    state.btnLoading = false;
                    payload.rootState.form_store.removeModal = false;
                    this.commit('GET_FOLLOW_LIST',{rootState: payload.rootState});
                    this.commit('GET_MAY_FOLLOW',{rootState: payload.rootState, page: state.pageSize})
                    this.commit('GET_INFO');
                }
            }).catch(error=>{
                console.log(error);
            })
        },
        // 获取粉丝列表
        GET_FOLLOWER_LIST(state,payload){  
            state.loading2 = true;
            let pageSize = payload.pageSize - 1;
            axios.post('server/getFollower',{username: payload.rootState.user_store.username, pageSize: pageSize}).then(res=>{
                state.followerList = res.data.followerList;
                state.loading2 = false;
            }).catch(error=>{
                console.log(error);
            })
        },
        // 移除粉丝
        REMOVE_FOLLOWER(state,payload){
            state.btnLoading = true;
            axios.post('server/removeFollower',{username: payload.rootState.user_store.username, id: payload.id}).then(res=>{
                if(res.data.status === 1){
                    iview.Notice.success({
                        title: res.data.msg,
                        desc: '',
                        duration: 3
                    })
                    state.btnLoading = false;
                    payload.rootState.form_store.removeFansModal = false;
                    this.commit('GET_FOLLOWER_LIST',{rootState: payload.rootState});
                    // this.commit('GET_MAY_FOLLOW',{rootState: payload.rootState, page: state.pageSize})
                    this.commit('GET_INFO');
                }
            }).catch(error=>{
                console.log(error);
            })
        }    
    },
    actions: {
        get_may_follow(context){
            let rootState = context.rootState
            context.commit('GET_MAY_FOLLOW',{rootState});
        },
        clear_follow_list(context){
            context.commit('CLEAR_FOLLOW_LIST');
        },
        change_follow_list(context){
            let rootState = context.rootState;
            context.commit('CHANGE_PAGE_SIZE');
            context.commit('GET_MAY_FOLLOW',{rootState});
        },
        follow(context,id){
            let rootState = context.rootState;
            context.commit('FOLLOW',{rootState, id});
        },
        get_follow_list(context,page=1){
            context.commit('GET_FOLLOW_LIST',{rootState: context.rootState,pageSize:page});
        },
        get_follower_list(context,page=1){
            context.commit('GET_FOLLOWER_LIST',{rootState: context.rootState,pageSize:page});
        },
        remove_follow(context,id){
            context.commit('REMOVE_FOLLOW',{rootState: context.rootState, id: id});
        },
        remove_follower(context,id){
            context.commit('REMOVE_FOLLOWER',{rootState: context.rootState, id: id});
        }
    }
}