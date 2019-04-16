const util = require('./util');
const app = util.app;
const bodyParser = util.bodyParser;
// 图片转换
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
// 设置MongoDB中间件
const MongoClient = util.MongoClient;
const dbUrl = util.dbUrl;
const ObjectId = require('mongodb').ObjectId 
// 设置body-parser中间件
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const UPLOAD_IMAGE= ()=>{
    app.post('/image',(req,res)=>{
        let userId = req.session.userId;
        let form = new formidable.IncomingForm();
        let targetFile = path.join(__dirname,'../../static/images/avatar');
        form.uploadDir = targetFile;
        form.parse(req,(err,fields,files)=>{
            if(err){
                throw err;
            } 
            let oldpath = files.file.path;
            let pos = files.file.name.lastIndexOf(".");
            let lastName = files.file.name.substring(pos,files.file.name.length);
            let imgName = parseInt(Math.random() * 10) + '_' + Date.parse(new Date())+lastName;
            let newpath = path.join(path.dirname(oldpath),imgName);
            fs.rename(oldpath,newpath,(err)=>{
                if(err){
                    throw err
                }else{
                    MongoClient.connect(dbUrl,{useNewUrlParser:true},function(err,client){
                        if(err){
                            console.log(err);
                            return;
                        }
                        const db = client.db('blogger');
                        const collection = db.collection('user');

                        if(userId){
                            collection.updateOne({_id: ObjectId(userId)},{$set:{avatar: imgName}},(err,result)=>{
                                if(err){
                                    throw err
                                }
                            })

                            db.collection('blog').updateMany({userId: userId},{$set:{avatar: imgName}},(err,result)=>{
                                if(err){
                                    throw err
                                }
                            })
                        }
                    })
                }
            })
        });
    })
}

module.exports = { UPLOAD_IMAGE }
