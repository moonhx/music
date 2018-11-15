<template>
    <div class="songlist" @click = "bshow = false">
        <div class="left">
            <img :src="pic_big" alt="">
        </div>
        <div class="con">
            <h3>{{name}}</h3>
            <ul>
                <li>歌手：{{author}}</li>
                <li>专辑名：{{album_title}}</li>
                <li>出版公司：{{si_proxycompany}}</li>
            </ul>
        </div>
        <div class="right">
            <span @click.stop = "bshow = !bshow">添加到..</span>
            <p>{{weight | toW}}人听过</p>
            <button @click = "play">播放</button>
            <ul v-show = "bshow">
                <li v-for="(val,index) in arrgroup" :key="index" @click="add(val.type)">{{val.type}}</li>
                <li v-show = "arrgroup.length == 0">没有添加音乐的歌单！</li>
            </ul>
        </div>
    </div>
</template>
<script>
import { Toast } from 'mint-ui';
export default {
    props:["id","name","author","album_title","si_proxycompany","pic_big","pic_small","si_proxycompany","url","weight"],
    methods:{
        play(){
            this.$router.push(`/playmusic/${this.id}/0`);
        },
        add(type){
            //参数：userid,songid,songname,author,name
            let userid = this.userid;
            let songid = this.id;
            let songname = this.name;
            let author = this.author;
            let name = type;
            let params = {userid,songid,songname,author,name};
            //发送请求
            this.$http.jsonp("http://localhost:9999/addsong",{params:params}).then(res=>{
                Toast({
                    message:res.body.msg,
                    iconClass: 'icon icon-success'
                });
                this.bshow = false;
            }).catch(err=>{
                console.log(err);
            });
        }
    },
    data(){
        return {
            username:"",
            userid:"",
            arrgroup:[],
            bshow:false
        }
    },
    created(){
        //获取用户的歌单
        let username = window.localStorage.getItem("username");
        this.username = username;
        //请求歌曲的分组
		this.$http.jsonp("http://localhost:9999/group",{params:{username:username}}).then(res=>{
			if(res.body.status == 1){
				Toast(res.body.msg);
				return ;
            }else if(res.body.status == 2){
                //没有歌单~~
                this.userid = localStorage.getItem("userid");
                return ;
            }else{
                //请求到用户的歌单列表
                this.userid = localStorage.getItem("userid");
                this.arrgroup = res.body.mydata;
            }
		}).catch(err=>{
			console.log(err);
		});
    }
}
</script>
<style scoped>
.songlist{ width: 100%;  padding: 1rem 0; height: 9rem; border-bottom:1px solid #ccc; box-sizing: border-box; }
.left{ height: 7rem; float: left; margin-left: 1rem}
.left img{ height: 7rem;  width: 5rem }
.con{ padding-left:1rem; color: grey; float: left;}
.con h3{ margin: 0.5rem 0 0 0; height: 2rem; font-size: 1.1rem; line-height: 2rem; font-weight: 100; white-space: nowrap;width: 8rem;overflow: hidden;text-overflow: ellipsis; }
.con ul li{list-style: none; height: 1.5rem; line-height: 1.5rem; font-size: 0.8rem;white-space: nowrap;width: 8.5rem;overflow: hidden;text-overflow: ellipsis; }
.right{ float:right; text-align: center;margin-right:1rem;font-size: 0.8rem;position: relative;}
.right span{ display: block;  font-size: 0.8rem;margin-top:0.6rem; color: blue; float: right; margin-right:0.6rem }
.right p{ margin-top:2rem; font: size 0.6rem; color: red; margin-bottom:0.5rem; width: 6rem;}
.right button{ border: 1px solid red; border-radius: 5px; width: 4rem; height: 2rem; font-size: 1rem; line-height: 2rem; background: none; color: red}

.right ul{ position: absolute;top: 2rem;width: 15rem; right: 0; background:rgba(170, 170, 216, 0.8);border-radius: 10px;}
.right li{ height: 2rem; line-height: 2rem;border-bottom:1px solid white; text-align: left;text-indent: 2rem;font-size: 1rem; color: white }
.right li:last-of-type{ text-align: center}
</style>

