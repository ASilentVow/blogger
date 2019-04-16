import axios from 'axios'
import iview from 'iview'

export default{
    state: {
        blogContent: '',
        blogList: [],
        loading: false,
        btnLoading: false,
        pageSize: 0,
        mainBlog: [], // 首页微博列表
        newsList: [] // 首页新闻列表
    },
    mutations: {
        // rootState为根节点状态 即store.js的state
        POST_BLOG(state,rootState){
            let blogContent = state.blogContent;
            state.blogContent = "";
            axios.post('server/postBlog',{content: blogContent,username: rootState.user_store.username,userId: rootState.user_store.userId,avatar: rootState.user_store.user.avatar}).then(res=>{
                if(res.data.status === 1){
                    iview.Notice.success({
                        title: res.data.msg,
                        desc: '',
                        duration: 3
                    })
                    rootState.form_store.postModal = false;
                    this.commit('GET_INFO');
                    this.commit('GET_BLOG',{rootState: rootState, page: 1});
                    this.commit('GET_MAIN_BLOG',{rootState: rootState});
                }
            }).catch(error=>{
                console.log(error);
            })
        },
        // 获取个人页面的微博列表
        GET_BLOG(state,payload){
            state.pageSize = payload.page - 1
            state.loading = true
            axios.post('server/getBlog',{username: payload.rootState.user_store.username, pageSize: state.pageSize}).then(res=>{
                state.blogList = res.data;
                state.loading = false
            }).catch(error=>{
                console.log(error);
            })
        },
        DEL_BLOG(state,payload){
            state.btnLoading = true;
            axios.post('server/delBlog',{blogId: payload.data.blogId}).then(res=>{
                if(res.data.status === 1){
                    state.btnLoading = false;
                    iview.Notice.success({
                        title: res.data.msg,
                        desc: '',
                        duration: 3
                    })
                    payload.rootState.form_store.delModal = false;
                    this.commit('GET_INFO');
                    this.commit('GET_BLOG',{rootState: payload.rootState, page: 1});
                }
            }).catch(error=>{
                console.log(error);
                state.btnLoading = false;
            })
        },
        // 获取主页微博列表
        GET_MAIN_BLOG(state,payload){
            state.mainBlog = [];
            state.loading = true
            axios.post('server/getMainBlog',{userId: payload.rootState.user_store.userId, pageSize: state.mainPageSize}).then(res=>{
                if(res.data.status === 1){
                    state.mainBlog = res.data.mainBlog;
                }
                state.loading = false;
            }).catch(error=>{
                console.log(error);
            })
        },
        // 获取主页新闻列表
        GET_NEWS(state){
            axios.get('news/nc/article/headline/T1348647853363/0-40.html').then(res=>{    
                state.newsList = res.data.T1348647853363;
            }).catch(error=>{
                console.log(error);
            })
        },
        INSERT_EMOJI(state,emoji){
            state.blogContent += emoji;
        }
    },
    actions: {
        post_blog(context){
            // 传入根节点状态rootState
            context.commit('POST_BLOG',context.rootState)
        },
        get_blog(context,page=1){
            context.commit('GET_BLOG',{rootState: context.rootState, page: page})
        },
        del_blog(context,data){
            let rootState = context.rootState
            context.commit('DEL_BLOG',{rootState, data})
        },
        get_main_blog(context){
            context.commit('GET_MAIN_BLOG',{rootState: context.rootState})
        },
        get_news(context){
            context.commit('GET_NEWS');
        },
        insert_emoji(context,emoji){
            context.commit('INSERT_EMOJI',emoji);
        }
    }
}