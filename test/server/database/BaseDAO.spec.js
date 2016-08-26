var assert = require("assert");
var BaseDAO = require("../../../server/database/BaseDAO");
describe('baseDAO unit test', function () {
    var baseDAO = new BaseDAO('users');
    var newEntityId = 1;
    var newEntity;
    var now = new Date();
    var mockData = {
        username: 'test username',
        star_money: 5,
        avatar: 'http://www.aa.com/1.jpg',
        create_time: now
    };

    var mockData_update = {
        username: 'update username',
        star_money: 4
    };

   describe('testing function: add', function () {
        it('should return latest id', function (done) {
            baseDAO.add(mockData, function (result) {
                console.log(result);
                if(!isNaN(result.insertId)){
					newEntityId = result.insertId;
					assert.equal(1,1);
				}else{
					assert.equal(1,2);
				}
                done();
            });
        });
    });

    describe('testing function: query', function () {
        it('should return entity by id', function (done) {
            var conditions = [{key:'id',opt:'=',value:newEntityId}];
            baseDAO.query(['*'], conditions, function (result) {
                assert.equal(result.length, 1);
                assert.equal(result[0].id, newEntityId);
                assert.equal(result[0].username, mockData.username);
                newEntity = result[0];
                done();
            });
        });
    });

   describe('testing function: update', function () {
        it('should update entity', function (done) {
            baseDAO.update(newEntityId,mockData_update, function (err, result) {
                var conditions = [{key:'id',opt:'=',value:newEntityId}];
                baseDAO.query(['*'], conditions, function (result) {
                    assert.equal(result.length, 1);
                    assert.equal(result[0].id, newEntityId);
                    assert.equal(result[0].username, mockData_update.username);
                    newEntity = result[0];npm
                    done();
                });
            });
        });
    });
    
    describe('testing function: findOne', function () {
        it('should fine entity by id', function (done) {
            baseDAO.findOne(newEntityId,function(result){
                assert.equal(result.id, newEntityId);
                assert.equal(result.username, mockData_update.username);
                newEntity = result;
                done();
            });
        });
    });
    
    describe('testing function: del', function () {
        it('should delete entity successfully', function (done) {
            baseDAO.del(newEntityId, function (result) {
                var conditions = [{key:'id',opt:'=',value:newEntityId}];
                baseDAO.query(['*'], conditions, function (result2) {
                    assert.equal(result2.length, 0);
                    done();
                })
            });
        });
    });
});