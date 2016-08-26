var pool = require('./Pool');
var BaseDAO = require('./BaseDAO');
var logger = require('../util/Logger');
var Promise = require('bluebird');

function UserDAO(){
    var self = this;
    this.getUserInfo = function(userVM){
        return new Promise(function(resolve,reject){
            self.query(['*'],[{key:'username',opt:'=',value:userVM.name}],function(users,err){
                if(err){
                    reject(err);
                }
                else if(users && users.length === 1){
                    resolve(users[0]);
                }else{
                    var user = {'username':userVM.name,'star_money':5,'avatar':userVM.avatar_url,'create_time':new Date()};
                    self.add(user,function(result,err){
                        if(err){
                            reject(err);
                        }else if(result){
                            var newId = result.insertId;
                            self.findOne(newId,function(result,err){
                                resolve(result);
                            })
                        }
                    });
                }
            });
        });
    }
}

UserDAO.prototype = new BaseDAO('users');
UserDAO.prototype.constructor = UserDAO;

var userDAO = new UserDAO();

module.exports = userDAO;