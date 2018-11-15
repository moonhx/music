<template>
    <div class="rankinfo">
        <mt-header fixed :title="name">
            <router-link to="/home/rank" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
        </mt-header>
        <br>
        <search></search>
        <div>
            <song-list v-for="(val,index) in arr" :key="index"
                :id = val.song_id 
                :name = val.title
                :author = val.author
                :album_title = val.album_title 
                :si_proxycompany = val.si_proxycompany
                :pic_big = val.pic_big
                :pic_small = val.pic_small
                :url = val.url
                :weight = val.weight
            ></song-list>
        </div>
    </div>
</template>
<script>
import Search from './Search';
import SongList from './common/SongList'
export default {
    components:{
        Search,
        SongList
    },
    data(){
        return {
            arr:[],
            name:""
        }
    },
    created(){
        let type = this.$route.params.type;
        let reqest = {format:"json",from:"webapp_music",method:"baidu.ting.billboard.billList",type:type,size:20,offset:0}
        this.$http.jsonp("http://tingapi.ting.baidu.com/v1/restserver/ting",{params:reqest}).then(res=>{
            this.arr = res.body.song_list.map((val,index,arr)=>{
                if(!val.weight){
                	if(val.hot){
                		let weight = val.hot;
                    	val.weight = weight;
                	}else{
                		val.weight = 0;
                	}
                }
                return val;
            });
            console.log(this.arr);
            this.name = res.body.billboard.name;
        });
    }
}
</script>
<style scoped>
.rankinfo h3{ text-align: center; padding-bottom: 15px; font-weight: 300; border-bottom:1px solid black }

</style>

