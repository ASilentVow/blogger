<template>
    <div id="my">
        <div class="my-table" v-if="$store.state.user_store.user">
            <div class="wrap">
                <div class="my-left">
                    <!-- 个人信息 -->
                    <div class="my-info">
                        <div class="my-header" style="background-image: url(../../static/images/bg.jpg)">
                            <div class="my-pic">
                                <div class="pic-out">
                                    <img :src="'../../static/images/avatar/'+$store.state.user_store.user.avatar" alt="">
                                </div>
                            </div>
                            <div class="my-name">
                                <span>{{$store.state.user_store.user.username}}</span>
                                <span class="male" v-if="$store.state.user_store.user.sex === '男'">
                                    <Icon type="md-male" size="10"/>
                                </span>
                                <span class="female" v-if="$store.state.user_store.user.sex === '女'">
                                    <Icon type="md-female" size="10"/>
                                </span>
                            </div>
                            <div class="my-sign">
                                <span>{{$store.state.user_store.user.sign}}</span>
                            </div>
                        </div>
                        <div class="my-follow">
                            <div class="follow-item">
                                <router-link to="/my/myBlog">
                                    <span class="follow-num">{{$store.state.user_store.blogNum}}</span>
                                    <span class="follow-title">微博</span>
                                </router-link>
                            </div>
                            <div class="follow-item">
                                <router-link to="/my/myFollow">
                                    <span class="follow-num">{{$store.state.user_store.followNum}}</span>
                                    <span class="follow-title">关注</span>
                                </router-link>
                            </div>
                            <div class="follow-item">
                                <router-link to="/my/myFollower">
                                    <span class="follow-num">{{$store.state.user_store.followerNum}}</span>
                                    <span class="follow-title">粉丝</span>
                                </router-link>
                            </div>
                        </div>
                        <div class="manage-info">
                            <Button type="primary" icon="md-clipboard" ghost @click="modify()">编辑个人资料</Button>
                        </div>
                    </div>
                    <!-- 推荐关注列表 -->
                    <Affix>
                        <div class="strange">
                            <Card>
                                <p slot="title">
                                    <Icon type="md-person-add" />
                                    可能想关注的人
                                </p>
                                <a href="javascript:;" slot="extra" @click="$store.dispatch('change_follow_list')">
                                    <Icon type="md-refresh" />
                                    换一批
                                </a>
                                <!-- 加载动画 -->
                                <Row>
                                    <Col class="demo-spin-col" v-show="!$store.state.follow_store.mayFollowList">
                                        <Spin fix>
                                            <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                                            <div>Loading</div>
                                        </Spin>
                                    </Col>
                                </Row>
                                <ul class="strange-list" v-show="$store.state.follow_store.mayFollowList">
                                    <li class="strange-item" v-for="(followItem, index) in $store.state.follow_store.mayFollowList" :key="index">
                                        <div class="item-left">
                                            <div class="user-pic">
                                                <img v-lazy="'../../static/images/avatar/' + followItem.avatar" alt="">
                                            </div>
                                        </div>
                                        <div class="item-middle">
                                            <div class="username">
                                                <span>{{followItem.username}}</span>
                                                <span class="male" v-if="followItem.sex === '男'">
                                                    <Icon type="md-male" size="10"/>
                                                </span>
                                                <span class="female" v-if="followItem.sex === '女'">
                                                    <Icon type="md-female" size="10"/>
                                                </span>
                                            </div>
                                            <div class="item-btn">
                                                <Button icon="md-add" type="primary" size="small" :disabled="!followItem.sign" @click="$store.dispatch('follow',followItem._id);disableBtn(followItem)">添加关注</Button>
                                            </div>
                                        </div>
                                    </li>
                                    <li v-show="$store.state.follow_store.mayFollowList.length === 0">
                                        <p style="text-align:center">暂无更多</p>
                                    </li>
                                </ul>
                            </Card>
                        </div>
                    </Affix>
                </div>
                <div class="my-right">
                    <router-view></router-view>
                </div>
            </div>
        </div>
        <!-- 未登录提示 -->
        <div class="no-login" v-if="!$store.state.user_store.username">
            <Card class="no-login-card">
                <div class="content">
                    <div class="content-info">
                        <div class="content-text">
                            <svg t="1539850645900" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1866" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="30">
                                <g>
                                    <path d="M807.152941 361.411765C879.435294 292.141176 819.2 216.847059 819.2 216.847059 819.2 216.847059 837.270588 298.164706 728.847059 262.023529 671.623529 210.823529 596.329412 180.705882 515.011765 180.705882 433.694118 180.705882 361.411765 210.823529 304.188235 259.011765 186.729412 304.188235 204.8 216.847059 204.8 216.847059 204.8 216.847059 144.564706 295.152941 219.858824 364.423529 198.776471 409.6 186.729412 457.788235 186.729412 508.988235 186.729412 692.705882 334.305882 840.282353 515.011765 840.282353 695.717647 840.282353 843.294118 692.705882 843.294118 508.988235 843.294118 457.788235 828.235294 406.588235 807.152941 361.411765ZM364.423529 548.141176C307.2 548.141176 289.129412 512 289.129412 475.858824 289.129412 439.717647 307.2 382.494118 349.364706 382.494118 391.529412 382.494118 418.635294 436.705882 436.705882 475.858824 454.776471 512 421.647059 548.141176 364.423529 548.141176ZM659.576471 548.141176C602.352941 548.141176 569.223529 512 587.294118 475.858824 605.364706 439.717647 638.494118 382.494118 677.647059 382.494118 716.8 382.494118 731.858824 436.705882 731.858824 475.858824 731.858824 515.011765 713.788235 548.141176 659.576471 548.141176Z" p-id="1867" fill="#1ea8e3"></path>
                                </g>
                            </svg>
                            <p>您尚未登录，暂时无法访问个人中心</p>
                        </div>
                        <div class="content-btn">
                            <Button type="primary" long @click="$store.dispatch('open_form','loginModal')">立即登录</Button>
                            <Button type="primary" ghost long @click="$store.dispatch('open_form','regModal')">立即注册</Button>
                        </div>
                    </div>
                </div>
            </Card>   
        </div>
        <!-- 个人资料修改框 -->
        <div class="modify">
            <Modal title="修改资料" v-model="$store.state.form_store.modModal" :mask-closable="false">
                <Form :label-width="60">
                    <div class="mod-table">
                        <div class="mod-left">
                            <div class="user-pic">
                                <img :src="curUser.avatar" alt="" style="width:100px;">
                            </div>
                            <Upload 
                            ref="upload"
                            action="server/image"
                            :before-upload = "handleUpload"
                            :format="['jpg','jpeg','png','gif']"
                            :on-format-error="handleFormatError">
                                <Button icon="ios-cloud-upload-outline" type="primary">上传头像</Button>
                            </Upload>
                        </div>
                        <div class="mod-right">
                            <FormItem label="昵称">
                                <Input v-model="curUser.name"></Input>
                            </FormItem>
                            <FormItem label="个性签名">
                                <Input v-model="curUser.sign"></Input>
                            </FormItem>
                            <FormItem label="性别">
                                <RadioGroup v-model="curUser.sex">
                                    <Radio label="男">男</Radio>
                                    <Radio label="女">女</Radio>
                                </RadioGroup>
                            </FormItem>
                        </div>
                    </div>
                </Form>
                <div slot="footer">
                    <Button type="primary" :disabled="!curUser.name" :loading="modLoading" @click="modInfo()">修改</Button>
                </div>
            </Modal>
        </div>
    </div>
