const express = require('express');
const app = new express();
const bodyParser = require('body-parser');
// 设置MongoDB中间件
const MongoClient = require('mongodb').MongoClient;
const dbUrl = 'mongodb://localhost:27017/blogger';

module.exports={ express, app, bodyParser, MongoClient, dbUrl }