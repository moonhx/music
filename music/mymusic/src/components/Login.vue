<template>
    <div class="login">
        <h1>欢迎登陆<br>My Music</h1>
        <div class="form">
            <mt-field placeholder="请输入用户名" v-model="username"></mt-field>
            <mt-field placeholder="请输入密码" v-model="pwd" type="password"></mt-field>
        </div>
        <mt-button type="primary" size="large" @click="login">登录</mt-button><br>
        <div class="footer">
            <a href="javascript:void(0)" @click = "reg">注册</a>|<a href="#">忘记密码</a>
        </div>
    </div>
</template>
<script>
import { Toast } from 'mint-ui';	
export default {
    data(){
        return {
            username:"",
            pwd:""
        }
    },
    methods:{
        login(){
        	//验证username和pwd
            let username = this.username;
            let pwd = this.pwd;
            let [userreg,pwdreg] =  [/^[0-9a-zA-Z_]{5,20}$/.test(username),/^[0-9a-zA-Z_]{5,11}$/.test(pwd)]
            
            //不通过不发送
            if(userreg && pwdreg){
                //发送数据给后台验证
				this.$http.jsonp("http://localhost:9999/login",{params:{username:username}}).then(res=>{
					if(res.body.status == 1){
						Toast(res.body.msg);
						return ;
					}
                    //验证成功
                    window.localStorage.setItem("userid",res.body[0].user_id);
					window.localStorage.setItem('username', username);
                    window.localStorage.setItem('pwd',pwd);
                    window.localStorage.setItem('nickname',res.body[0].nickname);
                	this.$router.push('home/recommend/music');
				}).catch(err=>{
					console.log(err);
				});
            }else{
            	Toast('用户名或密码错误！');
            }
        },
        reg(){
            this.$router.push('/reg');
        }
    }
}
</script>
<style scoped>
    .login{ padding: 2rem; padding-top:5rem;  text-align: center; }
    h1{color: #66B3FF; font-weight: 100; margin-bottom: 5rem}
    .form{ margin-bottom:5rem; }
    .footer a{ display:inline-block;  margin:0 1.8rem ; height: 1.6rem; text-align: center;
        color: gray
     } 
</style>

