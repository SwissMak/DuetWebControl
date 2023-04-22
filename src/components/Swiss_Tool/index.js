'use strict'
import Vue from 'vue'
//ToolInfoCard.vue

import ComputeCard from './ComputeCard'
import SmallTool from './SmallTool'
import ConversationalMenu from './ConversationalMenu'
import CheckSpellPanel from './CheckSpellPanel.vue'
import ButtonItemAreaPanel from './ButtonItemAreaPanel.vue'
import IOControlPanel from './IOControlPanel.vue'
import ToolChoosePanel from './ToolChoosePanel.vue'
import ToolEditPanel from './ToolEditPanel.vue'
import CodesEditPanel from './CodesEditPanel.vue'
import ToolPositionTurretPanel from './ToolPositionTurretPanel.vue'
import DeltaServoPanel from './DeltaServoPanel.vue'
import ToolPositionMillingPanel from './ToolPositionMillingPanel.vue'
import ToolMeasurePanel from './ToolMeasurePanel.vue'
import DeltaServoStatusPanel from './DeltaServoStatusPanel.vue'
import ToolList from './ToolList.vue'
import ToolInfoCard from './ToolInfoCard.vue'

Vue.component('Check-Spell-Panel', CheckSpellPanel)
Vue.component('Button-Item-Area-Panel', ButtonItemAreaPanel)
Vue.component('IO-Control-Panel', IOControlPanel)
Vue.component('Tool-Choose-Panel', ToolChoosePanel)
Vue.component('Tool-Edit-Panel', ToolEditPanel)
Vue.component('Codes-Edit-Panel', CodesEditPanel)
Vue.component('Tool-Position-Turret-Panel', ToolPositionTurretPanel)
Vue.component('Delta-Servo-Panel', DeltaServoPanel)
Vue.component('Tool-Position-Milling-Panel', ToolPositionMillingPanel)
Vue.component('Tool-Measure-Panel', ToolMeasurePanel)
Vue.component('Delta-Servo-Status-Panel', DeltaServoStatusPanel)
Vue.component('Tool-List', ToolList)
Vue.component('Tool-Info-Card', ToolInfoCard)

export default {
	ComputeCard,
	SmallTool,
	ConversationalMenu,
	CheckSpellPanel,
	ButtonItemAreaPanel,
	IOControlPanel,	
	ToolChoosePanel,
	ToolEditPanel,
	CodesEditPanel,
	ToolPositionTurretPanel,
	DeltaServoPanel,
	ToolPositionMillingPanel,
	ToolMeasurePanel,
	DeltaServoStatusPanel,
	ToolList,
	ToolInfoCard,
}
