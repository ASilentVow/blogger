const util = require('./util');
const app = util.app;
const ObjectId = require('mongodb').ObjectId ;
const bodyParser = util.bodyParser;

const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

// 设置MongoDB中间件
const MongoClient = util.MongoClient;
const dbUrl = util.dbUrl;

// 设置body-parser中间件
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// 获取个人信息
const GET_INFO = ()=>{
    app.post('/getInfo',(req,res)=>{
        const data = req.body
        MongoClient.connect(dbUrl,{useNewUrlParser:true},function(err,client){
            if(err){
                console.log(err);
                return;
            }
            // 指定数据库
            const db = client.db('blogger');
            const collection = db.collection('user');
            let user = {};


            // 微博数量
            let blogNum = new Promise((resolve,reject)=>{
                db.collection('blog').find({userId: data.userId}).count((err,result)=>{
                    if(err){
                        reject();
                    }
                    user.blogNum = result;
                    resolve();
                });
            })
            // 个人信息
            let userInfo = new Promise((resolve,reject)=>{
                collection.find({_id: ObjectId(data.userId)}).project({password: 0, usernum: 0, _id: 0}).toArray((err,docs)=>{
                    if(err){
                        reject();
                    }
                    let followNum = 0;
                    let followerNum = 0;
                    if(docs.length !=0){
                        if(docs[0].followList.length){
                            docs[0].followList.forEach(item=>{
                                if(item.code === 1){
                                    followNum += 1
                                }else if(item.code === 2){
                                    followerNum += 1
                                }else{
                                    followerNum += 1
                                    followNum += 1
                                }
                                return followNum,followerNum;
                            })
                        }
                    }
                    user.userInfo = docs;
                    user.followerNum = followerNum;
                    user.followNum = followNum;
                    resolve();
                })
            })
            
            Promise.all([userInfo,blogNum]).then(()=>{
                res.send({
                    user: user
                })
                client.close();
            })

        })
    })
}

// 修改个人信息
const MOD_INFO = ()=>{
    app.post('/modInfo',(req,res)=>{
        const data = req.body.curUser;
        const username = req.session.username;
        MongoClient.connect(dbUrl,{useNewUrlParser:true},function(err,client){
            if(err){
                console.log(err);
                return;
            }
            // 指定数据库
            const db = client.db('blogger');
            const collection = db.collection('user');

            if(data.name === username){
                collection.updateOne({username: username},{$set:{sign: data.sign,sex: data.sex}},(err,result)=>{
                    if(!err){
                        res.send({
                            status: 1,
                            msg: "更新成功"
                        })
                    }
                })
            }else{
                let result = collection.find({username: data.name});
                result.toArray((err, docs)=>{
                    if(!err){
                        if(docs[0]){
                            res.send({
                                status: 0,
                                msg: "用户名已存在"
                            })
                            client.close();
                        }else{
                            collection.updateOne({username: username},{$set:{username: data.name,sign: data.sign,sex: data.sex}},(err,result)=>{
                                if(!err){
                                    req.session.username = data.name;
                                    res.send({
                                        status: 1         
                                    })
                                }else{
                                    console.log(err)
                                }
                            })
                            
                            db.collection('blog').updateMany({username: username},{$set:{username: data.name}},(err,result)=>{
                                if(err){
                                    console.log(err)
                                }
                            })
                            client.close();
                        }
                    }
                })
            }
        })
    })
} 


module.exports = { GET_INFO, MOD_INFO}