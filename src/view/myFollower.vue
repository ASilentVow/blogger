<template>
    <div id="myFollower">
         <Card class="follow-table">
            <p slot="title">
                <Icon type="md-contacts"></Icon>
                我的粉丝
            </p>
            <!-- 加载动画 -->
            <Row v-show="$store.state.follow_store.loading2">
                <Col class="demo-spin-col">
                    <Spin fix>
                        <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                        <div>Loading</div>
                    </Spin>
                </Col>
            </Row>
            <!-- 关注列表 -->
            <ul class="follow-list" v-show="!$store.state.follow_store.loading2">
                <li class="no-follow" v-if="!$store.state.follow_store.followerList.length">
                    <p>您暂时还没有被任何人关注!</p>
                </li>
                <li class="follow-item" v-for="(item, index) in $store.state.follow_store.followerList" :key="index" v-if="$store.state.follow_store.followerList.length">
                    <div class="item-left">
                        <div class="user-pic">
                            <img v-lazy="'../../static/images/avatar/'+ item.avatar" alt="">
                        </div>
                    </div>
                    <div class="item-middle">
                        <span class="username">{{item.username}}</span>
                        <span class="male" v-if="item.sex === '男'">
                            <Icon type="md-male" size="10"/>
                        </span>
                        <span class="female" v-if="item.sex === '女'">
                            <Icon type="md-female" size="10"/>
                        </span>
                        <p class="sign">{{item.sign}}</p>
                    </div>
                    <div class="item-right">
                        <Dropdown type="primary"  @on-click="clickMenu(item,$event)">
                            <Button type="primary" v-if="item.code == 2">
                                <Icon type="md-add" />
                                添加关注
                            </Button>
                            <Button type="primary" ghost v-if="item.code == 3">
                                <Icon type="md-swap" />
                                互相关注
                            </Button>
                            <DropdownMenu slot="list">
                                <DropdownItem v-if="item.code == 2" name="follow">              
                                    <p style="text-align:center;">
                                        <Icon type="md-add" />
                                        添加关注
                                    </p>
                                </DropdownItem>
                                <DropdownItem name="removeFollower">              
                                    <p style="text-align:center;">
                                        <Icon type="md-remove-circle" />
                                        移除粉丝
                                    </p>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </li>
            </ul>
         </Card>
        <div class="page" style="text-align:center;margin:20px 0 20px 0" v-if="$store.state.follow_store.followerList.length">
            <Page :total="$store.state.user_store.followerNum" :page-size="8" @on-change="change"/>
        </div>
         <!-- 移粉提示框 -->
        <Modal v-model="$store.state.form_store.removeFansModal" width="360" :mask-closable="false">
            <p slot="header">
                <Icon type="ios-information-circle"></Icon>
                <span>移除粉丝</span>
            </p>
            <div style="text-align:center;font-size:14px">
                <p>确定移除该粉丝吗？</p>
            </div>
            <div slot="footer" style="display:flex;justify-content:space-around;">
                <Button type="primary" :loading="$store.state.follow_store.btnLoading" size="large" @click="removeFollower()">确定</Button>
                <Button size="large" @click="$store.dispatch('close_form','removeFansModal')">取消</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
export default {
    data(){
        return{
            removeId: '' // 移除粉丝ID
        }
    },
    mounted() {
        this.$store.dispatch('get_follower_list');
    },
    methods: {
        // 下拉菜单点击
        clickMenu(item,event){
            if(event === 'follow'){
                this.$store.dispatch('follow',item._id);
                item.code = 3;
            }else if(event === 'removeFollower'){
                this.$store.dispatch('open_form','removeFansModal');
                this.removeId = item._id;
            }
        },
        change(page){
            this.$store.dispatch('get_follower_list',page)
        },
        // 执行移粉操作
        removeFollower(){
            this.$store.dispatch('remove_follower',this.removeId)
        }
    }
}
</script>
