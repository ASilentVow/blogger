const util = require('./util');
const app = util.app;
const bodyParser = util.bodyParser;
// 设置MongoDB中间件
const MongoClient = util.MongoClient;
const dbUrl = util.dbUrl;
const session = require("express-session");

// 设置body-parser中间件
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// 设置session
app.use(session({
    secret: 'blogger-session',
    resave: false,
    saveUninitialized: true,
    cookie: {maxage: 24*3600*1000},
    rolling: true
}))

const DO_LOGIN = ()=>{
    app.post('/login',(req,res)=>{
        const data = req.body;
        // 连接数据库
        MongoClient.connect(dbUrl,{useNewUrlParser:true},function(err,client){
            if(err){
                console.log(err);
                return;
            }
            const db = client.db('blogger');
            const collection = db.collection('user');

            collection.find({$or:[{username: data.user, password: data.password},{usernum: data.user, password: data.password}]}).project({username: 1}).toArray((err, docs)=>{
                if(docs[0]){
                    req.session.username = docs[0].username
                    req.session.userId = docs[0]._id
                    let username = req.session.username
                    let userId = docs[0]._id
                    res.send({
                        "status" : 2,
                        "msg" : "登录成功",
                        "username" : username,
                        "userId" : userId
                    });
                }else{
                    res.send({
                        "status" : 0,
                        "msg" : "用户名或密码错误"
                    })
                }
            });
            // 关闭数据库
            client.close();
        });
    });
}

const LOGIN_OUT = ()=>{
    app.post('/loginOut',(req,res)=>{
        req.session.username = ""
        res.send({
            "msg" : "成功退出登录"
        })
    })
}

module.exports = { DO_LOGIN, LOGIN_OUT }