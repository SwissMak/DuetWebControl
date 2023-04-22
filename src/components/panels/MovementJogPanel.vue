<style>
.move-btn {
	padding-left: 0 !important;
	padding-right: 0 !important;
	min-width: 0;
}
</style>

<template>
	<v-card>
		<v-card-title>
			<v-icon small class="mr-1">mdi-swap-horizontal</v-icon> Milling Mode Control
		</v-card-title>

		<v-card-text v-show="visibleAxes.length">
			<!-- v-show="!uiFrozen" -->
			<v-row
			v-show="!uiFrozen">
				<v-col sm=12 md=12 lg=3 xl=3>
					<v-row class="mb-2">
						<code-btn v-show="visibleAxes.length" color="primary" small code="G28" :title="$t('button.home.titleAll')" tile block>
							{{ $t('button.home.captionAll') }}
						</code-btn>
					</v-row>
					<v-row v-for="(axis, axisIndex) in MoveJogPara" :key="axisIndex" class="mb-2">
						<code-btn :color="IsHome(axis.NameCode) ? 'primary' : 'warning'" :disabled="uiFrozen" :title="$t('button.home.title', [axis.AxisName])" :code="axis.HomeCommand" block tile>
							Home {{ axis.AxisName }}
						</code-btn>
					</v-row>
					
				</v-col>
				<v-col sm=12 md=12 lg=4 xl=4
				>
					<v-row>
						<v-col 
						align="center"
						sm=12 md=12 lg=4 xl=4>
						</v-col>
						<v-col 
						align="center"
						sm=12 md=12 lg=4 xl=4>
						<h2 class="mb-2">{{MoveJogPara[1].AxisName}}+</h2>
							<code-Move-btn
							:code="AxisMove(MoveJogPara[1].NameCode , false)"
							IconName = "mdi-arrow-up-bold"
							>
							</code-Move-btn>
						</v-col>
						<v-col 
						align="center"
						sm=12 md=12 lg=4 xl=4></v-col>
					</v-row>
					<v-row align="center">
						<v-col 
						align="center"
						sm=12 md=12 lg=4 xl=4>
							<h2 class="mb-2">{{MoveJogPara[0].AxisName}}-</h2>
							<code-Move-btn
							:code="AxisMove(MoveJogPara[0].NameCode , true)"
							IconName = "mdi-arrow-left-bold"
							>
							</code-Move-btn>
						</v-col>
						<v-col 
						align="center"
						sm=12 md=12 lg=4 xl=4>
							<v-text-field
							class="pa-2"
							v-model="JogStep"
							type = "number"
							label="Step"></v-text-field>
						</v-col>
						<v-col 
						align="center"
						sm=12 md=12 lg=4 xl=4>
							<h2 class="mb-2">{{MoveJogPara[0].AxisName}}+</h2>
							<code-Move-btn
							:code="AxisMove(MoveJogPara[0].NameCode , false)"
							IconName = "mdi-arrow-right-bold"
							>
							</code-Move-btn>
						</v-col>
					</v-row>
					<v-row>
						<v-col 
						align="center"
						sm=12 md=12 lg=4 xl=4></v-col>
						<v-col 
						align="center"
						sm=12 md=12 lg=4 xl=4>
							<code-Move-btn
							:code="AxisMove(MoveJogPara[1].NameCode , true)"
							IconName = "mdi-arrow-down-bold"
							>
							</code-Move-btn>
							<h2 class="mt-2">{{MoveJogPara[1].AxisName}}-</h2>
						</v-col>
						<v-col 
						align="center"
						sm=12 md=12 lg=4 xl=4></v-col>
					</v-row>
				</v-col>
				<v-col sm=12 md=12 lg=1 xl=1>
					<v-row
					class="mt-12 ml-5">
						<v-col
						align="center">
							<h2 class="mb-2">{{MoveJogPara[2].AxisName}}+</h2>
							<code-Move-btn
							:code="AxisMove(MoveJogPara[2].NameCode , false)"
							IconName = "mdi-arrow-up-bold"
							>
							</code-Move-btn>
						</v-col>
					</v-row>
					<v-row class="mt-12 ml-5"
					>
						<v-col
						align="center">
							<code-Move-btn
							:code="AxisMove(MoveJogPara[2].NameCode , true)"
							IconName = "mdi-arrow-down-bold"
							>
							</code-Move-btn>
							<h2 class="mt-2">{{MoveJogPara[2].AxisName}}-</h2>
						</v-col>
					</v-row>
				</v-col>
				<v-col sm=12 md=12 lg=1 xl=1>
					<v-row
					class="mt-12 ml-5">
						<v-col
						align="center">
							<h2 class="mb-2">{{MoveJogPara[3].AxisName}}+</h2>
							<code-Move-btn
							:code="AxisMove(MoveJogPara[3].NameCode , false)"
							IconName = "mdi-arrow-up-bold"
							>
							</code-Move-btn>
						</v-col>
						
					</v-row>
					<v-row class="mt-12 ml-5"
					>
						<v-col
						align="center">
							<code-Move-btn
							:code="AxisMove(MoveJogPara[3].NameCode , true)"
							IconName = "mdi-arrow-down-bold"
							>
							</code-Move-btn>
							<h2 class="mt-2">{{MoveJogPara[3].AxisName}}-</h2>
						</v-col>
					</v-row>
				</v-col>
				<v-col sm=12 md=12 lg=1 xl=1>
					<v-row
					class="mt-12 ml-5">
						<v-col
						align="center">
							<h2 class="mb-2">{{MoveJogPara[4].AxisName}}+</h2>
							<code-Move-btn
							:code="AxisMove(MoveJogPara[4].NameCode , false)"
							IconName = "mdi-arrow-up-bold"
							>
							</code-Move-btn>
						</v-col>
						
					</v-row>
					<v-row class="mt-12 ml-5"
					>
						<v-col
						align="center">
							<code-Move-btn
							:code="AxisMove(MoveJogPara[4].NameCode , true)"
							IconName = "mdi-arrow-down-bold"
							>
							</code-Move-btn>
							<h2 class="mt-2">{{MoveJogPara[4].AxisName}}-</h2>
						</v-col>
					</v-row>
				</v-col>
				<v-col sm=12 md=12 lg=1 xl=1>
					<v-row
					class="mt-12 ml-5">
						<v-col
						align="center">
							<h2 class="mb-2">{{MoveJogPara[5].AxisName}}+</h2>
							<code-Move-btn
							:code="AxisMove(MoveJogPara[5].NameCode , false)"
							IconName = "mdi-arrow-up-bold"
							>
							</code-Move-btn>
						</v-col>
					</v-row>
					<v-row class="mt-12 ml-5"
					>
						<v-col
						align="center">
							<code-Move-btn
							:code="AxisMove(MoveJogPara[5].NameCode , true)"
							IconName = "mdi-arrow-down-bold"
							>
							</code-Move-btn>
							<h2 class="mt-2">{{MoveJogPara[5].AxisName}}-</h2>
						</v-col>
					</v-row>
				</v-col>
			</v-row>
		</v-card-text>
	</v-card>
