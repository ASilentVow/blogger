const util = require('./util');
const app = util.app;
const bodyParser = util.bodyParser;
// 设置moment.js
const moment = require('moment')
// 设置MongoDB中间件
const ObjectId = require('mongodb').ObjectId //将_id变为对象
const MongoClient = util.MongoClient;
const dbUrl = util.dbUrl;

// 设置body-parser中间件
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// 获取微博列表
const GET_BLOG = ()=>{
    app.post('/getBlog',(req,res)=>{
        const data = req.body;
        MongoClient.connect(dbUrl,{useNewUrlParser:true},function(err,client){
            if(err){
                console.log(err);
                return;
            }
            const db =  client.db('blogger');
            const collection = db.collection('blog');
            collection.find({username: data.username}).sort({_id:-1}).skip(data.pageSize*5).limit(5).toArray((err,docs)=>{
                res.send(docs);
            })
            client.close();
        })
    })
}

// 发布微博
const POST_BLOG = ()=>{
    app.post('/postBlog',(req,res)=>{
        const data = req.body;
        const now = new moment().format('M月D日 HH:mm:ss');
        MongoClient.connect(dbUrl,{useNewUrlParser:true},function(err,client){
            if(err){
                console.log(err);
                return;
            }
            // 指定数据库
            const db = client.db('blogger');
            const collection = db.collection('blog');
            collection.insertOne({content: data.content,postDate: now,userId: data.userId,username: data.username,avatar: data.avatar},(err,result)=>{
                if(!err){
                    res.send({
                        status: 1,
                        msg: "发布成功！"
                    });
                }
            })
            client.close();
        })
    })
}

// 删除微博
const DEL_BLOG = ()=>{
    app.post('/delBlog',(req,res)=>{
        const data = req.body;
        MongoClient.connect(dbUrl,{useNewUrlParser:true},function(err,client){
            if(err){
                console.log(err);
                return;
            }
            const db = client.db('blogger');
            const collection = db.collection('blog');
            // _id为对象，因此要将blogId变为对象
            collection.deleteOne({_id: ObjectId(data.blogId)},(err,result)=>{
                if(!err){
                    res.send({
                        status: 1,
                        msg: "成功删除微博！"
                    })
                }
            });
            client.close();
        })
    })
}

// 获取首页微博列表
const GET_MAIN_BLOG = ()=>{
    app.post('/getMainBlog',(req,res)=>{
        const data = req.body;
        MongoClient.connect(dbUrl,{useNewUrlParser:true},function(err,client){
            if(err){
                console.log(err);
                return;
            }
            const db = client.db('blogger');
            const collection = db.collection('user');
            if(data.userId){
                collection.find({_id: ObjectId(data.userId)}).project({_id: 0, followList: 1}).toArray((err,docs)=>{
                    if(docs.length != 0){
                        let followList = [data.userId];
                        docs[0].followList.forEach(item=>{
                            if(item.code === 1 || item.code === 3){
                                followList.push(item.id.toString());
                            }
                        })
                        db.collection('blog').find({userId:{$in: followList}}).sort({_id: -1}).toArray((err,docs)=>{
                            if(!err){
                                res.send({
                                    status: 1,
                                    mainBlog: docs
                                });
                            }
                        })
                        client.close();
                    }
                })
            }else{
                res.send({
                    status: 0,
                    msg: "暂无更多"
                });
            }
        })
    })
}

module.exports = { GET_BLOG, POST_BLOG, DEL_BLOG, GET_MAIN_BLOG}