</template>

<script>
import '../assets/less/my.less'
export default {
    data(){
        return{
            curUser: {
                name: '',
                sign: '',
                sex: '',
                userId: '',
                avatar: ''
            },
            modLoading: false,
            uploadImg: ''
        }
    },
    mounted() {
        if(this.$store.state.user_store.userId){
            // 获取个人资料
            this.$store.dispatch('get_info');
            // 获取想关注列表
            this.$store.dispatch('get_may_follow');
        }
    },
    methods: {
        // 修改个人资料
        modify(){
            this.curUser.name = this.$store.state.user_store.user.username
            this.curUser.sign = this.$store.state.user_store.user.sign
            this.curUser.sex = this.$store.state.user_store.user.sex
            this.curUser.userId = this.$store.state.user_store.userId
            this.curUser.avatar ='../../static/images/avatar/' + this.$store.state.user_store.user.avatar
            this.$store.dispatch('open_form','modModal')
        },
        modInfo(){
            this.modLoading = true;
            this.axios.post('server/modInfo',{curUser:this.curUser}).then(res=>{
                if(res.data.status === 1){
                    this.modLoading = false
                    this.$store.dispatch('set_user',{username: this.curUser.name,userId: this.curUser.userId})
                    this.upload();
                    this.$store.dispatch('close_form','modModal')
                    location.reload();
                }else{
                    this.modLoading = false
                    this.$Message.error(res.data.msg);
                }
            }).catch(error=>{
                console.log(error);
            })
        },
        handleUpload(img){
            let _this = this;
            let event = event || window.event;
            let file = event.target.files[0];
            let reader = new FileReader(); 
            //转base64
            reader.onload = function(e) {
                _this.curUser.avatar = e.target.result;
            }
            reader.readAsDataURL(file);
            this.uploadImg = img;
            return false
        },
        handleFormatError (file) {
            this.$Notice.warning({
                title: '文件格式错误',
                desc: file.name + ' 格式错误, 请选择jpeg,gif,png或jpg格式的图片'
            });
        },
        upload(){
            if(this.uploadImg){
                this.$refs.upload.post(this.uploadImg);
            }
        },
        // 添加关注按钮禁用
        disableBtn(item){
            item.sign = ""
        }
    }
}
</script>