</template>

<script>
'use strict'

import { mapState, mapGetters, mapActions } from 'vuex'

export default {
	computed: {
		...mapGetters(['isConnected', 'uiFrozen']),
		...mapState('machine/model', ['move']),
		...mapState('machine/settings', ['moveFeedrate']),
		visibleAxes() { return this.move.axes.filter(axis => axis.visible); },
		MoveJogPara(){
			return [
				{
					AxisName : "X",
					NameCode : "X",
					HomeCommand : "G28 X",
				},
				{
					AxisName : "Y",
					NameCode : "Y",
					HomeCommand : "G28 Y",
				},
				{
					AxisName : "Z",
					NameCode : "Z",
					HomeCommand : "G28 Z",
				},
				{
					AxisName : "U",
					NameCode : "U",
					HomeCommand : "G28 U",
				},
				{
					AxisName : "V",
					NameCode : "V",
					HomeCommand : "G28 V",
				},
				{
					AxisName : "W",
					NameCode : "W",
					HomeCommand : "G28 W",
				},
				{
					AxisName : "Tailstock",
					NameCode : "A",
					HomeCommand : "G28 A",
				},
				{
					AxisName : "Millingstock",
					NameCode : "B",
					HomeCommand : "G28 B",
				},
				{
					AxisName : "Headstock",
					NameCode : "C",
					HomeCommand : "G28 C",
				},
				{
					AxisName : "Head Harmonic",
					NameCode : "D",
					HomeCommand : `M118 S":W 0B H" P1\n`,
				},
			];
		},
	},
	data() {
		return {
			JogStep : 10,
			
		}
	},
	methods: {
		...mapActions('machine', ['sendCode']),
		FindParaNameIndex(_value){
			//axis.letter
            const result = this.visibleAxes.filter(x => x.letter == _value);
			if(!result[0])return {homed:false};
			//console.log(result[0]);
            return result[0];
        },
		AxisMove(_axisLetter , isminus = false){
			let idirec = 1;
			if(isminus) idirec = -1;
			let _sendComm = "M120\nG91\nG1 " + _axisLetter + this.JogStep*idirec + " F" + this.moveFeedrate + "\nG90\nM121";
			// console.log(this.FindParaNameIndex(_axisLetter));
			// console.log(_sendComm);
			return _sendComm;
		},
		SetHomeComm(_comm){
			console.log(_comm);
		},
		IsHome(_axisLetter){			
			return this.FindParaNameIndex(_axisLetter).homed;
		},
	},
	watch: {
		isConnected() {
			// Hide dialogs when the connection is interrupted
		}
	}
}
</script>
