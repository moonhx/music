<template>
    <div class="rank">
        <mt-header title="排行榜">
        </mt-header>
        <search></search>
        <!-- <mt-swipe :auto="4000">
            <mt-swipe-item><img :src="imgs[0]" /></mt-swipe-item>
            <mt-swipe-item><img :src="imgs[1]" /></mt-swipe-item>
            <mt-swipe-item><img :src="imgs[2]" /></mt-swipe-item>
        </mt-swipe> -->
        <div class="overflow">
            <div class="swipe">
                <ul>
                    <li :style="{ 'transform': mytranslate }">
                        <img src="../../static/1.jpg" alt="">
                    </li>
                    <li :style="{ 'transform': mytranslate }">
                        <img src="../../static/2.jpg" alt="">
                    </li>
                    <li :style="{ 'transform': mytranslate }">
                        <img src="../../static/3.jpg" alt="">
                    </li>
                </ul>
            </div>
            <div class="con">
                <div v-for="(val,index) in arr" :key="index" @click="tiao(val.type)" >
                    <img :src="val.pic" alt="">
                    <p>{{val.name}}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Search from "./Search";

export default {
    components:{
        Search
    },
    data(){
        return {
            bol:false,
            num:1,
            mytranslate:'',
            arr:[]
        }
    },
    methods:{
        tiao(type){
            //循环索引
            this.$router.push('rank/'+type);
        }
    },
    created(){
        //轮播图
        setInterval(function(){
            let moveTarget = this.num*100;
            this.num++;
            this.num = this.num%3;
            this.mytranslate = `translateX(-${moveTarget}%)`;
        }.bind(this),3000);
        //请求榜单数据
        //请求数据的    type = 1-新歌榜,2-热歌榜,11-摇滚榜,12-爵士,16-流行,21-欧美金曲榜,22-经典老歌榜,23-情歌对唱榜,24-影视金曲榜,25-网络歌曲榜
       
        //请求10个榜单
        for(let i=0;i<10;i++){
            let reqest = {format:"json",from:"webapp_music",method:"baidu.ting.billboard.billList",type:i,size:1,offset:0}
            this.$http.jsonp("http://tingapi.ting.baidu.com/v1/restserver/ting",{params:reqest}).then(res=>{
                //console.log(res.body.billboard)
                if(res.body.song_list){
                    this.arr.push({type:i,name:res.body.billboard.name,pic:res.body.billboard.pic_s192});
                }
                
            })
        }
        
    }
}
</script>
<style scoped>
.rank{height: 100%;} 
.overflow{overflow:auto; height: 68%; padding-bottom:3rem; }
.swipe{ width: 100%; position: relative; overflow: hidden;}
ul{ transition: 1.5s all ease; position: relative; width: 300%; display: flex; }
li{ float: left; flex: 1; transition: 2s all ease; }
.swipe img{ width: 100%;height: 210px;}

.con{ width: 18rem; overflow: hidden;margin: 0 auto; display: flex;flex-wrap: wrap;}
.con>div{ width: 7rem;  float:left; margin: 1rem; text-align: center; }
.con img{ width: 5rem; height: 5rem; border-radius: 50%}
.con p{ margin-top:1rem;  }
</style>
