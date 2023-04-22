'use strict'
import Vue from 'vue'

import MRRCard from './MRRCard.vue'
import ChipLoadCard from './ChipLoadCard.vue'
import SurfaceSpeedCard from './SurfaceSpeedCard.vue'

Vue.component('MRR-Card', MRRCard)
Vue.component('Chip-Load-Card', ChipLoadCard)
Vue.component('Surface-Speed-Card', SurfaceSpeedCard)

export default {
	MRRCard,
	ChipLoadCard,
	SurfaceSpeedCard,
}
