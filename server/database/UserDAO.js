var pool = require('./Pool');
var BaseDAO = require('./BaseDAO');
var logger = require('../util/Logger');
var Promise = require('bluebird');

function UserDAO(){
    var self = this;
    this.getUserInfo = function(username){
        return new Promise(function(resolve,reject){
            self.query(['star_money','pushed_repos'],[{key:'username',opt:'=',value:username}],function(users,err){
                if(err){
                    reject(err);
                }
                else if(users && users.length === 1){
                    resolve(users[0]);
                }else{
                    var user = {'username':username,'star_money':5,'pushed_repos':'','create_time':new Date(),'update_time':new Date()};
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