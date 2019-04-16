// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './vuex/store'
import VueLazyLoad from 'vue-lazyload'


Vue.config.productionTip = false;
Vue.use(iView);
Vue.use(VueAxios,axios);
Vue.use(VueLazyLoad,{
  error:'./static/error.png',
  loading:'../static/images/loading.gif'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
