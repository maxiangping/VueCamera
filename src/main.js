// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//  导入插件
import axios, {axiosPlugin} from './common/axios';
import {eventBusPlugin} from './common/event';

Vue.config.productionTip = false
Vue.use(axiosPlugin);
Vue.use(eventBusPlugin);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
