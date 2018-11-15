<template>
    <div class="reg">
        <mt-header title="欢迎注册">
            <router-link to="/" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
        </mt-header>
        <div class="content">
            <h1>欢迎进入My Music</h1>
            <div class="form">
                <mt-field placeholder="手机号 / 邮箱" v-model="username"></mt-field>
                <mt-field placeholder="密码（最少5位）" v-model="pwd" type="password"></mt-field>
                <mt-field placeholder="昵称" v-model="nickname" type="text"></mt-field>
            </div>
            <mt-button type="primary" size="large" @click="reg">注册</mt-button>
            <div class="footer">
                <a href="javascript:void(0)">My Music 欢迎您</a>
            </div>
        </div>
    </div>
</template>
<script>
import { Toast } from 'mint-ui';
export default {
    data(){
        return {
            username:"",
            pwd:"",
            nickname:""    
        }
    },
    methods:{
        reg(){
        	//验证手机号邮箱和pwd
            let usernamereg = testusername(this.username);
            let pwd = this.pwd;
            let [userreg,pwdreg] =  [usernamereg,/^[0-9a-zA-Z_]{5,11}$/.test(pwd)]
            //不通过不发送
            if(userreg && pwdreg){
                //发送数据给后台验证
                let params = {username:this.username,pwd:this.pwd,nickname:this.nickname}
				this.$http.jsonp("http://localhost:9999/reg",{params:params}).then(res=>{
					if(res.body.status == 1){
					}else{
                        //验证成功
                        setTimeout(()=>{
                            this.$router.push('/login');
                        },1000);
                    }
                	Toast(res.body.msg);
				}).catch(err=>{
					console.log(err);
				});
            }else{
            	Toast('格式错误！');
            }
            function testusername(username){
            	let phone = /^1[0-9]{10}$/
        		let email = /^[0-9a-zA-Z_]{1,10}@[0-9a-zA-Z_]{1,4}\.(com|cn)$/;
            	return phone.test(username) || email.test(username);
            }
        }
    }
}
</script>

<style scoped>
    .reg{ text-align: center;}
    .content{ padding: 20px}
    h1{ color: #66B3FF; font-weight: 100; margin-bottom: 5rem; padding: 2rem 0;}
    .form{ margin-bottom: 1rem; }
    .footer{ text-align: right}
    .footer a{ display:inline-block;height: 2rem; color: gray;font-size: 0.5rem;line-height: 2rem}
    
</style>

