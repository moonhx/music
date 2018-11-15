import Vue from 'vue'
import VueRouter from "vue-router"
Vue.use(VueRouter);
//路由配置
import Login from '../components/Login'
import Home from '../components/Home'
import Reg from '../components/Reg'
import PlayMusic from "../components/PlayMusic"
import SearchInfo from "../components/SearchInfo"
//主页底下的路由分发
import Recommend from '../components/Recommend'
import Rank from '../components/Rank'
import RankInfo from '../components/RankInfo'
import Users from '../components/Users'
//主页.推荐底下的路由分发
import Music from '../components/recommend/Music'
import SongList from '../components/recommend/SongList'
import Mv from '../components/recommend/Mv'
const routes = [
  { path:"/",component:Login},
  { path:"/login",component:Login},
  { path:"/home",component:Home,children:[
    { path:"recommend",component:Recommend,children:[
      { path:"music",component:Music},
      { path:"songlist",component:SongList},
      { path:"Mv",component:Mv}
    ]},
    { path:"rank",component:Rank},
    { path:"rank/:type",component:RankInfo},
    { path:"users",component:Users}
  ]},
  { path:"/reg",component:Reg},
  { path:"/playmusic/:id/:type",component:PlayMusic},
  { path:"/searchinfo/:key",component:SearchInfo}/* ,
  { path:"*",redirect:"/home/recommend/music"} */
];
const router = new VueRouter({
  routes,
  mode:"history"
});
export default router