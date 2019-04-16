const util = require('./util');
const app = util.app;
const bodyParser = util.bodyParser;
// 设置MongoDB中间件
const MongoClient = util.MongoClient;
const dbUrl = util.dbUrl;

// 设置body-parser中间件
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


const DO_REG = ()=>{
    app.post('/register',function(req,res){
        const data = req.body;
        // 连接数据库
        MongoClient.connect(dbUrl,{useNewUrlParser:true},function(err,client){
            if(err){
                console.log(err);
                return;
            }
            // 指定数据库
            const db = client.db('blogger');
            const collection = db.collection('user');
            const sign = '这是一个默认签名'
            // 判断用户名或手机号是否存在
            collection.find({$or:[{username: data.user},{usernum: data.usernum}]}).toArray((err, docs)=>{
                if(!err){
                    if(docs[0]){
                        if(docs[0].username === data.user){
                            res.send({
                                "status" : 0,
                                "msg" : "用户名已被注册"
                            });
                        }else if(docs[0].usernum === data.usernum){
                            res.send({
                                "status" : 0,
                                "msg" : "手机号已被注册"
                            });
                        }
                    }else{
                        collection.insertOne({username: data.user, password: data.password, usernum: data.usernum, sex: data.sex, sign: sign, followList:[],avatar: "user.jpg"},(err,result)=>{
                            if(!err){
                                res.send({
                                    "status" : 1,
                                    "msg" : "注册成功"
                                });
                            }
                        });
                    }
                }else{
                    console.log(err);
                    return;
                }
                // 关闭数据库
                client.close();
            });
        });
    });
}

module.exports = { DO_REG }