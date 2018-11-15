const express = require("express");
const app = express();
app.use(express.static("public"));

//引入模块
const mysql = require("mysql");

//与数据库建立通道
const conn = mysql.createConnection({
	host:"localhost",
	user:"root",
	password:"root",
	database:"mymusic"
});
const multer = require("multer");
//解析post数据的模块
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//连接数据库
conn.connect();
const server = app.listen(9999,function(){
	var ip = server.address().address;
	var port  = server.address().port;
	console.log("服务启动成功！http://%s:%s",ip,port);
});
//约定返回一个json的数据类型
let result = {status:0,msg:"",mydata:[]};
//登录查询
app.get("/login",function(req,res){
	let callback = req.query.callback;
	let insertValues = [];
	insertValues.push(req.query.username);
	let selcetsql = "select * from user where username = ?";
	//请求数据库
	conn.query(selcetsql,insertValues,function(err,data){
		if(err){
			console.log(err)
		}
		if(data.length == 0){
			result.status = 1;
			result.msg = "查询不到用户啊！";
			let json = JSON.stringify(result);
			res.type('text/javascript');
			let msg = callback+'('+json+');';
			res.send(msg);
			return ;
		}
	    let json = JSON.stringify(data);
		res.type('text/javascript');
		let msg = callback+'('+json+');';
		res.send(msg);
	});
});
//注册
app.get("/reg",function(req,res){
	let callback = req.query.callback;
	
	let insertValues = [];
	insertValues.push(req.query.username);
	let selcetsql = "select * from user where username = ?";
	//请求数据库
	conn.query(selcetsql,insertValues,function(err,data){
		if(err){
			console.log(err)
		}
		if(data.length == 0){
			//可以注册
			let insertValues = [req.query.username,req.query.pwd,req.query.nickname];
			let insert_sql = "insert into user(username,pwd,nickname) values(?,?,?)";
			//请求数据库
			conn.query(insert_sql,insertValues,function(err,data){
				if(err){
					console.log(err);
				}
				//成功
				result.status = 0;
				result.msg = "注册成功！";
			    let json = JSON.stringify(result);
				res.type('text/javascript');
				let msg = callback+'('+json+');';
				res.send(msg);
			});
		}else{
			//注册失败，，账号已存在
			result.status = 1;
			result.msg = "账号已经存在";
		    let json = JSON.stringify(result);
			res.type('text/javascript');
			let msg = callback+'('+json+');';
			res.send(msg);
		}
	})
});
//个人信息查询
app.get("/group",function(req,res){
	let callback = req.query.callback;
	let insertValues = [req.query.username];
	let select_sql = "select user_id from user where username = ?";
	//请求数据库
	conn.query(select_sql,insertValues,function(err,data){
		if(err){
			console.log(err);
		}
		//成功
		let insertValues2 = [data[0].user_id];
		
		//根据user_id查看用户的歌单
		let select_sql2 = "select * from mgroup where user_id = ?"
		conn.query(select_sql2,insertValues2,function(err,data){
			if(err){
				console.log(err);
			}
			if(data.length == 0){
				result.mydata = data;
				result.status = 2;
				result.msg = "该用户还没有歌单！";
			    let json = JSON.stringify(result);
				res.type('text/javascript');
				let msg = callback+'('+json+');';
				res.send(msg);
				return ;
			}
			//成功
			result.user_id = data[0].user_id;
			result.mydata = data;
			result.status = 0;
			result.msg = "ok！";
		    let json = JSON.stringify(result);
			res.type('text/javascript');
			let msg = callback+'('+json+');';
			res.send(msg);
		});
	});
});

//根据用户id查询歌单中的所有音乐
app.get("/songlist",function(req,res){
	let callback = req.query.callback;
	let insertValues = [req.query.userid];
	let select_sql = "select * from songlist where user_id = ?";
	//请求数据库
	conn.query(select_sql,insertValues,function(err,data){
		if(err){
			console.log(err);
		}
		//成功
		result.mydata = data;
		result.status = 0;
		result.msg = "ok！";
	    let json = JSON.stringify(result);
		res.type('text/javascript');
		let msg = callback+'('+json+');';
		res.send(msg);
	});
});

