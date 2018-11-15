<template>
    <div>
        <song-list v-for="(val,index) in arr" :key="index"
            :id = val.id 
            :name = val.name
            :author = val.author
            :album_title = val.album_title 
            :si_proxycompany = val.si_proxycompany
            :pic_big = val.pic_big
            :pic_small = val.pic_small
            :url = val.url
            :weight = val.weight
        ></song-list>
    </div>
</template>
<script>
import SongList from "../common/SongList"
export default {
    data(){
        return {
            arr:[]
        }
    },
    methods:{
      
    },
    components:{
        SongList
    },
    created(){
        //请求数据的    type = 1-新歌榜,2-热歌榜,11-摇滚榜,12-爵士,16-流行,21-欧美金曲榜,22-经典老歌榜,23-情歌对唱榜,24-影视金曲榜,25-网络歌曲榜
        //网络歌曲
        let reqest = {format:"json",from:"webapp_music",method:"baidu.ting.billboard.billList",type:25,size:20,offset:0}
        this.$http.jsonp("http://tingapi.ting.baidu.com/v1/restserver/ting",{params:reqest}).then(res=>{
            console.log(res.body.song_list);
            let songinfo = res.body.song_list;
            for(let i =0;i<songinfo.length;i++){
                let obj = {id:songinfo[i].song_id,name:songinfo[i].title,author:songinfo[i].author,album_title:songinfo[i].album_title,si_proxycompany:songinfo[i].si_proxycompany,pic_big:songinfo[i].pic_big,pic_small:songinfo[i].pic_small,weight:songinfo[i].hot};
                this.arr.push(obj);
            }
            
        })
    }   
}
</script>

