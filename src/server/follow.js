const util = require('./util');
const app = util.app;
const bodyParser = util.bodyParser;
// 设置MongoDB中间件
const MongoClient = util.MongoClient;
const dbUrl = util.dbUrl;
const ObjectId = require('mongodb').ObjectId 
// 设置body-parser中间件
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// 可能关注列表
const MAY_FOLLOW = ()=>{
    app.post('/mayFollow',(req,res)=>{
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
            
            collection.find({_id: ObjectId(data._id)}).project({followList: 1,_id: 0}).toArray((err,docs)=>{
                if(!err){
                    let mayFollowList = [];
                    if(docs.length != 0){
                        if(docs[0].followList){
                            docs[0].followList.forEach(item=>{
                                if(item.code === 1 || item.code === 3){
                                    mayFollowList.push(ObjectId(item.id));
                                }
                            })
                        }
                    }
                    collection.find({$and:[{_id: {$ne: ObjectId(data._id)}},{_id: {$nin: mayFollowList}}]}).project({username:1,sex:1,sign:1,avatar:1}).skip(data.page*3).limit(3).toArray((err, docs)=>{
                        if(!err){
                            res.send(docs);
                            client.close();
                        }else{
                            console.log(err);
                        }
                    })
                }
            })
        })
    })
}

// 添加关注
const FOLLOW = ()=>{
    app.post('/follow',(req,res)=>{
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

            collection.find({"$and": [
                {
                    _id: ObjectId(data._id)
                },
                {
                    followList: {
                        "$elemMatch": {
                            "id": {
                                "$eq": ObjectId(data.id)
                            }
                        }
                    }
                }
            ]}).project({_id: 0,followList: 1}).toArray((err,docs)=>{
                if(!err){
                    if(!docs[0]){
                        // 互无交集，code:1表示只关注对方
                        collection.updateOne({_id: ObjectId(data._id)},{$addToSet:{followList: {id: ObjectId(data.id), code: 1}}},(err,result)=>{
                            if(!err){
                                res.send({
                                    status: 1,
                                    msg: '已关注'
                                })
                            }
                        }) 
                        // code:2表示只有对方关注   
                        collection.updateOne({_id: ObjectId(data.id)},{$addToSet:{followList: {id: ObjectId(data._id), code: 2}}},(err,result)=>{
                            if(err){
                                console.log(err)
                            }
                        })    
                    }else{
                        docs[0].followList.forEach(item=>{
                            if(item.id == data.id){
                                if(item.code === 2){
                                    collection.updateOne({"$and": [
                                        {
                                            _id: ObjectId(data._id)
                                        },
                                        {
                                            followList: {
                                                "$elemMatch": {
                                                     "id": {
                                                        "$eq": ObjectId(data.id)
                                                    }
                                                }
                                            }
                                        }
                                    ]},{$set:{"followList.$.code":3}},(err,result)=>{
                                        if(!err){
                                            res.send({
                                                status: 1,
                                                msg: '已关注'
                                            })
                                            client.close();
                                        }
                                    });

                                    collection.updateOne({"$and": [
                                        {
                                            _id: ObjectId(data.id)
                                        },
                                        {
                                            followList: {
                                                "$elemMatch": {
                                                     "id": {
                                                        "$eq": ObjectId(data._id)
                                                    }
                                                }
                                            }
                                        }
                                    ]},{$set:{"followList.$.code":3}},(err,result)=>{
                                        if(!err){
                                            client.close();
                                        }else{
                                            console.log(err);
                                        }
                                    })
                                }
                            }
                        })
                    }
                }
            })
        })
    })
}

// 获取关注列表
const GET_FOLLOW_LIST = ()=>{
    app.post('/getFollow',(req,res)=>{
        const data = req.body;
        MongoClient.connect(dbUrl,{useNewUrlParser:true},function(err,client){
            if(err){
                console.log(err);
                return;
            }
            const db = client.db('blogger');
            const collection = db.collection('user');
            collection.find({username: data.username}).project({_id:0, followList:1}).toArray((err,docs)=>{
                if(!err){
                    // 关注的_id列表
                    let myFollowList = [];
                    let myEachFollowList = [];
                    docs[0].followList.forEach(item=>{
                        if(item.code === 1){
                            myFollowList.push(ObjectId(item.id));
                        }else if(item.code === 3){
                            myEachFollowList.push(ObjectId(item.id));;
                        }
                    })
                    collection.find({$or:[{_id: {$in: myFollowList}},{_id: {$in: myEachFollowList}}]}).project({username: 1,sex: 1,sign: 1,avatar: 1}).skip(data.pageSize*8).limit(8).toArray((err,docs)=>{ 
                        docs.forEach((item,value)=>{
                            let flag = false;
                            myFollowList.forEach(listItem=>{
                                if(listItem.toString() == item._id.toString()){
                                    flag = true;
                                }
                            })
                            if(flag === true){
                                docs[value].code = 1;
                            }else{
                                docs[value].code = 3;
                            }
                        })
                        res.send({
                            followList: docs
                        });
                        client.close();
                    })

                }
            })
        })
    })
}

