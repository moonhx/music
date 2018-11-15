<template>
    <div class="home">
        <!-- <mt-header fixed title="欢迎进入Music"></mt-header> -->

        <div class="footer">
            <router-link v-for = "(val,index) in navbar" :key="index" :to="val.myroute" >
                <img :src="val.common" alt=""><br>
                <span>{{val.text}}</span>
            </router-link>
        </div>

        <router-view></router-view>
         <!-- 底部的路由  -->
        <br><br><br>
       
    </div>
</template>
<script>
import imgs from "../img.config.js"
export default {
    data(){
        return {
            navbar:[
                {myroute:"/home/recommend",text:"推荐",common:imgs.img2},
                {myroute:"/home/rank",text:"排行榜",common:imgs.img3},
                {myroute:"/home/users",text:"我的",common:imgs.img5}
            ]
        }
    },
    methods:{
        routeInit(path){
            //users
            if(path.includes("users")){
                this.navbar[2].common = imgs.img6;
                this.navbar[0].common = imgs.img1;
                this.navbar[1].common = imgs.img3;
                return;
            }
            //rank
            if(path.includes("rank")){
                this.navbar[1].common = imgs.img4;
                this.navbar[0].common = imgs.img1;
                this.navbar[2].common = imgs.img5;
                return;
            }
            //recommend
            if(path.includes("recommend")){
                this.navbar[0].common = imgs.img2;
                this.navbar[1].common = imgs.img3;
                this.navbar[2].common = imgs.img5;
                return;
            }
        }
    },
    created(){
        this.routeInit(this.$route.path);
    },
    watch: {
    '$route'(to) {
      // 对路由变化作出响应...
      this.routeInit(to.path);
    }

  }
}
</script>
<style scoped>
.home{ height: 100%;}
.footer{ border-top: 1px solid #ccc; background:white; width: 100%;  height: 3rem; position:fixed; bottom: 0; display: flex; }
.footer a{ flex: 1; text-align: center;}
.footer img{ width: 1.6rem; height: 1.6rem; vertical-align: middle; margin-top: 0.3rem}
.footer span{ font-size: 0.5rem;color: #8a8a8a}
.router-link-active span{ color: #1296db; font-weight: bold}

</style>

