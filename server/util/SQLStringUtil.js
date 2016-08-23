/**
 *@@description 工具类SQLStringUtil,提供基本的SQL语句瓶装
 */
function SQLStringUtil() {

}
/**
 * @description 生成where语句,用AND风格
 * @param   {Object} e.g. [{key:'id',opt:'>',value:10},{key:'name',opt:'=',value='momoko'}]
 * @returns {String} e.g. ' WHERE id>10 AND name=momoko'
 */
SQLStringUtil.whereSQL = function(conditions){
	var temArr = [];
	if(conditions){
		for(var i=0;i<conditions.length;i++){
			var condition = conditions[i];
			var expression = condition.key + condition.opt + "'"+condition.value+"'";
			temArr.push(expression);
		}
	}
	if(temArr.length > 0){
		return ' WHERE ' + temArr.join(' AND ');
	}
	return '';
}

/**
 * @description 生成limit语句
 * @param   {Object} e.g. {index:0,size:10}
 * @returns {String} e.g. ' LIMIT 0,15'
 */
SQLStringUtil.limitSQL = function (page) {
	if (page) {
		return ' LIMIT ' + page.index + ',' + page.size;
	}
	return '';
};
/**
 * @description 生成ORDER BY语句
 * @param   {Object} sorts e.g. {username:'desc','nickname':'asc'}
 * @returns {String}   e.g. ' ORDER BY username desc,nickname asc'
 */
SQLStringUtil.sortSQL = function (sorts) {
	var temArr = [];
	for (var key in sorts) {
		temArr.push(key + ' ' + sorts[key]);
	}
	if (temArr.length > 0) {
		return ' ORDER BY ' + temArr.join(',');
	}
	return '';
};
/**
 * @description 生成LIKE语句
 * @param   {Object} keywords e.g. {username:'huibin','nickname':'momoko'};
 * @returns {String}   e.g. ' (username LIKE "%huibin%" OR nickname LIKE "%momoko%")'
 */
SQLStringUtil.likeSQL = function (keywords) {
	var temArr = [];
	for (var key in keywords) {
		temArr.push(key + ' LIKE "%' + keywords[key] + '%"');
	}
	if (temArr.length > 0) {
		return ' (' + temArr.join(' OR ') + ')';
	}
	return '';
};
/**
 * @description 生成IN语句
 * @param   {Object} rangs e.g. {id:[1,2,3,4],city:['sh','bj']}
 * @returns {String}   e.g. ' (id IN(1,2,3,4) OR city IN(sh,bj))'
 */
SQLStringUtil.inSQL = function (rangs) {
	var temArr = [];
	for (var key in rangs) {
		temArr.push(key + ' IN(' + rangs[key].join(',') + ')');
	}
	if (temArr.length > 0) {
		return ' (' + temArr.join(' OR ') + ')';
	}
	return '';
};
/**
 * @description 生成模糊查询条件
 * @param   {Object} filter e.g. {keywords:['分页插件','pagination','jquery'],fields:['title','content','tags']}
 * @returns {String} e.g. ' (CONCAT(title,content,tags) REGEXP "分页插件|pagination|jquery")'
 */
SQLStringUtil.fuzzyREGEXP = function (filter) {
	if (filter && filter.keywords && filter.fields) {
		var concatStr = 'CONCAT(' + filter.fields.join(',') + ')';
		var regexpStr = ' REGEXP "' + filter.keywords.join('|') + '"';
		return ' ('+ concatStr + regexpStr +')';
	}
	return '';
};
module.exports = SQLStringUtil;
