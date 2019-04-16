<template>
    <div id="myFollow">
         <Card class="follow-table">
            <p slot="title">
                <Icon type="ios-happy" />
                我的关注
            </p>
            <!-- 加载动画 -->
            <Row v-show="$store.state.follow_store.loading">
                <Col class="demo-spin-col">
                    <Spin fix>
                        <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                        <div>Loading</div>
                    </Spin>
                </Col>
            </Row>
            <!-- 关注列表 -->
            <ul class="follow-list" v-show="!$store.state.follow_store.loading">
                <li class="no-follow" v-if="!$store.state.follow_store.followList.length">
                    <p>您暂时还没有关注任何人!</p>
                </li>
                <li class="follow-item" v-for="(item, index) in $store.state.follow_store.followList" :key="index" v-if="$store.state.follow_store.followList.length">
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
                        <Dropdown type="primary" @on-click="clickMenu(item,$event)">
                            <Button type="primary" ghost v-if="item.code == 1">
                                <Icon type="md-checkmark" />
                                已关注
                            </Button>
                            <Button type="primary" ghost v-if="item.code == 3">
                                <Icon type="md-swap" />
                                互相关注
                            </Button>
                            <DropdownMenu slot="list">
                                <DropdownItem name="removeFollow">              
                                    <p style="text-align:center;">
                                        <Icon type="md-remove-circle" />
                                        取消关注
                                    </p>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </li>
            </ul>
         </Card>
        <div class="page" style="text-align:center;margin:20px 0 20px 0" v-if="$store.state.follow_store.followList.length">
            <Page :total="$store.state.user_store.followNum" :page-size="8" @on-change="change"/>
        </div>
        <!-- 取关提示框 -->
        <Modal v-model="$store.state.form_store.removeModal" width="360" :mask-closable="false">
            <p slot="header">
                <Icon type="ios-information-circle"></Icon>
                <span>取消关注</span>
            </p>
            <div style="text-align:center;font-size:14px">
                <p>确定不再关注此人吗？</p>
            </div>
            <div slot="footer" style="display:flex;justify-content:space-around;">
                <Button type="primary" :loading="$store.state.follow_store.btnLoading" size="large" @click="removeFollow()">确定</Button>
                <Button size="large" @click="$store.dispatch('close_form','removeModal')">取消</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
export default {
    data(){
        return{
            removeId: '' // 取关对象ID
        }
    },
    mounted() {
        this.$store.dispatch('get_follow_list');
    },
    methods: {
        change(page){
            this.$store.dispatch('get_follow_list',page)
        },
        // 下拉菜单点击
        clickMenu(item,event){
            if(event === 'removeFollow'){
                this.$store.dispatch('open_form','removeModal');
                this.removeId = item._id;
            }
        },
        // 执行取关操作
        removeFollow(){
            this.$store.dispatch('remove_follow',this.removeId);
        }
    }
}
</script>
