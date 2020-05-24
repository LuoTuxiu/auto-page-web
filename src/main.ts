import Vue from 'vue'

import 'normalize.css'
import ElementUI from 'element-ui'
import SvgIcon from 'vue-svgicon'

import '@/styles/element-variables.scss'
import '@/styles/index.scss'

import App from '@/App.vue'
import store from '@/store'
import router from '@/router'
import '@/icons/components'
import '@/permission'

import VueApollo from 'vue-apollo'
import applloClient from './apollo'

Vue.use(VueApollo)

const apolloProvider = new VueApollo({
	defaultClient: applloClient
})

Vue.use(ElementUI)
Vue.use(SvgIcon, {
	tagName: 'svg-icon',
	defaultWidth: '1em',
	defaultHeight: '1em'
})

Vue.config.productionTip = false
console.log(apolloProvider)
new Vue({
	router,
	store,
	apolloProvider,
	render: h => h(App)
}).$mount('#app')
