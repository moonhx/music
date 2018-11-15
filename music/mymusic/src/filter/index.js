import Vue from "vue";

Vue.filter("toW",function(val){
	if(val>10000){
		return parseFloat(val/10000).toFixed(2)+'万';
	}
    return val;
});
Vue.filter("toMin",function(val){
    return toDou(parseInt(val/60)) + ":" + toDou(val%60);
});
function toDou(val){
    return val<10?"0"+val:''+val;
}
