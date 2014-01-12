/*!
 *  Mongo JavaScript Library
 *  bottom implementation of mongo basic operation
 *  Author: Allen Chou
 *  Date: 2014-01-02
 */

$(function(){

    // distinct
    // The distinct operation takes a number of documents that match a query and returns all of the unique
    // values for a field in the matching documents
    // 从下面的JS方法 可以看出distinct的两个参数  第一个是一个字符串, 第二个就是 Query JObject {}
    function distinct (keyString, query) {
        var res = this._distinct(keyString, query);
        if (!res.ok) {
            throw "distinct failed: " + tojson(res);
        }
        return res.values;
    }

    // insert  once a object a time
    function insert (obj, _allow_dot) {
        // if obj is null and does not pass
        if (!obj) {
            throw "no object passed to insert!";
        }
        if (!_allow_dot) {
            this._validateForStorage(obj);
        }
        if (typeof obj._id == "undefined") {
            var tmp = obj;
            obj = {_id:new ObjectId};
            for (var key in tmp) {
                obj[key] = tmp[key];
            }
        }
        this._mongo.insert(this._fullName, obj);
        this._lastID = obj._id;
    }
    // group invocation
    db.records.group( {
        key: { a: 1 },
        cond: { a: { $lt: 3 } },
        reduce: function(cur, result) { result.count += cur.count },
        initial: { count: 0 }
    } )

})