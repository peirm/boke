/**
 * Created by hama on 2016/6/17.
 */

//首先先引入数据库的连接

var mongodb = require('./db');

//接下来我们把对用户操作的数据库行为作为模块写出来

function User(user){
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
};
module.exports = User;

//保存用户的注册信息
User.prototype.save = function(callback){
    var user = {
        name:this.name,
        password:this.password,
        email:this.email
    };
    //通过open方法打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取users集合
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            //将用户数据插入users集合当中去.
            collection.insert(user,{safe:true},function(err,user){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,user[0]);//成功的话返回用户名
            })
        })
    })
}

//读取用户的信息
User.get = function(name,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取users集合
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            //查询用户名(name)的文档
            collection.findOne({name:name},function(err,user){
                if(err){
                    return callback(err);
                }
                callback(null,user);//成功返回查询的用户信息

            })

        })
    })
}