//插入到歌单userid,songid,songname,author,name
app.get("/addsong",function(req,res){
	let callback = req.query.callback;
	//检查歌单有么有这首歌
	let sel_sql = "select * from songlist where user_id = ? and name= ? and song_id = ?";
	let sel_val = [req.query.userid,req.query.name,req.query.songid];
	conn.query(sel_sql,sel_val,function(err,data){
		if(err){
			console.log(err);
		}
		if(data.length == 0){
			//歌曲可以插入
			let insertValues = [
				req.query.userid,
				req.query.songid,
				req.query.name,
				req.query.songname,
				req.query.author
			];
			let insert_sql = "insert into songlist(user_id,song_id,name,songname,author) values(?,?,?,?,?)";
			//请求数据库
			conn.query(insert_sql,insertValues,function(err,data){
				if(err){
					console.log(err);
				}
				//插入成功
				result.mydata = data;
				result.status = 0;
				result.msg = "ok！";
			    let json = JSON.stringify(result);
				res.type('text/javascript');
				let msg = callback+'('+json+');';
				res.send(msg);
			})
		}else{
			//已经有这首歌了
			result.mydata = data;
			result.status = 1;
			result.msg = "您的歌单已经有这首歌曲了！";
		    let json = JSON.stringify(result);
			res.type('text/javascript');
			let msg = callback+'('+json+');';
			res.send(msg);
		}
	})
	
});

//插入历史记录 userid,songid,songname,author
app.get("/inserthistory",function(req,res){
	let callback = req.query.callback;
	
	//先看有没有history 的歌单
	let his_sql = "select * from mgroup where user_id = ? and type='history'";
	let hisValues = [req.query.userid];
	conn.query(his_sql,hisValues,function(err,data){
		if(err){
			console.log(err);
		}
		//如果没有history歌单，先创建一个
		if(data.length==0){
			let insertValues = [req.query.userid,'history'];
			let insert_sql = "insert into mgroup(user_id,type) values(?,?)";
			conn.query(insert_sql,insertValues,function(err,data){
				if(err){
					console.log(err);
				}
				//插入到歌曲可以插入
				let insertValues = [
					req.query.userid,
					req.query.songid,
					'history',
					req.query.songname,
					req.query.author
				];
				let insert_sql = "insert into songlist(user_id,song_id,name,songname,author) values(?,?,?,?,?)";
				//请求数据库
				conn.query(insert_sql,insertValues,function(err,data){
					if(err){
						console.log(err);
					}
					//顺便查询一下历史的记录歌曲
					let his_sql = "select * from songlist where user_id = ? and name='history'";
					let hisinsertValues = [req.query.userid];
					conn.query(his_sql,hisinsertValues,function(err,data){
						if(err){
							console.log(err);
						}
						//成功
						result.mydata = data;
						result.status = 0;
						result.msg = "ok！";
					    let json = JSON.stringify(result);
						res.type('text/javascript');
						let msg = callback+'('+json+');';
						res.send(msg);
					});
				});
			})
		}else{
			//有历史歌单
			//插入到歌曲
			let selectValues = [req.query.songid];
			//插入之前查询一下看有没有重复
			let select_sql = "select * from songlist where song_id = ? and name = 'history'"
			conn.query(select_sql,selectValues,function(err,data){
				if(err){
					console.log(err);
					return ;
				}
				//没有重复的，可以插入
				if(data.length==0){
					let insertValues = [
						req.query.userid,
						req.query.songid,
						'history',
						req.query.songname,
						req.query.author
					];
					let insert_sql = "insert into songlist(user_id,song_id,name,songname,author) values(?,?,?,?,?)";
					//请求数据库
					conn.query(insert_sql,insertValues,function(err,data){
						if(err){
							console.log(err);
						}
						//顺便查询一下历史的记录歌曲
						let his_sql = "select * from songlist where user_id = ? and name='history'";
						let hisinsertValues = [req.query.userid];
						conn.query(his_sql,hisinsertValues,function(err,data){
							if(err){
								console.log(err);
							}
							//成功
							result.mydata = data;
							result.status = 0;
							result.msg = "ok！";
						    let json = JSON.stringify(result);
							res.type('text/javascript');
							let msg = callback+'('+json+');';
							res.send(msg);
						});
					});
				}else{
					//有相同的歌曲别插 不影响
					//查询一下历史的记录歌曲
					let his_sql = "select * from songlist where user_id = ? and name='history'";
					let hisinsertValues = [req.query.userid];
					conn.query(his_sql,hisinsertValues,function(err,data){
						if(err){
							console.log(err);
						}
						//成功
						result.mydata = data;
						result.status = 0;
						result.msg = "ok！";
					    let json = JSON.stringify(result);
						res.type('text/javascript');
						let msg = callback+'('+json+');';
						res.send(msg);
					});	
				}
			});
		}
	});
});
//给某个用户添加歌单
app.get("/addlist",function(req,res){
	let callback = req.query.callback;
	let insertValues = [
		req.query.userid,
		req.query.type
	];
	let insert_sql = "insert into mgroup(user_id,type) values(?,?)";
	//请求数据库
	conn.query(insert_sql,insertValues,function(err,data){
		if(err){
			console.log(err);
		}
		//成功
		result.mydata = data;
		result.status = 0;
		result.msg = "ok！";
	    let json = JSON.stringify(result);
		res.type('text/javascript');
		let msg = callback+'('+json+');';
		res.send(msg);
	});
});
//给用户的歌单中添加音乐


