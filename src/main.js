// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from './util/http'
import Vuex from 'vuex'
import VueLazyload from 'vue-lazyload'
import infiniteScroll from  'vue-infinite-scroll'
import {currency} from './util/currency'
import util from './util/util'


import './assets/css/base.css'
import './assets/css/checkout.css'
import './assets/css/login.css'
import './assets/css/product.css'

import './assets/svg/svg.svg'

Vue.prototype.$axios = axios

Vue.use(util)
Vue.use(infiniteScroll)
Vue.use(Vuex)
Vue.use(VueLazyload, {
  loading: 'static/loading-svg/loading-bars.svg',
  try: 4, // default 1
  error:'static/logo.png',
})

Vue.filter("currency",currency)

Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

Vue.config.productionTip = false

const store = new Vuex.Store({
  state: {
    nickName:'',
    cartCount:0
  },
  mutations: {
    //更新用户信息
    updateUserInfo(state, nickName) {
      state.nickName = nickName;
    },
    updateCartCount(state,cartCount){
      debugger
      state.cartCount += cartCount;
    },
    initCartCount(state) {
      state.cartCount = 0
    }
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  mounted(){
    this.checkLogin();
    //this.getCartCount();
  },
  methods:{
    checkLogin(){
      axios.get("users/checkLogin").then(res=> {
        var res = res.data;
        if (res.status == "0") {
          this.$store.commit("updateUserInfo", res.userName);
          this.$store.commit("updateCartCount", res.cartCount);
        }else{
          if(this.$route.path!="/goods"){
            this.$router.push("/goods");
          }
        }
      });
    }
  },
  template: '<App/>',
  //render: h => h(App),
  components: { App }
});//.$mount('#app')
