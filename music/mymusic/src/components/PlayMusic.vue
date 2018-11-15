<template>
    <div class="playmusic" >
        <mt-header :title="headdata">
            <!-- <router-link to="/home/recommend/music" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link> -->
            <div slot="left"><mt-button icon="back" @click = "goback">返回</mt-button></div>
            <mt-button icon="more" slot="right" @click.stop="bsonglist = !bsonglist"></mt-button>
        </mt-header>
        <div class="content">
            <button @click = "repeatMusic">重新播放</button>
            <button @click="prevMusic">上一曲</button>
            <button @click = "playMusic">{{bplay}}</button>
            <button @click="nextMusic">下一曲</button>
        </div>
        <div class="ta_c">
            <img class="Rotation img" :src="pic" width="500" height="500"/>
        </div>
        <div id="myrange">
            <mt-range v-model="rangeValue" :bar-height="5">
                <div class="aaa" slot="start">{{currentTime|toMin}}</div>
                <div class="aaa" slot="end">{{duration|toMin}}</div>
            </mt-range>
        </div>
        <div class="songlist" v-show="bsonglist" >
            <div class="top">
                 <img @click="toggleMusicMode" class="playicon" :src="playImg[playmode].imgicon">   
                {{playImg[playmode].name}}
            </div>
            <ul class="con">
               <li :class="{'active':index==nowIndex}" v-for="(val,index) in arr" :key="index" @click = "play(index)">
                   <strong>{{val.songname}} - {{val.author}}</strong>
                   <span @click.stop="del(index)">x</span>
               </li>
            </ul>
            <div class="bottom">
                <button @click = "bsonglist = false">关闭</button>
            </div>
        </div>
    </div>
</template>
<script>
import imgs from "../img.config.js";

