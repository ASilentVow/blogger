const util = require('./util');
const registerModule = require('./register');
const loginModule = require('./login');
const blogModule = require('./blog.js');
const infoModule = require('./info.js');
const followModule = require('./follow.js');
const uploadModule = require('./image.js')
const app = util.app; 

// 注册
registerModule.DO_REG();

// 登录
loginModule.DO_LOGIN();

// 注销
loginModule.LOGIN_OUT();

// 发布微博
blogModule.POST_BLOG();

// 获取微博列表
blogModule.GET_BLOG();

// 删除微博
blogModule.DEL_BLOG();

// 获取首页微博列表
blogModule.GET_MAIN_BLOG();

// 获取用户信息
infoModule.GET_INFO();

// 更新用户信息
infoModule.MOD_INFO();

// 获取可能关注列表
followModule.MAY_FOLLOW();

// 加关注
followModule.FOLLOW();

// 获取关注列表
followModule.GET_FOLLOW_LIST();

// 获取粉丝列表
followModule.GET_FOLLOWER_LIST();

// 取消关注
followModule.REMOVE_FOLLOW();

// 移除粉丝
followModule.REMOVE_FOLLOWER();

uploadModule.UPLOAD_IMAGE();

app.listen(3000,'127.0.0.1');