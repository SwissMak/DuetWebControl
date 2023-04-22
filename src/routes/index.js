'use strict'

import Vue from 'vue'
import VueRouter from 'vue-router'

import Page404 from './Page404.vue'

import Control from './Control'
import Job from './Job'
import Files from './Files'
import Settings from './Settings'
import ToolManagement from './ToolManagement'

Vue.use(VueRouter)

export const Routing = [
	// Control
	{
		icon: 'mdi-tune',
		caption: 'menu.control.caption',
		pages: [
			// Dashboard
			{
				icon: 'mdi-desktop-mac',
				caption: 'menu.control.dashboard',
				path: '/',
				component: Control.Dashboard
			}
			,
			// Height Map
			// {
			// 	icon: 'mdi-grid',
			// 	caption: 'menu.control.heightmap',
			// 	path: '/Heightmap',
			// 	component: Control.Heightmap
			// },
			// Console
			{
				icon: 'mdi-code-tags',
				caption: 'menu.control.console',
				path: '/Console',
				component: Control.Console
			},
			// BLDC
			// {
			// 	icon: 'mdi-motorbike',
			// 	caption: 'menu.control.BLDC',
			// 	path: '/BLDC',
			// 	component: Control.BLDC
			// },
			// delta servo
			{
				icon: 'mdi-motorbike',
				caption: 'DeltaServo',
				path: '/DeltaServo',
				component: Control.DeltaServo
			},
			// 3D View
			// {
			// 	icon: 'mdi-glasses',
			// 	caption: 'menu.control.ThreeD_View',
			// 	path: '/ThreeD_View',
			// 	component: Control.ThreeD_View
			// },
			// ControlMode
			{
				icon: 'mdi-food-croissant',
				caption: 'menu.control.ControlMode',
				path: '/ControlMode',
				component: Control.ControlMode
			},
			
			// Tools Edit
			// {
			// 	icon: 'mdi-rotate-left-variant',
			// 	caption: "menu.control.ToolsEdit",
			// 	path: '/ToolEdit',
			// 	component: Control.ToolEdit
			// },
			// Conversational Menu
			{
				icon: 'mdi-apple-keyboard-command',
				caption: "menu.control.ConversationalMenu",
				path: '/ConversationalMenu',
				component: Control.ConversationalMenu
			},
		]
	},
	// Job
	{
		icon: 'mdi-wallet-travel',
		caption: 'menu.job.caption',
		pages: [
			// Status
			{
				icon: 'mdi-information',
				caption: 'menu.job.status',
				path: '/Job/Status',
				component: Job.Status
			},
			// Webcam
			{
				icon: 'mdi-webcam',
				caption: 'menu.job.webcam',
				path: '/Job/Webcam',
				component: Job.Webcam,
				condition: 'webcam'
			},
			
			// Visualiser (coming soon)
			/* {
				icon: 'mdi-3d-rotation',
				caption: 'menu.job.visualiser',
				path: '/Job/Visualiser',
				component: Job.Visualiser
			} */
		]
	},
	// Tool Management
	{
		icon: 'mdi-tooltip-edit',
		caption: 'Tool Management',
		pages: [
			// Turret Tool
			// {
			// 	icon: 'mdi-arrow-collapse-left',
			// 	caption: 'Turret Tool',
			// 	path: '/ToolManagement/TurretToolManagement',
			// 	component: ToolManagement.TurretToolManagement
			// },
			// Milling Tool
			{
				icon: 'mdi-arrow-collapse-down',
				caption: 'Tool Setting',
				path: '/ToolManagement/MillingToolManagement',
				component: ToolManagement.MillingToolManagement,
			},
			// ToolMeasure
			// {
			// 	icon: 'mdi-move-resize',
			// 	caption: 'Tool Measure',
			// 	path: '/ToolManagement/ToolMeasure',
			// 	component: ToolManagement.ToolMeasure,
			// },
		]
	},
	// Files
	{
		icon: 'mdi-file-document',
		caption: 'menu.files.caption',
		pages: [
			// Jobs
			{
				icon: 'mdi-play',
				caption: 'menu.files.jobs',
				path: '/Files/Jobs',
				component: Files.Jobs
			},
			// Macros
			{
				icon: 'mdi-polymer',
				caption: 'menu.files.macros',
				path: '/Files/Macros',
				component: Files.Macros
			},
			// Filaments
			// {
			// 	icon: 'mdi-radiobox-marked',
			// 	caption: 'menu.files.filaments',
			// 	path: '/Files/Filaments',
			// 	component: Files.Filaments
			// },
			// Display
			{
				icon: 'mdi-format-list-numbered',
				caption: 'menu.files.menu',
				path: '/Files/Display',
				component: Files.Display,
				condition: 'display'
			},
			// System
			{
				icon: 'mdi-cog',
				caption: 'menu.files.system',
				path: '/Files/System',
				component: Files.System
			}
		]
	},
	// Settings
	{
		icon: 'mdi-wrench',
		caption: 'menu.settings.caption',
		pages: [
			// General
			{
				icon: 'mdi-tune',
				caption: 'menu.settings.general',
				path: '/Settings/General',
				component: Settings.General
			},
			// Machine
			// {
			// 	icon: 'mdi-cogs',
			// 	caption: 'menu.settings.machine',
			// 	path: '/Settings/Machine',
			// 	component: Settings.Machine
			// },
			// Axis setting
			{
				icon: 'mdi-sign-direction',
				caption: "menu.control.AxisGloableVariable",
				path: '/Settings/AxisGloableVariable',
				component: Settings.AxisGloableVariable
			},
			// ConfigSetting
			// {
			// 	icon: 'mdi-archive',
			// 	caption: "Config Setting",
			// 	path: '/Settings/ConfigSetting',
			// 	component: Settings.ConfigSetting
			// },
			
			// Update (coming soon) 
			/* {
				icon: 'mdi-update',
				caption: 'menu.settings.update',
				path: '/Settings/Update',
				component: Settings.Update
			} */
		]
	}
]

export default new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		...Routing.map(category => category.pages).reduce((a, b) => a.concat(b)),
		{
			path: '*',
			component: Page404
		}
	]
})