export default {
    data(){
        return {
            arr:[],
            nowIndex:-1,
            bsonglist:false,
            bplay:"播放",
            songname:"",
            audiosrc:"",
            author:"",
            currentTime:0,
            duration:0,
            rangeValue:0,
            pic:"",
            playImg:[
                {name:"循环播放",imgicon:imgs.circle},
                {name:"单曲循环",imgicon:imgs.one},
                {name:"随机播放",imgicon:imgs.auto}
            ],
            playmode:0
        }
    },
    computed:{
        headdata(){
            return `${this.songname} - ${this.author}`;
        },
        musicAudio(){
            return this.$store.state.oAudio;
        }
    },
    methods:{
        goback(){
            window.history.length > 1? this.$router.go(-1):this.$router.push('/home/recommend/music');
        },
        prevMusic(){
            if(this.nowIndex == 0){
                this.nowIndex = this.arr.length - 1; 
            }else{
                this.nowIndex--;
            }
            this.play(this.nowIndex);
            this.repeatMusic();
        },
        nextMusic(){
            this.nowIndex++;
            this.nowIndex = this.nowIndex%this.arr.length;
            this.play(this.nowIndex)
            this.repeatMusic();
        },
        playMusic(){
            if(this.audiosrc!=this.musicAudio.getAttribute("src")){
                this.musicAudio.setAttribute("src",this.audiosrc);
            }
            //控制暂停播放
            if(this.musicAudio.paused){ 
                //加载完成播放
                this.musicAudio.play();
                this.bplay = "播放中..."
                /* 
                this.musicAudio.addEventListener("canplaythrough",
                    function() {
                        this.musicAudio.play();
                        this.bplay = "播放中..."
                    }.bind(this),false);
                */
            }else{
                this.bplay="暂停中...";
                this.musicAudio.pause();// 暂停
            }
            //总时长
            //开个定时器更新播放进度
            let timer = null;
            clearInterval(timer);
            timer = setInterval(function(){
                this.duration = parseInt(this.musicAudio.duration);
                this.currentTime = parseInt(this.musicAudio.currentTime);
                let scale = this.currentTime /this.duration;
                this.rangeValue = parseInt(scale*100);
                
                if(this.musicAudio.duration == this.musicAudio.currentTime){
                    clearInterval(timer);
                    //这块播放下一首
                    this.nextMusic();
                }
            }.bind(this),1000);
            let that = this;
            myrange.addEventListener("touchstart", function(){
                clearInterval(timer);
                myrange.addEventListener("touchmove", function move(){
                    var scale = that.rangeValue / 100;
                    that.musicAudio.currentTime = parseInt(scale*that.duration);
                    that.currentTime = parseInt(that.musicAudio.currentTime);
                });
                myrange.addEventListener("touchend",function(){
                    timer = setInterval(function(){
                        that.duration = parseInt(that.musicAudio.duration);
                        that.currentTime = parseInt(that.musicAudio.currentTime);
                        let scale = that.currentTime /that.duration;
                        that.rangeValue = parseInt(scale*100);
                        
                        if(that.musicAudio.duration == that.musicAudio.currentTime){
                            clearInterval(timer);
                            //调取下首歌曲
                            //判断播放的模式
                            if(that.playmode == 0){
                                //循环播放
                                that.nextMusic();
                            }else if(that.playmode == 1){
                                //单曲循环
                                that.repeatMusic();
                            }else{
                                //随机播放
                                let index = parseInt(Math.random()*that.arr.length);
                                console.log(index);
                                that.nowIndex = index;
                                that.play(that.nowIndex)
                                that.repeatMusic();
                            }
                            
                        }
                    }.bind(that),1000);
                });
            });
        },
        play(index){
            this.nowIndex = index;
            let songid = this.arr[index].song_id;
            //播放当前选中的歌曲
            this.$http.jsonp("http://tingapi.ting.baidu.com/v1/restserver/ting",{params:{format:"json",songid:songid,method:"baidu.ting.song.play"}}).then(res =>{
                this.audiosrc = res.body.bitrate.file_link;
                this.author = res.body.songinfo.author;
                this.songname = res.body.songinfo.title;
                this.pic = res.body.songinfo.pic_premium;
                this.playMusic();
            });
        },
        repeatMusic(){
            this.musicAudio.load();
            this.musicAudio.play();
        },
        del(index){
            if(this.nowIndex == index){
                console.log("正在播放，不能删除！");
                return;
            }
            //删除
            let userid= this.arr[index].user_id;
            let songid = this.arr[index].song_id;
            let type = this.arr[index].name;
            let obj = {userid,songid,type};
            this.arr.splice(index,1);
            //给后台发送请求
            this.$http.jsonp("http://localhost:9999/del",{params:obj}).then(res=>{
                console.log(res.body.msg)
            }); 
        },
        toggleMusicMode(){
            this.playmode = (this.playmode+1)%3;
        }
    },
    mounted:function(){
        //请求数据到arr
        //method=baidu.ting.search.catalogSug&query=%E4%B8%80%E5%89%91%E8%BD%BB%E5%AE%89
        //http://tingapi.ting.baidu.com/v1/restserver/ting?format=json&method=baidu.ting.song.play&songid=877578
        let type = this.$route.params.type;
        let songid = this.$route.params.id;
        //播放当前选中的歌曲
        this.$http.jsonp("http://tingapi.ting.baidu.com/v1/restserver/ting",{params:{format:"json",songid:songid,method:"baidu.ting.song.play"}}).then(res =>{
            //创建一个audio标签
            //判断一下看是不是第一次播放 vuex
            this.audiosrc = res.body.bitrate.file_link;
            this.author = res.body.songinfo.author;
            this.songname = res.body.songinfo.title;
            this.pic = res.body.songinfo.pic_premium;
            this.playMusic();
            let userid = localStorage.getItem("userid");
            let obj = { userid:userid,songid:songid,songname:this.songname,author:this.author};
            if(type=="0"){
                //添加到后台的历史记录中
                this.$http.jsonp("http://localhost:9999/inserthistory",{params:obj}).then(res=>{
                    //直接返回的就是历史记录的歌单
                    this.arr = res.body.mydata;
                    for(let i=0;i<this.arr.length;i++){
                        if(songid == this.arr[i].song_id){
                            this.nowIndex = i;
                            return ;
                        }
                    }
                });
            }else{
                 this.$http.jsonp("http://localhost:9999/selectlist",{params:{type:type,userid:userid}}).then(res=>{
                    //直接返回的就是type类型的歌单
                    this.arr = res.body.mydata;
                    for(let i=0;i<this.arr.length;i++){
                        if(songid == this.arr[i].song_id){
                            this.nowIndex = i;
                            return ;
                        }
                    }
                });
            }
            
        });
    }
}
</script>
<style scoped>
.content{ display: flex;padding: 2rem}
.content button{ flex: 1}
.aaa{ text-align: center;padding:0 1rem}


/*图片旋转*/
.ta_c{text-align: center; margin: 1rem; border-radius: 50%}

@-webkit-keyframes rotation{
    from {-webkit-transform: rotate(0deg);}
    to {-webkit-transform: rotate(360deg);}
}

.Rotation{
    -webkit-transform: rotate(360deg);
    animation: rotation 20s linear infinite;
    -moz-animation: rotation 20s linear infinite;
    -webkit-animation: rotation 20s linear infinite;
    -o-animation: rotation 20s linear infinite;
}
.img{border-radius: 50%; width: 15rem; height: 15rem; }


.songlist{ position: fixed; bottom:0; width: 100%; }
.songlist .top{ background:#0080FF; height: 2.4rem; line-height: 2.4rem;padding: 0 1rem;color: white}
.playicon{ width: 20px; height: 20px; vertical-align: middle; margin-right:3px}


.songlist ul,.musicgroup{ max-height: 8rem;overflow: auto; width: 100%;background:#46A3FF }
li{  line-height: 2rem; height: 2rem;border-bottom:1px solid #ccc; padding: 0 1rem;overflow: hidden; color: white }
.active{ background: #0080FF}
li strong{ font-weight: 100;display:inline-block; width: 18rem}

.songlist span{ float:right;}
.bottom button{ width: 100%; height: 49px;line-height: 49px; border: none; background: #46A3FF	; color: white;text-align: center;font-weight: bold;font-size: 1rem;margin-top: 1px;}
</style>
