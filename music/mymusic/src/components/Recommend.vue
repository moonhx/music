<template>
    <div class="recommend">
        <mt-header title="推荐音乐"></mt-header>
        <search></search>
        <div class="nav_bar">
            <router-link to="/home/recommend/music">推荐音乐</router-link>
            <router-link to="/home/recommend/songlist">流行歌曲</router-link>
            <router-link to="/home/recommend/mv">网络歌曲</router-link>
        </div>
        <div class="overflow">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
import Search from "./Search"
export default {
    components:{
        Search
    },
    created(){
        this.$router.push('/home/recommend/music');
    }
}
</script>
<style scoped>
.recommend{height: 100%;} 
.overflow{overflow:auto; height: 68%; padding-bottom:3rem; }
.nav_bar{ display: flex}
a{ flex: 1; height: 40px; line-height: 40px; padding: 5px;text-align: center}
.router-link-active{ color: red;border-bottom: 4px solid red; }
</style>



