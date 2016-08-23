var assert = require("assert");
var SQLStringUtil = require('../../../server/util/SQLStringUtil');

describe('sqlStringUtil unit test', function () {
	describe('testing function: whereSQL', function () {
        it('should return where sql string', function () {
            var sqlStr = SQLStringUtil.whereSQL([{key:'id',opt:'>',value:10},{key:'name',opt:'=',value:'momoko'}]);
            assert.equal(sqlStr, " WHERE id>'10' AND name='momoko'");
        });
    });

	describe('testing function: limitSQL', function () {
		it('should return limit sql string', function () {
			var sqlStr = SQLStringUtil.limitSQL({
				index: 1,
				size: 15
			});
			assert.equal(sqlStr, ' LIMIT 1,15');
		});
	});

	describe('testing function: limitSQL', function () {
		it('should return order by sql string', function () {
			var sort = {
				username: 'DESC',
				'nickname': 'ASC'
			};
			var sqlStr = SQLStringUtil.sortSQL(sort);
			assert.equal(sqlStr, ' ORDER BY username DESC,nickname ASC');
		});
	});

	describe('testing function: likeSQL', function () {
		it('should return like %xxx% sql string', function () {
			var like = {
				username: 'huibin',
				'nickname': 'momoko'
			};
			var sqlStr = SQLStringUtil.likeSQL(like);
			assert.equal(sqlStr, ' (username LIKE "%huibin%" OR nickname LIKE "%momoko%")');
		});
	});

	describe('testing function: inSQL', function () {
		it('should return in sql string', function () {
			var range = {
				id: [1, 2, 3, 4],
				city: ['sh', 'bj']
			};
			var sqlStr = SQLStringUtil.inSQL(range);
			assert.equal(sqlStr, ' (id IN(1,2,3,4) OR city IN(sh,bj))');
		});
	});

	describe('testing function: fuzzyREGEXP', function () {
		it('should return regexp sql string', function () {
			var filter = {
				keywords: ['分页插件', 'pagination', 'jquery'],
				fields: ['title', 'content', 'tags']
			};
			var sqlStr = SQLStringUtil.fuzzyREGEXP(filter);
			assert.equal(sqlStr, ' (CONCAT(title,content,tags) REGEXP "分页插件|pagination|jquery")');
		});
	});
});
