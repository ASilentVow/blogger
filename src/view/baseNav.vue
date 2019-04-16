<template>
  <div class="bl-nav">
    <div class="outside">
      <Affix>
          <div class="nav">
            <div class="wrap">
              <div class="nav-left">
                <Menu mode="horizontal" :theme="theme" :active-name="nav" @on-select="changeMenu">
                  <MenuItem key="1" name="home">
                    <Icon type="ios-home" size="20"></Icon>
                    主页
                  </MenuItem>
                  <MenuItem key="2" name="discovery">
                    <Icon type="ios-search" size="20"></Icon>
                    发现
                  </MenuItem>
                  <MenuItem key="3" name="my">
                    <Icon type="md-person" size="20"/>
                    我的
                  </MenuItem>
                </Menu>
                <Button type="primary" class="menuBtn" size="large" style="background-color: #1ea8e3;" @click="menuModal = true">
                    <Icon type="md-menu" />
                </Button>
              </div>
              <div class="bl-logo">
                <img src="../../static/images/logo.gif" style="height: 40px;">
              </div>
              <div class="bl-search">
                <input type="text" name="" placeholder="搜索...">
                <button>
                  <Icon type="ios-search" size="15"></Icon>
                </button>
              </div>
              <div class="bl-user" v-if="!user">
                <div class="bl-login">
                  <span @click="$store.dispatch('open_form','loginModal')">登录</span>
                </div>
                <div class="bl-register">
                  <span @click="$store.dispatch('open_form','regModal')">注册</span>
                </div>
              </div>
              <div class="bl-logined"  v-if='user'>
                <Avatar icon="ios-person" style="background-color: #3e90ca"/>
                <Dropdown trigger="click" @on-click="clickMenu">
                  <a href="javascript:void(0)">
                    <span class="username">{{user}}</span>
                    <Icon type="ios-arrow-down"></Icon>
                  </a>
                  <DropdownMenu slot="list">
                    <DropdownItem name="postBl">
                      <Icon type="md-create" />
                      发布微博
                    </DropdownItem>
                    <DropdownItem name="loginOut">
                      <Icon type="md-exit" />
                      退出登录
                      </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
              <div class="post" v-if='user'>
                <span @click="$store.dispatch('open_form','postModal')">
                  <Icon type="ios-create-outline" size="20"/>
                </span>
              </div>
            </div>
          </div>
      </Affix>
    </div>
    <router-view></router-view>
    <!-- 登录表单 -->
    <Modal v-model="$store.state.form_store.loginModal" title="登录" :mask-closable="false" :loading="loading" @on-ok="handleSubmit('login','logFormInline')"
      ok-text="登录" @on-cancel="clearForm('logFormInline')">
      <Form ref="logFormInline" :model="logFormInline" :rules="logRuleInline">
        <FormItem prop="user">
          <Input type="text" v-model="logFormInline.user" placeholder="用户名/手机号">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input type="password" v-model="logFormInline.password" placeholder="请输入密码">
          <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
      </Form>
    </Modal>
    <!-- 注册表单 -->
    <Modal v-model="$store.state.form_store.regModal" title="注册" :mask-closable="false" ok-text="注册" :loading="loading" @on-ok="handleSubmit('register','regFormInline')"
      @on-cancel="clearForm('regFormInline')">
      <Form ref="regFormInline" :model="regFormInline" :rules="regRuleInline" :label-width="70">
        <FormItem prop="user" label="用户名">
          <Input type="text" v-model="regFormInline.user" placeholder="请输入用户名"></Input>
        </FormItem>
        <FormItem label="性别">
            <RadioGroup v-model="regFormInline.sex">
                <Radio label="男">男</Radio>
                <Radio label="女">女</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem prop="password" label="密码">
          <Input type="password" v-model="regFormInline.password" placeholder="请输入密码"></Input>
        </FormItem>
        <FormItem prop="conPwd" label="确认密码">
          <Input type="password" v-model="regFormInline.conPwd" placeholder="请再次输入密码"></Input>
        </FormItem>
        <FormItem prop="usernum" label="手机号">
          <Input type="text" v-model="regFormInline.usernum" placeholder="请输入手机号"></Input>
        </FormItem>
      </Form>
    </Modal>
    <!-- 发布微博表单 -->
    <Modal class="bl-post" v-model="$store.state.form_store.postModal" :mask-closable="false" title="来分享最近发生的趣事！" @on-ok="" @on-cancel="">
      <Form>
        <FormItem class="inputArea">
            <Input v-model="$store.state.blog_store.blogContent" type="textarea" :autosize="{maxRows: 5,minRows: 5}"></Input>
        </FormItem>
      </Form>
      <div class="contentLen" v-if="$store.state.blog_store.blogContent">已输入{{$store.state.blog_store.blogContent.length}}字</div>
      <div slot='footer' class="clearfix">
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
    </Modal>
    <!-- 小屏导航菜单 -->
    <Drawer title="菜单栏" :closable="false" v-model="menuModal">
      <Menu :theme="theme" :active-name="nav" @on-select="changeMenu">
        <MenuItem key="1" name="home">
          <Icon type="ios-home" size="20"></Icon>
          主页
        </MenuItem>
        <MenuItem key="2" name="discovery">
          <Icon type="ios-search" size="20"></Icon>
          发现
        </MenuItem>
        <MenuItem key="3" name="my">
          <Icon type="md-person" size="20"/>
          我的
        </MenuItem>
      </Menu>
       <Divider></Divider>
      <div class="exit" @click="loginOut" v-show="user">
        <Icon type="md-exit" size="20"/>
        退出登录
      </div>
    </Drawer>
  </div>
