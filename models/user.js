var mongodb = require('./db');

function User(user) {
	this.name = user.name;
	this.password = user.password;
	this.email = user.email;
};

module.exports = User;

// 存储用户信息
User.prototype.save = function(callback) {
	// 要存入数据库的用户文档
	var user = {
		name: this.name,
		password: this.password,
		email: this.email
	};

	// 打开数据库
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		// 读取 users 集合
		db.collection('users', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			// 将用户数据插入 users 集合
			collection.insert(user, {
				safe: true
			}, function(err, user) {
				mongodb.close();
				if (err) {
					return callback(err);
				}
				callback(null, user[0]);
			});
		});
	});
};

User.get = function(name, callback) {
	// 打开数据库
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		// 读取 users 集合
		db.collection('users', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			// 查找用户名为 name 的一个文档
			collection.findOne({
				name: name
			}, function(err, user) {
				mongodb.close();
				if (err) {
					return callback(err);
				}
				callback(null, user);
			});
		});
	});
};