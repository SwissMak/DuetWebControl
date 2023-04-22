'use strict'

import Vue from 'vue'

import CodeBtn from './CodeBtn.vue'
import ConnectBtn from './ConnectBtn.vue'
import EmergencyBtn from './EmergencyBtn.vue'
import SDCardBtn from './SDCardBtn.vue'
import UploadBtn from './UploadBtn.vue'
import CodeMoveBtn from './CodeMoveBtn.vue'

Vue.component('code-btn', CodeBtn)
Vue.component('connect-btn', ConnectBtn)
Vue.component('emergency-btn', EmergencyBtn)
Vue.component('sd-card-btn', SDCardBtn)
Vue.component('upload-btn', UploadBtn)
Vue.component('code-Move-btn', CodeMoveBtn)

export default {
	CodeBtn,
	ConnectBtn,
	EmergencyBtn,
	SDCardBtn,
	UploadBtn,
	CodeMoveBtn,
}