</template>

<script>
  import '../assets/less/baseNav.less'
  import emojiPicker from 'vue-emoji-picker'
  import { mapState } from 'vuex'
  export default {
    data() {
      // 密码输入函数
      const validatePass = (rule, value, callback) => {
        if (value !== '') {
          if (this.regFormInline.conPwd !== '') {
            // 对第二个密码框单独验证
            this.$refs.regFormInline.validateField('conPwd');
          }
          callback();
        }
      };
      // 确认密码函数
      const validatePassCheck = (rule, value, callback) => {
        if (value !== this.regFormInline.password) {
          callback(new Error('两次输入的密码不匹配'));
        } else {
          callback();
        }
      };
      return {
        theme: 'primary',
        loading: true,
        menuModal: false,
        // 登录模块数据对象
        logFormInline: {
          user: '',
          password: ''
        },
        // 登录模块验证规则
        logRuleInline: {
          user: [{
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          }]
        },
        // 注册模块数据对象
        regFormInline: {
          user: '',
          password: '',
          conPwd: '',
          usernum: '',
          sex: '男'
        },
        // 注册模块验证规则
        regRuleInline: {
          user: [{
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
          }],
          password: [{
              required: true,
              message: '密码不能为空',
              trigger: 'blur'
            },
            {
              validator: validatePass,
              trigger: 'blur'
            },
            {
              type: 'string',
              min: 6,
              message: '密码不能少于6位',
              trigger: 'blur'
            }
          ],
          conPwd: [{
              required: true,
              message: '请再次输入密码',
              trigger: 'blur'
            },
            {
              validator: validatePassCheck,
              trigger: 'blur'
            }
          ],
          usernum: [{
              required: true,
              message: '手机号不能为空',
              trigger: 'blur'
            },
            {
              type: 'string',
              message: '请输入正确的手机号',
              trigger: 'blur',
              pattern: /^1(3|4|5|7|8)\d{9}$/
            }
          ]
        }
      }
    },
    computed: mapState({
        // 从sessionStorage取值赋给vuex
        user(state){
          let sessionUser = sessionStorage.getItem('username')
          let userId = sessionStorage.getItem('userId')
          if(sessionUser != 'null'){
            this.$store.dispatch('set_user',{username: sessionUser,userId: userId});
          }
          return state.user_store.username
        },
        // 获取当前板块
        nav(){
          let strUrl = window.location.hash
          let arrUrl = strUrl.split("/");
          return arrUrl[1];
        }
      }),
    methods: {
      // 清空表单(name为表单对象名称)
      clearForm(name){
        for (let item in this[name]) {
          if(item === "sex"){
            this[name][item] = "男";
          }else{
            this[name][item] = "";
          }
        }
      },
      // 表单提交
      handleSubmit(url,name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.sendForm(name,url);
          } else {
            this.loading = false;
            // dom更新后执行
            this.$nextTick(() => {
              this.loading = true;
            });
          }
        })
      },
      sendForm(name,url){
        let sendUrl = 'server/'+ url;
        this.axios.post(sendUrl,this[name]).then(res=>{
          if(res.data.status === 0){
            this.$Message.error(res.data.msg);
            this.loading = false;
            this.$nextTick(() => {
              this.loading = true;
            });
          }else if(res.data.status >= 1){
            this.$Notice.success({ 
              title: res.data.msg,
              desc: '',
              duration: 1
            });
            // 清空表单
            this.clearForm(name);
            // 关闭会话框
            this.$store.dispatch('close_form','regModal');
            if(res.data.status === 2){
              this.$store.dispatch('close_form','loginModal');
              this.$store.dispatch('set_user',{username: res.data.username,userId: res.data.userId});
              this.$store.dispatch('get_info');
              this.$store.dispatch('get_main_blog');
              this.$store.dispatch('get_may_follow');
            } 
          }
        }).catch(error=>{
          console.log(error);
          this.loading = false;
          this.$nextTick(() => {
            this.loading = true;
          });
        })
      },
      // 退出登录
      loginOut(){
        this.axios.post('/server/loginOut',{}).then(res=>{
            this.$Notice.success({
              title: res.data.msg,
              desc: '',
              duration: 1
            });
            this.$store.dispatch('login_out');
            this.$store.dispatch('clear_follow_list');
            this.$store.dispatch('get_news');
            this.menuModal = false;
        }).catch(error=>{
          console.log(error);
        })
      },
      // 下拉菜单点击事件
      clickMenu(name){
        if(name === 'loginOut'){
          this.loginOut();
        }else if(name === 'postBl'){
          this.$store.dispatch('open_form','postModal');
        }
      },
      // 导航栏路由跳转
      changeMenu(name){
        window.location.hash = '/'+name;
        this.menuModal = false;
      }
    },
    components: {
      emojiPicker
    }
  }
</script>