// 获取粉丝列表
const GET_FOLLOWER_LIST = ()=>{
    app.post('/getFollower',(req,res)=>{
        const data = req.body;
        MongoClient.connect(dbUrl,{useNewUrlParser:true},function(err,client){
            if(err){
                console.log(err);
                return;
            }
            const db = client.db('blogger');
            const collection = db.collection('user');
            collection.find({username: data.username}).project({_id:0, followList:1}).toArray((err,docs)=>{
                if(!err){
                    // 粉丝的_id列表
                    let myFollowerList = [];
                    // 互相关注列表
                    let myEachFollowList = [];
                    docs[0].followList.forEach(item=>{
                        if(item.code === 2){
                            myFollowerList.push(ObjectId(item.id));
                        }else if(item.code === 3){
                            myEachFollowList.push(ObjectId(item.id));;
                        }
                    })
                    collection.find({$or:[{_id: {$in: myFollowerList}},{_id: {$in: myEachFollowList}}]}).project({username: 1,sex: 1,sign: 1,avatar: 1}).skip(data.pageSize*8).limit(8).toArray((err,docs)=>{ 
                        docs.forEach((item,value)=>{
                            let flag = false;
                            myFollowerList.forEach(listItem=>{
                                if(listItem.toString() == item._id.toString()){
                                    flag = true;
                                }
                            })
                            if(flag === true){
                                docs[value].code = 2;
                            }else{
                                docs[value].code = 3;
                            }
                        })
                        res.send({
                            followerList: docs
                        });
                        client.close();
                    })

                }
            })
        })
    })
}

// 取消关注
const REMOVE_FOLLOW = ()=>{
    app.post('/removeFollow',(req,res)=>{
        const data = req.body;
        MongoClient.connect(dbUrl,{useNewUrlParser:true},function(err,client){
            if(err){
                console.log(err);
                return;
            }
            const db = client.db('blogger');
            const collection = db.collection('user');
            collection.find({username: data.username}).project({followList:1}).toArray((err,docs)=>{
                let _id = docs[0]._id;
                docs[0].followList.forEach(item=>{
                    if(item.id.toString() === data.id){
                        if(item.code === 1){
                            collection.updateOne({_id: ObjectId(_id)},{$pull:{followList: {id: ObjectId(data.id)}}},(err,result)=>{
                                if(!err){
                                    res.send({
                                        status: 1,
                                        msg: "成功取消关注!"
                                    })
                                }
                            })

                            collection.updateOne({_id: ObjectId(data.id)},{$pull:{followList: {id: ObjectId(_id)}}},(err,result)=>{
                                if(!err){
                                    client.close();
                                }
                            })
                        }else if(item.code === 3){
                            // 设置用户取消关注对方
                            collection.updateOne({"$and": [
                                {
                                    _id: ObjectId(_id)
                                },
                                {
                                    followList: {
                                        "$elemMatch": {
                                             "id": {
                                                "$eq": ObjectId(data.id)
                                            }
                                        }
                                    }
                                }
                            ]},{$set:{"followList.$.code":2}},(err,result)=>{
                                if(!err){
                                    res.send({
                                        status: 1,
                                        msg: '成功取消关注!'
                                    })
                                    client.close();
                                }
                            });

                            // 设置对方为只关注用户
                            collection.updateOne({"$and": [
                                {
                                    _id: ObjectId(data.id)
                                },
                                {
                                    followList: {
                                        "$elemMatch": {
                                             "id": {
                                                "$eq": ObjectId(_id)
                                            }
                                        }
                                    }
                                }
                            ]},{$set:{"followList.$.code":1}},(err,result)=>{
                                if(!err){
                                    client.close();
                                }else{
                                    console.log(err);
                                }
                            })
                        }
                    }
                })
            })
        })
    })
}

// 移除粉丝
const REMOVE_FOLLOWER = ()=>{
    app.post('/removeFollower',(req,res)=>{
        const data = req.body;
        MongoClient.connect(dbUrl,{useNewUrlParser:true},function(err,client){
            if(err){
                console.log(err);
                return;
            }
            const db = client.db('blogger');
            const collection = db.collection('user');
            collection.find({username: data.username}).project({followList:1}).toArray((err,docs)=>{
                let _id = docs[0]._id;
                docs[0].followList.forEach(item=>{
                    if(item.id.toString() === data.id){
                        if(item.code === 2){
                            collection.updateOne({_id: ObjectId(_id)},{$pull:{followList: {id: ObjectId(data.id)}}},(err,result)=>{
                                if(!err){
                                    res.send({
                                        status: 1,
                                        msg: "成功移除粉丝!"
                                    })
                                }
                            })

                            collection.updateOne({_id: ObjectId(data.id)},{$pull:{followList: {id: ObjectId(_id)}}},(err,result)=>{
                                if(!err){
                                    client.close();
                                }
                            })
                        }else if(item.code === 3){
                            // 设置用户移除粉丝
                            collection.updateOne({"$and": [
                                {
                                    _id: ObjectId(_id)
                                },
                                {
                                    followList: {
                                        "$elemMatch": {
                                             "id": {
                                                "$eq": ObjectId(data.id)
                                            }
                                        }
                                    }
                                }
                            ]},{$set:{"followList.$.code":1}},(err,result)=>{
                                if(!err){
                                    res.send({
                                        status: 1,
                                        msg: '成功移除粉丝!'
                                    })
                                    client.close();
                                }
                            });

                            // 设置用户为只关注对方
                            collection.updateOne({"$and": [
                                {
                                    _id: ObjectId(data.id)
                                },
                                {
                                    followList: {
                                        "$elemMatch": {
                                             "id": {
                                                "$eq": ObjectId(_id)
                                            }
                                        }
                                    }
                                }
                            ]},{$set:{"followList.$.code":2}},(err,result)=>{
                                if(!err){
                                    client.close();
                                }else{
                                    console.log(err);
                                }
                            })
                        }
                    }
                })
            })
        })
    })
}

module.exports = { MAY_FOLLOW, FOLLOW, GET_FOLLOW_LIST, GET_FOLLOWER_LIST, REMOVE_FOLLOW, REMOVE_FOLLOWER }