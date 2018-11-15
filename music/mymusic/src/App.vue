<template>
  <div id="app">
    <router-view></router-view>
  </div> 
</template>

<script>

export default {
  name: 'app',
  data () {
    return {
    }
  }
}
</script>

<style>
#app{height: 100%;overflow: hidden;}
*{font-family: Arial,"微软雅黑";padding: 0; margin: 0; }
ul{ list-style: none}
img{ vertical-align: top}
a{ border: none; text-decoration: none}
</style>
