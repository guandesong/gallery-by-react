var express = require('express');
var router = express.Router();
var fs = require('fs');
var PATH = './public/data/';
/* GET home page. */
router.get('/read', function(req, res, next) {
    var type = req.param('type')||'';
    fs.readFile( PATH + type + '.json',function (err,data) {
        if(err){
            return res.send({
                status : 0,
                info :  '读取文件出现异常'
            });
        }
        var COUNT = 50;
        var obj = [];
        try{
            obj = JSON.parse(data.toString());
        }catch(e) {
            obj = [];
        }
        if(obj.length > COUNT){
            obj = obj.slice(0,COUNT);
        }
        return res.send({
            status : 0,
            data : obj
        });
    });
});
//数据库存储模块
router.get('/write',function (req,res,next) {
    var type = req.param('type')||'';
    var url = req.param('url')||'';
    var title = req.param('title')||'';
    var image = req.param('image')||'';
    if(!type || !url || !title || !image){
        return res.send({
            status :0,
            info:'提交的字段不全'
        });
    }
    var dataJson_url = PATH + type + '.json';
    fs.readFile(dataJson_url,function (err,data) {
        if(err){
            return res.send({
                status: 0,
                info : '读取文件出现异常'
            });
        }
        var arr = JSON.parse(data.toString());
        var obj = {
            img:image,
            url:url,
            title:title,
            id:guid(),
            time:new Date()
        };
        arr.splice(0,0,obj);
        var newData = JSON.stringify(arr);
        //写入数据
        fs.writeFile(dataJson_url,newData,function (err) {
            if(err){
                return res.send({
                   status:0,
                   info:'插入数据失败'
                });
            }
            return res.send({
                status:1,
                data:obj
            });
        })
    })
});
//生成guid
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}
module.exports = router;
