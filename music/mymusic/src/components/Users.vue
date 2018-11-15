<template>
    <div class="user">
        <mt-header title="个人中心">
            <mt-button icon="more" slot="right" @click="bol=!bol"></mt-button>
        </mt-header>
        <div>
            <button style="float:right" v-show="bol" @click = "exit">退出</button>
        </div>
        <br>
        <br>
        <div class="welcome">
            欢迎您！{{nickname}}
        </div>
        <h3>您的歌单</h3>
        <ul class="musicgroup">
            <li v-for="(val,index) in arrgroup" :key="index" @click="showSong(val.type)">
                {{val.type}}
            </li>
            <li class="btn"><button @click="addlist">添加歌单</button></li>
            <li v-show = "arrgroup.length == 0" style="text-align:center">空空如也....</li>
        </ul>
        <div class="songlist" v-show="bsonglist">
            <div class="top">
                歌单名：{{type}}
                <span @click = "dellist"><img src="../assets/delall.png" alt=""></span>
            </div>
            <ul class="con">
               <li v-for="(val,index) in arrshow" :key="index" @click = "goplay(val.song_id)">
                  <!--  {{val.song_id}}->song ,,,{{val.name}}->type -->
                   {{val.songname}} - {{val.author}}
                   <span @click.stop="del(index)"><img src="../assets/del.png" alt=""></span>
               </li>
               <li v-show = "arrshow.length == 0" style="text-align:center">~~~~空空如也~~~~</li>
            </ul>
            <div class="bottom">
                <button @click = "bsonglist = false">关闭</button>
            </div>
        </div>
    </div>
</template>
<script>
import { MessageBox } from 'mint-ui';
export default {
    data(){
        return {
            bol:false,
            user:{"userid":-1,"username":""},
            type:"",
            arrshow:[],
            arrgroup:[],
            arrsonglist:[],
            bsonglist:false,
            nickname:""
        }
    },
    methods:{
        //退出程序
        exit(){
            localStorage.setItem("userid","");
            localStorage.setItem("username","");
            localStorage.setItem("pwd","");
            this.$router.push("/login");
        },
        //添加一个歌单
        addlist(){
            MessageBox.prompt('请输入歌单名').then(({ value, action }) => {
                let type = value;
                let userid = this.user.userid;
                let obj={type,userid}
                //发送添加的请求
                this.$http.jsonp("http://localhost:9999/addlist",{params:obj}).then(res=>{
                    console.log(res.body.msg);
                    //添加完成显示在页面上
                    this.arrgroup.push(obj);
                }); 
                
            }).catch(err=>{
                console.log(err);
            });
        },
        //显示歌曲的列表
        showSong(type){ 
            this.bsonglist = true;
            this.type = type;
            //根据type更新不同的showsong
            this.arrshow = this.arrsonglist.filter((val)=>{
                return type == val.name;
            });
        },
        //跳入到播放页面
        goplay(songid){
            this.$router.push(`/playmusic/${songid}/${this.type}`);
        },
        //删除歌单中的一首歌曲
        del(index){
            //删除
            let userid= this.arrshow[index].user_id;
            let songid = this.arrshow[index].song_id;
            let type = this.type;
            //console.log(userid,songid,type);
            let obj = {userid,songid,type};
            this.arrshow.splice(index,1);
            //给后台发送请求
            this.$http.jsonp("http://localhost:9999/del",{params:obj}).then(res=>{
                console.log(res.body)
            }); 
        },
        //删除整个歌单
        dellist(){
            MessageBox.confirm('确定要删除整个歌单?').then(action => {
                //确定删除...userid type
                let userid = localStorage.getItem("userid");;
                let type = this.type;
                let obj = {userid,type};
                //如果歌单本来已经没有数据了，直接删除歌单就ok了
                if(this.arrshow.length == 0){
                    this.$http.jsonp("http://localhost:9999/delgroup",{params:obj}).then(res=>{
                        console.log(res.body.msg)
                    });     
                }else{  
                    //还有歌曲 发送后台删除
                    this.$http.jsonp("http://localhost:9999/dellist",{params:obj}).then(res=>{
                        console.log(res.body.msg)
                    });     
                }
                //删除前端歌单数据
                this.arrgroup = this.arrgroup.filter(val=>{
                    return type!=val.type;
                });
                //隐藏掉songlist
                this.bsonglist = false;

            }).catch((err)=>{
                console.log(err)
            })
           
        }
    },
    created(){
    	//请求用户的数据	username
        let username = window.localStorage.getItem("username");
        if(localStorage.getItem("nickname") != "null" && localStorage.getItem("nickname").trim() != ""){
            this.nickname = localStorage.getItem("nickname");
        }else{
            this.nickname = username;
        }
        //请求歌曲的分组
		this.$http.jsonp("http://localhost:9999/group",{params:{username:username}}).then(res=>{
			if(res.body.status == 1){
				Toast(res.body.msg);
				return ;
            }else if(res.body.status == 2){
                //没有歌单~~
                this.user.userid = localStorage.getItem("userid");
                return ;
            }else{
                //请求到用户的歌单列表
                this.user.userid = localStorage.getItem("userid");
                this.arrgroup = res.body.mydata;
                //根据userid获取到他的所有音乐
                return this.$http.jsonp("http://localhost:9999/songlist",{params:{userid:this.user.userid}});
            }
		}).then(res=>{//获取到用户的所有歌单的所有歌曲
           this.arrsonglist = res.body.mydata;
        }).catch(err=>{
			console.log(err);
		});
    }
}
</script>
<style scoped>
.user{ background: #C4E1FF;}

.welcome{ padding: 2rem 1rem} 
h3{ padding: 0 1rem; height: 2.5rem; line-height: 2.5rem; background: #0080FF;color: white; font-weight: normal}

.songlist{ position: fixed; bottom:54px; width: 100%; }
.songlist .top{ background:#0080FF; height: 2.4rem; line-height: 2.4rem;padding: 0 1rem;color: white}

.songlist ul,.musicgroup{ max-height: 10rem;overflow: auto; width: 100%;background:#46A3FF }
.songlist li,.musicgroup li{  line-height: 2rem; height: 2rem;border-bottom:1px solid #ccc; padding: 0 1rem;overflow: hidden; color: white }

.songlist span{ float:right;}
/*active: #0080FF*/
button{ height: 2rem;line-height: 2rem; border: none; background: #46A3FF; color: white;text-align: center;font-weight: bold;font-size: 1rem;}
.btn,.bottom{ text-align: center;background: #46A3FF; margin-top: 1px;}

img{ width: 1.2rem;height: 1.2rem; vertical-align: middle}
</style>
