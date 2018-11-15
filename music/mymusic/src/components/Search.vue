<template>
    <div class="search">
       <i class="mintui mintui-search"></i>
       <input v-model="title" type="search" @keydown.enter="getSong" placeholder="音乐 / 专辑 / 歌手 / 表单"/>
    </div>
</template>
<script>
export default {
    data(){
        return {
            title:""
            //http://tingapi.ting.baidu.com/v1/restserver/ting?format=json&callback=&from=webapp_music&method=baidu.ting.search.catalogSug&query=%E4%B8%80%E5%89%91%E8%BD%BB%E5%AE%89
        }
    },
    methods:{
        getSong(){
            this.$router.push("/searchinfo/"+this.title);
        }
    }
    
}
</script>

<style scoped>
    .search{ width: 80%; background: gainsboro;margin: 30px auto; border-radius: 10px; height: 2rem;line-height: 2rem; margin-bottom:20px  }
    i{ margin-left:10px;color:gray }
    input{ border: none;outline: none; height: 2rem; vertical-align: top; width: 85%; background: gainsboro; color: black}
</style>