//根据用户id 和 type->name查询歌单中的所有音乐
app.get("/selectlist",function(req,res){
	let callback = req.query.callback;
	let selectValues = [req.query.userid,req.query.type];
	let select_sql = "select * from songlist where user_id = ? and name =?";
	//请求数据库
	conn.query(select_sql,selectValues,function(err,data){
		if(err){
			console.log(err);
		}
		//成功
		result.mydata = data;
		result.status = 0;
		result.msg = "ok！";
	    let json = JSON.stringify(result);
		res.type('text/javascript');
		let msg = callback+'('+json+');';
		res.send(msg);
	});
});


//删除表中的数据
app.get("/del",function(req,res){
	let callback = req.query.callback;
	let deleteValues = [req.query.userid,req.query.type,req.query.songid];
	let delete_sql = "delete from songlist where user_id = ? and name = ? and song_id = ?";
	//请求数据库
	conn.query(delete_sql,deleteValues,function(err,data){
		if(err){
			console.log(err);
		}
		//成功
		result.mydata = data;
		result.status = 0;
		result.msg = "ok！";
	    let json = JSON.stringify(result);
		res.type('text/javascript');
		let msg = callback+'('+json+');';
		res.send(msg);
	});
});

//删除歌单
app.get("/dellist",function(req,res){
	let callback = req.query.callback;
	let deleteValues = [req.query.userid,req.query.type];
	let delete_sql = "delete from songlist where user_id = ? and name = ?";
	//先删除songlist的数据
	conn.query(delete_sql,deleteValues,function(err,data){
		if(err){
			console.log(err);
		}
		//成功后删除歌单数据
		let del_sql = "delete from mgroup where user_id = ? and type = ?"
		conn.query(del_sql,deleteValues,function(err,data){
			if(err){
				console.log(err);
			}
			//删除成功
			result.mydata = data;
			result.status = 0;
			result.msg = "ok！";
		    let json = JSON.stringify(result);
			res.type('text/javascript');
			let msg = callback+'('+json+');';
			res.send(msg);
		});
	});
});
//删除歌单2
app.get("/delgroup",function(req,res){
	let callback = req.query.callback;
	let deleteValues = [req.query.userid,req.query.type];
	//成功后删除歌单数据
	let del_sql = "delete from mgroup where user_id = ? and type = ?"
	conn.query(del_sql,deleteValues,function(err,data){
		if(err){
			console.log(err);
		}
		//删除成功
		result.mydata = data;
		result.status = 0;
		result.msg = "ok！";
	    let json = JSON.stringify(result);
		res.type('text/javascript');
		let msg = callback+'('+json+');';
		res.send(msg);
	});
});

app.get("/",function(req,res){
	res.send("我啥都没有");
});


