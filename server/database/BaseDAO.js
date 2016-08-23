/**
* @author momoko8443
* @description BaseDAO 提供最基础的增删改查的数据操作
*/
var pool = require('./Pool');
var SQLStringUtil = require('../util/SQLStringUtil');
var logger = require('../util/Logger');
/**
 * @function BaseDAO
 * @param   {String} tableName 数据库表名
 */
function BaseDAO(tableName) {
	if(tableName){
		this.table = tableName;
	}else{
		throw new Error("tableName is necessary");
	}

    var self = this;
    //values: Object e.g. {username:'huibin',sex:'male'}
    /**
     * @description insert an Entity
     * @param {Object} e.g.   {username:'huibin',sex:'male'}
     * @param {Function} callback 回调函数 返回参数类型 Number
     */
    this.add = function (values, callback) {
        var sql = 'INSERT INTO ?? SET ?';
        pool.getConnection(function (err, connection) {
            var query = connection.query(sql, [self.table, values], function (err, rows) {
                self.dealWithCallback(err, rows, true, connection, query,function () {
                    callback&&callback(rows,err);
                });
            });
        });
    };
    /**
     * @description 物理删除一条Entity
     * @param {Number} id       Entity id
     * @param {Function} callback 无返回值
     */
    this.del = function (id, callback) {
        var sql = 'DELETE FROM ?? WHERE id=?';
        pool.getConnection(function (err, connection) {
            var query = connection.query(sql, [self.table, id], function (err, rows) {
                self.dealWithCallback(err, rows, true, connection,query,callback);
            });
        });
    };

    /**
     * @description update an Entity
     * @param {Number} id       Entity id
     * @param {Object} values   e.g. {username:'huibin',sex:'male'}
     * @param {Function} callback 无返回值
     */
    this.update = function (id, values, callback) {
        var sql = 'UPDATE ?? SET ? WHERE id=?';
        pool.getConnection(function (err, connection) {
            var query = connection.query(sql, [self.table,values,id], function (err, rows) {
                self.dealWithCallback(err, rows, true, connection,query,callback);
            });
        });
    };

    //columns:Array e.g. ['username','nickname'] or ['*']
    //conditions:Array e.g. [{key:'id',opt:'=',value:1},{key:'sex',opt:'=',value:'female'}]
    /**
     * @description 简单动态查询
     * @param   {Array}    columns    显示的字段 e.g. ['username','nickname'] or ['*']
     * @param   {Array} conditions 查询条件 e.g. [{key:'id',opt:'=',value:1},{key:'sex',opt:'=',value:'female'}]
     * @param   {Function} callback   回调函数 返回参数类型 Array
     */
    this.query = function (columns, conditions,callback) {
        var sql = "SELECT $columns FROM ?? $conditions";
        pool.getConnection(function (err, connection) {
            sql = sql.replace(/\$columns/g, function(txt){
                return columns.join(',');
            });
            sql = sql.replace(/\$conditions/g,function(txt){
                return SQLStringUtil.whereSQL(conditions);
            });
            var query = connection.query(sql, [self.table], function (err, rows) {
                self.dealWithCallback(err, rows, true, connection,query,callback);
            });
        });
    };
    //columns:Array e.g. ['username','nickname'] or ['*']
    //conditions:Array e.g. [{key:'id',opt:'=',value:1},{key:'sex',opt:'=',value:'female'}]
    /**
     * @description 简单动态查询
     * @param   {Array}    columns    显示的字段 e.g. ['username','nickname'] or ['*']
     * @param   {Array} conditions 查询条件 e.g. [{key:'id',opt:'=',?},{key:'sex',opt:'=',value:?}]
     * @param   {Function} callback   回调函数 返回参数类型 Array
     */
    this.queryParams = function (columns,conditions,callback) {
        var sql = "SELECT $columns FROM ?? WHERE $conditions";
        pool.getConnection(function (err, connection) {
            sql = sql.replace(/\$columns/g, function(txt){
                return columns.join(',');
            });
            var params=[];
                sql = sql.replace(/\$conditions/g,function(txt){
                    if(Object.prototype.toString.call(conditions)=="[object Array]"){
                        var temArr = [];
                        for(var i=0;i<conditions.length;i++){
                            var condition = conditions[i];
                            var expression = condition.key + condition.opt + "?";
                            temArr.push(expression);
                            params.push(condition.value);
                        }
                        return temArr.join(' and ');
                    }else{//默认为完整的字符串条件  id=1 or time=1 limited 1,3 为特殊处理
                        return conditions;
                    }
                });
            var query = connection.query(sql, [self.table,params], function (err, rows) {
                self.dealWithCallback(err, rows, true, connection,query,callback);
            });
        });
    };
    /**
     * @description 根据id查询一条记录
     * @param {Number} id       Entity id
     * @param {Function} callback 回调函数 返回参数类型 Object
     */
    this.findOne = function(id, callback){
         this.query(['*'],[{key:'id',opt:'=',value:id}],function(result,err){
			 var item;
			 if(result && result.length === 1){
				 item = result[0];
			 }
			 callback&&callback(item,err);
		 });
    };
    /**
     * @description 执行sql语句
     * @param {String} sql      sql语句
     * @param {Function} 回调函数 返回参数类型 Array
     */
    this.executeSQL = function(sql,callback){
        pool.getConnection(function (err, connection) {
            var query = connection.query(sql, null, function (err, rows) {
                self.dealWithCallback(err, rows, true, connection,query,callback);
            });
        });
    };

    /**
     * @description 执行sql语句
     * @param {String} sql      sql语句
     * @param {Array} params      参数
     * @param {Function} 回调函数 返回参数类型 Array
     */
    this.executeParamsSQL = function(sql,params,callback){
        pool.getConnection(function (err, connection) {
            var query = connection.query(sql, null||params, function (err, rows) {
                self.dealWithCallback(err, rows, true, connection,query,callback);
            });
        });
    };
    //columns:Array e.g. ['username','nickname'] or ['*']
    //conditions:Array e.g. [{key:'id',opt:'=',value:1},{key:'sex',opt:'=',value:'female'}]
    /**
     * @description 多表查询带参数
     * @param   {String}    sql 查询sql
     * @param   {Array}    columns    显示的字段 e.g. ['username','nickname'] or ['*']
     * @param   {Array} conditions 查询条件 e.g. [{key:'id',opt:'=',?},{key:'sex',opt:'=',value:?}]
     * @param   {Function} callback   回调函数 返回参数类型 Array
     */
    this.executeSQLParams = function (sql,columns,conditions,callback) {
        pool.getConnection(function (err, connection) {
            sql = sql.replace(/\$columns/g, function(txt){
                return columns.join(',');
            });
            var params=[];
                sql = sql.replace(/\$conditions/g,function(txt){
                    if(Object.prototype.toString.call(conditions)=="[object Array]"){
                        var temArr = [];
                        for(var i=0;i<conditions.length;i++){
                            var condition = conditions[i];
                            var expression = condition.key + condition.opt + "?";
                            temArr.push(expression);
                            params.push(condition.value);
                        }
                        return temArr.join(' and ');
                    }else{//默认为完整的字符串条件  id=1 or time=1 limited 1,3 为特殊处理
                        return conditions;
                    }
                });
            var query = connection.query(sql,params, function (err, rows) {
                self.dealWithCallback(err, rows, true, connection,query,callback);
            });
        });
    };
    /**
     * @description 对数据库操作日志，报错，关闭连接等做统一处理
     * @param {Object}  err    错误对象
     * @param {Array} rows       查询结果对象
     * @param {Booleane    是否关闭数据库连接
     * @param {Object} connection 数据库连接实例
     * @param {Object}   query      查询实例
     * @param {Function} callback   回调函数
     */
    this.dealWithCallback = function(err, rows, release, connection, query,callback) {
        errorHandler(err);
        printResult(rows);
        callback && callback(rows,err);
        releaseConnection(release, connection);
        logger.debug(query.sql);
        function releaseConnection(release, connection) {
            logger.debug("release="+release+",connection="+connection);
            if (release) {
                connection.release();
            }
        }
        function errorHandler(err) {
            if (err) {
                logger.error(self.table + ' DAO >>>>>>>>>' + err);
            }
        }
        function printResult(rows) {
            if (rows) {
                logger.debug(self.table + ' DAO >>>>>>>>>' + JSON.stringify(rows));
            }
        }
    }
}
module.exports = BaseDAO;
