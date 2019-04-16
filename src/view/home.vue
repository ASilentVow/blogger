<template>
    <div id="home">
        <div class="no-login" v-if="!$store.state.user_store.username">
            <div class="left-wrap">
                <Affix :offset-top="60">
                    <div class="no-login-left">
                        <div class="no-login-table">
                            <div class="header">
                                <Icon type="ios-contact" size="80"/>
                            </div>
                            <div class="status">
                                <p>未登录</p>
                            </div>
                            <div class="no-login-btn">
                                <Button type="primary" long @click="$store.dispatch('open_form','loginModal')">登录</Button>
                                <Button type="primary" ghost long @click="$store.dispatch('open_form','regModal')">注册</Button>
                            </div>
                        </div>
                    </div>
                </Affix>
            </div>
            <!-- 新闻面板 -->
            <div class="news-table">
                <div class="news-item" v-for="(item, index) in $store.state.blog_store.newsList" :key="index" v-if="index>7&&index<38">
                    <Card>
                        <div class="news-pic">
                            <a :href="item.url_3w" target="_blank">
                                <img v-lazy="item.imgsrc" alt="">
                            </a>
                        </div>
                        <div class="news-title">
                            <a :href="item.url_3w" target="_blank">
                                <p>{{item.title}}</p>
                            </a>
                        </div>
                        <div class="news-digest">
                            <p>{{item.digest}}...</p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
        <!-- 登录成功面板 -->
        <div class="home-table" v-if="$store.state.user_store.username">
            <div class="left-wrap">
                <Affix :offset-top="60">
                    <div class="home-left">
                        <div class="user-info">
                            <div class="user-pic">
                                <img v-lazy="'../../static/images/avatar/'+$store.state.user_store.user.avatar" alt="">
                            </div>
                            <div class="username">
                                <span>{{$store.state.user_store.user.username}}</span>
                            </div>
                            <div class="user-follow">
                                <div class="follow-item">
                                    <p class="follow-num">{{$store.state.user_store.blogNum}}</p>
                                    <p class="follow-title">微博</p>
                                </div>
                                <div class="follow-item">
                                    <p class="follow-num">{{$store.state.user_store.followNum}}</p>
                                    <p class="follow-title">关注</p>
                                </div>
                                <div class="follow-item">
                                    <p class="follow-num">{{$store.state.user_store.followerNum}}</p>
                                    <p class="follow-title">粉丝</p>
                                </div>
                            </div>
                        </div>
                        <div class="user-operate">
                            <div class="operate-item">
                                <Icon type="ios-star-outline" />
                                我的收藏
                            </div>
                            <div class="operate-item">
                                <Icon type="ios-chatboxes-outline" />
                                我的评论
                            </div>
                            <div class="operate-item">
                                <Icon type="ios-thumbs-up-outline" />
                                我的赞
                            </div>
                        </div>
                    </div>
                </Affix>
            </div>
            <div class="home-middle">
                <div class="post-blog">
                    <Card>
                        <div class="title">
                            <p>来分享最近发生的趣事！</p>
                            <div class="contentLen" v-if="$store.state.blog_store.blogContent">已输入{{$store.state.blog_store.blogContent.length}}字</div>
                        </div>
                        <Form>
                            <FormItem class="inputArea">
                                <Input v-model="$store.state.blog_store.blogContent" type="textarea" :autosize="{maxRows: 3,minRows: 3}"></Input>
                            </FormItem>
                        </Form>
                        <div class="footer clearfix">
                            <emoji-picker>
                                <div class="emoji-invoker" slot="emoji-invoker" slot-scope="{ events }" v-on="events">
                                    <Icon type="md-happy" size="24"/>
                                </div>
                                <Card class="emoji_frame" slot="emoji-picker" slot-scope="{ emojis, insert, display }" :dis-hover="true">
                                    <Tabs>
                                        <TabPane v-for="(emojiGroup, category) in emojis" :key="category" :label="category" :name="category">
                                            <div class="emoji-group">
                                                <span v-for="(emoji, emojiName) in emojiGroup" :title="emojiName" class="emojiSpan" @click="$store.dispatch('insert_emoji',emoji)">{{emoji}}</span>
                                            </div>
                                        </TabPane>
                                    </Tabs>
                                </Card>
                            </emoji-picker>
                            <Button type="primary" @click="$store.dispatch('post_blog')" :disabled="!$store.state.blog_store.blogContent">发布</Button>
                        </div>
                    </Card>
                </div>
                <Col class="demo-spin-col" v-show="$store.state.blog_store.loading">
                    <Spin fix>
                        <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                    </Spin>
                </Col>
                <div class="blog-table" v-show="!$store.state.blog_store.loading">
                    <div class="no-blog" v-show="!$store.state.blog_store.mainBlog.length">
                        <p>暂时还没有任何人发微博!</p>
                    </div>
                    <Card style="margin-top: 10px;" v-for="(item, index) in $store.state.blog_store.mainBlog" :key="index" v-show="$store.state.blog_store.mainBlog.length">
                        <div class="blog-item">
                            <div class="item-left">
                                <div class="user-pic">
                                    <img v-lazy="'../../static/images/avatar/' + item.avatar" alt="">
                                </div>
                            </div>
                            <div class="item-right">
                                <div class="blog-info">
                                    <p class="username">{{item.username}}</p>
                                    <p class="date">{{item.postDate|dateFormat()}}</p>
                                </div>
                                <div class="blog-content">
                                    <p>{{item.content}}</p>
                                </div>
                            </div>
                        </div>
                        <div class="blog-btn">
                            <div class="collect">
                                <Icon type="ios-star-outline" />
                                0
                            </div>
                            <div class="comment">
                                <Icon type="ios-chatboxes-outline" />
                                0
                            </div>
                            <div class="like">
                                <Icon type="ios-thumbs-up-outline" />
                                0
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
        <!-- 回到顶部 -->
        <BackTop></BackTop>
    </div>
</template>

<script>
import '../assets/less/home.less'
import emojiPicker from 'vue-emoji-picker'

export default {
    data(){
        return{
            busy: false
        }
    },
    mounted() {
        if(this.$store.state.user_store.userId){
            this.$store.dispatch('get_info');
            this.$store.dispatch('get_main_blog',0);
        }else{
            this.$store.dispatch('get_news');
        }
    },
    methods: {},
    filters: {
        dateFormat(date){
            return date.slice(0,-3);
        }
    },
    components: {
        emojiPicker
    }
}
</script>

