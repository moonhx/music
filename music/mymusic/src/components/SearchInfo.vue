<template>
    <div>
        <mt-header title="搜索结果">
            <router-link to="/home/recommend" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
        </mt-header>
        <ul>
            <li v-for = "(val,index) in arr" :key="index">
                <SongList 
                    :id = val.id 
                    :name = val.name
                    :author = val.author
                    :album_title = val.album_title 
                    :si_proxycompany = val.si_proxycompany
                    :pic_big = val.pic_big
                    :pic_small = val.pic_small
                    :url = val.url
                    :weight = val.weight
                ></SongList>
            </li>

        </ul>
        
    </div>
</template>
<script>
import SongList from "./common/SongList";
export default {
    data(){
        return {
            key:"",
            arr:[]
        }
    },
    components:{
        SongList
    },
    created(){
        //动态根据路由传过来的歌曲名查询歌曲
        this.key = this.$route.params.key;
        this.$http.jsonp("http://tingapi.ting.baidu.com/v1/restserver/ting",{params:{format:"json",method:"baidu.ting.search.catalogSug",query:this.key}}).then(res=>{
            //根据songid  请求歌曲资源     res.body.song[i].songid 
            for(let i=0;i<res.body.song.length;i++){
                let weight = res.body.song[i].weight;
                this.$http.jsonp("http://tingapi.ting.baidu.com/v1/restserver/ting",{params:{format:"json",songid:res.body.song[i].songid,method:"baidu.ting.song.play"}}).then(res =>{
                    let songInfo = res.body.songinfo;
                    console.log(res.body);
                    this.arr.push({id:songInfo.song_id,name:songInfo.title,album_title:songInfo.album_title,author:songInfo.author,lrclink:songInfo.lrclink,pic_big:songInfo.pic_big,pic_small:songInfo.pic_small,si_proxycompany:songInfo.si_proxycompany,weight:weight, url:res.body.bitrate.show_link}) 
                });
            }
        }).catch(err=>{
            console.log(err);
        })
    }    
}
</script>
<style scoped>
    li{ list-style: none}
</style>


