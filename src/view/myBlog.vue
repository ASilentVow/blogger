<template>
    <div id="myBlog">
        <Card class="blog-table">
            <p slot="title">
                <Icon type="ios-create"></Icon>
                我的微博
            </p>
            <!-- 加载动画 -->
            <Row v-show="$store.state.blog_store.loading">
                <Col class="demo-spin-col">
                    <Spin fix>
                        <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                        <div>Loading</div>
                    </Spin>
                </Col>
            </Row>
            <!-- 微博列表 -->
            <ul class="blog-list" v-show="!$store.state.blog_store.loading">
                <li class="noBlog" v-if="!$store.state.blog_store.blogList.length">
                    <p>您暂时还没有发过微博!</p>
                </li>
                <li class="blog-item" v-for="(blogItem, index) in $store.state.blog_store.blogList" :key="index">
                    <div class="item-left">
                        <div class="user-pic">
                            <img :src="'../../static/images/avatar/' + blogItem.avatar" alt="">
                        </div>
                    </div>
                    <div class="item-right">
                        <div class="blog-info">
                            <span class="username">{{blogItem.username}}</span>
                            <span class="date">{{blogItem.postDate|dateFormat()}}</span>
                            <span class="delete" @click="del(blogItem._id)">
                                <Icon type="md-trash" size="16"/>
                            </span>
                        </div>
                        <div class="blog-content">
                            <p>{{blogItem.content}}</p>
                        </div>
                    </div>
                </li>
            </ul>
        </Card>
        <div class="page" style="text-align:center;margin:20px 0 20px 0">
            <Page v-if="$store.state.blog_store.blogList.length" :total="$store.state.user_store.blogNum" :page-size="5" @on-change="change"/>
        </div>
        <!-- 删除提示框 -->
        <Modal v-model="$store.state.form_store.delModal" width="360" :mask-closable="false">
            <p slot="header">
                <Icon type="ios-information-circle"></Icon>
                <span>删除确认</span>
            </p>
            <div style="text-align:center;font-size:14px">
                <p>确定要删除这条微博吗？</p>
            </div>
            <div slot="footer" style="display:flex;justify-content:space-around;">
                <Button type="primary" :loading="$store.state.blog_store.btnLoading" size="large" @click="$store.dispatch('del_blog',{blogId, delIndex})">删除</Button>
                <Button size="large" @click="$store.dispatch('close_form','delModal')">取消</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
export default {
    data(){
        return{
            delModal: false,
            delIndex: "",
            blogId: ""
        }
    },
    mounted() {
        this.$store.dispatch('get_blog')
    },
    methods: {
        del(blogId){
            this.$store.dispatch('open_form','delModal')
            this.blogId = blogId;
        },
        change(page){
            this.$store.dispatch('get_blog',page);
        }
    },
    filters: {
        dateFormat(date){
            return date.slice(0,-3);
        }
    }
}
</script>

