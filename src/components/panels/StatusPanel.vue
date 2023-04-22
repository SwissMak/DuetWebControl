<style scoped>
strong {
	align-self: center;
	text-align: center;
}

.category-header {
	flex: 0 0 100px;
}

a:not(:hover) {
	color: inherit;
}

.content span,
.content strong {
	padding-left: 8px;
	padding-right: 8px;
}

.probe-span {
	border-radius: 5px;
}
.probe-span:not(:last-child) {
	margin-right: 8px;
}
</style>

<template>
	<v-card>
		<v-card-title class="py-2 ">
			<v-icon small class="mr-1">mdi-information</v-icon> {{ $t('panel.status.caption') }}

			<v-spacer></v-spacer>

			<status-label v-if="status"></status-label>

			<v-spacer></v-spacer>

			<h3 v-if="machineMode">{{ $t('panel.status.mode', [machineMode.toUpperCase()]) }}</h3>
		</v-card-title>

		<v-card-text class="px-0 pt-0 content text-xs-center" v-show="sensorsPresent || (visibleAxes.length + move.extruders.length)">
			<v-row>
				<v-col>
					<v-btn
					@click="GetVisible()"
					color="primary">
						Spindle Meter Displays
					</v-btn>
				</v-col>
			</v-row>
			<v-row>
				<v-col
				xs="12" sm="12" md="6" lg="12" xl="12">
					<!-- Spindles -->
					<template>
						<v-row no-gutters
						>
							<v-col>
								<v-row
								justify="center">	
									<template v-for="(spin, index) in SpindleDatas" >
										<v-col
										:key="index"
										:class="SpindleClass(index)"
										v-if="GetVisible_forGUI(index)"
										cols="4"
										>
											<v-row tag="strong">
												<v-col>
													{{spin.spinName}}
												</v-col>
											</v-row>
											<v-row 
											align="center">
												<v-col cols="8">
													<v-row
													v-if="spin.GUI_Setting.visible[0]"
													justify="end">
														<v-tooltip bottom>
															<template #activator="{ on }">
																<v-progress-circular
																v-on="on"
																:rotate="-90"
																:size="200"
																:width="15"
																:value=" CircleValue(index ,MapSpindleValue(index,0) , 0) "
																:color="CircleColor(index , MapSpindleValue(index,0) ,spin.GUI_Setting.MaxValue[0])"
																>
																<h1>{{ MapSpindleValue(index,0) }}</h1><br><br>RPM
																</v-progress-circular>
															</template>
															Velocity(RPM)
														</v-tooltip>
													</v-row>
												</v-col>
												<v-col cols="2" >
													<v-row 
													v-if="spin.GUI_Setting.visible[1]"
													justify="start">
														<v-col>
															<v-tooltip bottom>
																<template #activator="{ on }">
																	<v-progress-circular
																	v-on="on"
																	:rotate="-90"
																	:size="80"
																	:width="15"
																	:value=" CircleValue(index ,MapSpindleValue(index,1) , 1) "
																	:color="CircleColor(index , MapSpindleValue(index,1) ,spin.GUI_Setting.MaxValue[1])"
																	>
																	<h3>{{ MapSpindleValue(index,1) }}</h3><br>θ
																	</v-progress-circular>
																</template>
																Position(&deg;)
															</v-tooltip>
														</v-col>
													</v-row>
													<v-row
													v-if="spin.GUI_Setting.visible[2]">
														<v-col>
															<v-tooltip bottom>
																<template #activator="{ on }">
																	<v-progress-circular
																	v-on="on"
																	:rotate="-90"
																	:size="85"
																	:width="15"
																	:value=" CircleValue(index ,MapSpindleValue(index,2) , 2) "
																	:color="CircleColor(index , MapSpindleValue(index,2) ,spin.GUI_Setting.MaxValue[2])"
																	>
																	<h3>{{ MapSpindleValue(index,2) }}</h3><br>τ
																	</v-progress-circular>
																</template>
																Torque(N．M)
															</v-tooltip>
														</v-col>
													</v-row>
												</v-col>
											</v-row>
											<v-row>
												<v-col
												v-if="spin.GUI_Setting.visible[3]"
												>
													<v-tooltip bottom>
														<template #activator="{ on }">
															<span>Load(%)</span>
															<v-progress-linear
															:color="CircleColor(index , MapSpindleValue(index,3) ,spin.GUI_Setting.MaxValue[3])"
															height="30"
															v-on="on"
															:value=" CircleValue(index ,MapSpindleValue(index,3) , 3) "
															striped
															>
																<h3>{{ MapSpindleValue(index,3) }} </h3> 
															</v-progress-linear>
															
														</template>
														Spindle Load Meter(%)
													</v-tooltip>
												</v-col>
											</v-row>
											<v-row>
												<v-col
												v-if="spin.GUI_Setting.visible[4]"
												>
													<v-tooltip bottom>
														<template #activator="{ on }">
															<span>Power(watt)</span>
															<v-progress-linear
															:color="CircleColor(index , PowerValue(MapSpindleValue(index,2),MapSpindleValue(index,0)) ,spin.GUI_Setting.MaxValue[4])"
															height="30"
															v-on="on"
															:value=" CircleValue(index ,PowerValue(MapSpindleValue(index,2),MapSpindleValue(index,0)) , 4) "
															striped
															>
																<h3>{{ PowerValue(MapSpindleValue(index,2),MapSpindleValue(index,0)) }}</h3>
															</v-progress-linear>															
														</template>
														Power(W)
													</v-tooltip>
												</v-col>
											</v-row>
										</v-col>
									</template>
								</v-row>
							</v-col>
						</v-row>
					</template>
				</v-col>
			</v-row>

			<v-dialog 
			v-model="sheet_LimitSet"
			@click="sheet_LimitSet = false"
			fullscreen
			hide-overlay
			transition="dialog-bottom-transition"
			>
				<v-card>
					<v-card-title>
						<span class="headline">Limit Set</span>
					</v-card-title>
					<v-card-text>
						<v-container>
							<v-row>
								<v-col
								v-for="(spinD, i) in SpindleDatas"
								:key="`spinD-${i}`"
								align="center"
								sm="4"
								md="4">
									<div>
										<strong>{{spinD.spinName}}</strong>
									</div>
									<v-divider></v-divider>
									<div>
										<v-list shaped>
											<v-list-item-group
												v-model="spinD.GUI_Setting.ModelforItems"
												multiple
											>
												<template v-for="(item, itemi) in SpidleInfoDatas">
													<v-list-item
														:key="`item-${itemi}`"
														:value="item"
														active-class="deep-purple--text text--accent-4"
													>
														<template v-slot:default="{ active }">
															<v-list-item-content>
																<v-list-item-title v-text="item"></v-list-item-title>
															</v-list-item-content>

															<v-list-item-action>
																<v-checkbox
																color="deep-purple accent-4"
																:input-value="active"
																></v-checkbox>
															</v-list-item-action>
														</template>
													</v-list-item>
												</template>
											</v-list-item-group>
										</v-list>
									</div>
									<v-row
									v-for="(sid, MaxSetindex) in SpidleInfoDatas"
									:key="`MaxSet-${MaxSetindex}`"
									>
										<v-col>
											<v-text-field 
											v-model="SpindleDatas[i].GUI_Setting.MaxValue[MaxSetindex]" 
											:label="sid" 
											prepend-icon="mdi-gamepad-variant">
											</v-text-field>
										</v-col>
									</v-row>
									<v-divider></v-divider>
									<div>
										<v-list shaped>
											<v-list-item-group
												v-model="spinD.GUI_Setting.ModelforModes"
												multiple
											>
												<template 
												v-for="indexModeV in 3">
													<v-list-item
														:key="`item-${indexModeV}`"
														:value="ModesInfoDatasForItem[indexModeV-1]"
														active-class="deep-purple--text text--accent-4"
													>
														<template v-slot:default="{ active }">
															<v-list-item-content>
																<v-list-item-title v-text="ModesInfoDatasForItem[indexModeV-1]"></v-list-item-title>
															</v-list-item-content>

															<v-list-item-action>
																<v-checkbox
																color="deep-purple accent-4"
																:input-value="active"
																></v-checkbox>
															</v-list-item-action>
														</template>
													</v-list-item>
												</template>
											</v-list-item-group>
										</v-list>
									</div>
								</v-col>
							</v-row>
						</v-container>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn
						color="blue darken-1"
						text
						@click="Setvisible"
						>
							Save
						</v-btn>
						<v-btn
						color="blue darken-1"
						text
						@click="sheet_LimitSet = false"
						>
							Cancel
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			
		</v-card-text>

		<v-card-text class="pa-0" v-show="!sensorsPresent && !(move.axes.length + move.extruders.length)">
			<v-alert :value="true" type="info">
				{{ $t('panel.status.noStatus') }}
			</v-alert>
		</v-card-text>
	</v-card>	
</template>

<script>
'use strict'

import { mapState ,mapMutations } from 'vuex'

import { ProbeType } from '../../store/machine/modelEnums.js'

//10% torque load = blue. 100% torque = green. 200% torque = yellow. 300% torque = red

export default {
	components: {
		//GChart
	},
	computed: {
		...mapState('settings', ['darkTheme']),
		...mapState('machine/model', {
			boards: state => state.boards,
			fans: state => state.fans,
			move: state => state.move,
			machineMode: state => state.state.machineMode,
			sensors: state => state.sensors,
			status: state => state.state.status,
			tools: state => state.tools,
			spindles: state => state.spindles,
		}),
		fanRPM() {
			return this.fans
				.filter(fan => fan && fan.rpm >= 0)
				.map((fan, index) => ({
					name: fan.name || this.$t('panel.fan.fan', [index]),
					rpm: fan.rpm
				}), this);
		},
		probesPresent() {
			return this.sensors.probes.some(probe => probe && probe.type !== ProbeType.none);
		},
		sensorsPresent() {
			return ((this.boards.length && this.boards[0].vIn.current > 0) ||
					(this.boards.length && this.boards[0].v12.current > 0) ||
					(this.boards.length && this.boards[0].mcuTemp.current > -273) ||
					(this.fanRPM.length !== 0) ||
					(this.probesPresent));
		},
		visibleAxes() {
			return this.move.axes.filter(axis => axis.visible);
		},
		SpidleInfoDatas() {
			return ["Velocity" , "Position" , "Torque" , "Load Meter" , "Power"];
		},
		ModesInfoDatas() {
			return ["Debug Mode" , "Lathe Mode" , "Milling Mode"];
		},
		ModesInfoDatasForItem() {
			return ["Debug Mode visible" , "Lathe Mode visible" , "Milling Mode visible"];
		},
	},
	data() {
		return {
			displayToolPosition: true,
			//Default , Lathe , Milling
			SpindleModeSetting: [
				{
					//head , milling , tail
					visible: [true,true,true],
				},
				{
					//head , milling , tail
					visible: [true,true,true],
				},
				{
					//head , milling , tail
					visible: [false,true,false],
				},
			],
			SpindleDatas:[
				{
					spinName:"Headstock",
					color:"primary",				
					GUI_Setting: {
						ModelforItems: ["Velocity" , "Position" , "Torque" , "Load Meter" , "Power"],
						visible: [true,true,true,true,true],
						MaxValue: [3000,360,7.16,400,6500],
						ModelforModes: [],
					},
					
				},
				{
					spinName:"Milling",
					color:"primary",
					GUI_Setting: {
						ModelforItems: ["Velocity" , "Position" , "Torque" , "Load Meter" , "Power"],
						visible: [true,true,true,true,true],
						MaxValue: [6000,360,2.4,400,6500],
						ModelforModes: [],
					},
				},
				{
					spinName:"Tailstock",
					color:"primary",
					GUI_Setting: {
						ModelforItems: ["Velocity" , "Position" , "Torque" , "Load Meter" , "Power"],
						visible: [true,true,true,true,true],
						MaxValue: [3000,360,7.16,400,6500],
						ModelforModes: [],
					},
				},
			],
			isLoadDatas : false,
			sheet_LimitSet : false,
		}
	},
	methods: {
		...mapMutations('ToolSettings', ['LoadParameter_Tools_turrent','LoadParameter_Tools_Path_turrent','updateToolAllparas']),
        PowerValue(_torque , _speed){
			return Math.round((_torque * _speed * 10)/9.548)/10;
		},
		//normal
		CircleColor(_spin, _value , _MaxValue ){
			if(_value < _MaxValue * 0.4){
				return "primary";
			}else if(_value < _MaxValue * 0.6){
				return "teal";
			}else if(_value < _MaxValue * 0.8){
				return "amber";
			}else{
				return "red";
			}
		},
		CircleValue(_spin,_value,_maxIdx){
			return Math.round(_value * 100/this.SpindleDatas[_spin].GUI_Setting.MaxValue[_maxIdx]);
		},
		SpindleClass(_index){
			return (_index==0 || _index==2) ?'pt-12' :'';
		},
		MapSpindleValue(_spinNum , _type){
			if(isNaN(this.spindles) == false)return 0;
			if(_spinNum == 0) _spinNum=1;
			else if(_spinNum == 1) _spinNum = 0;
			switch(_type){
				case 0:
					return Math.abs(this.spindles[_spinNum].t1);
				case 1:
					return Math.abs((this.spindles[_spinNum].t3).toFixed(1));
				case 2:
					return Math.abs((this.spindles[_spinNum].t5 /100).toFixed(2));
				case 3:
					return Math.abs(this.spindles[_spinNum].t6);
			}
			return 0;
		},
		randomData(){
			console.log(this.status);

		},
		
		GetModeIndex(){
			let _Idx = this.ModesInfoDatas.indexOf(this.machineMode);
			if(_Idx > -1) return _Idx;
			else return 0;
		},
		GetVisible_forGUI(_kindIdx){
			//SpindleModeSetting  visible
			return this.SpindleModeSetting[this.GetModeIndex()].visible[_kindIdx];
		},
		GetVisible(){
            for(let i=0 ; i<this.SpindleDatas.length ; i++){
				//GUI Setting
				this.SpindleDatas[i].GUI_Setting.ModelforItems.length = 0;
                for(let j=0 ; j<this.SpindleDatas[i].GUI_Setting.visible.length ; j++){
                    if(this.SpindleDatas[i].GUI_Setting.visible[j]){
                        if(this.SpindleDatas[i].GUI_Setting.ModelforItems.indexOf(this.SpidleInfoDatas[j]) == -1)
                            this.SpindleDatas[i].GUI_Setting.ModelforItems.push(this.SpidleInfoDatas[j]);
                    }
                }
				//Mode visible
				this.SpindleDatas[i].GUI_Setting.ModelforModes.length = 0;
				for(let j=0 ; j<this.ModesInfoDatasForItem.length ; j++){
                    if(this.SpindleModeSetting[j].visible[i]){
						if(this.SpindleDatas[i].GUI_Setting.ModelforModes.indexOf(this.ModesInfoDatasForItem[j]) == -1)
						this.SpindleDatas[i].GUI_Setting.ModelforModes.push(this.ModesInfoDatasForItem[j]);                            
                    }
                }
            }
            this.sheet_LimitSet = true;
        },
        Setvisible(){
            let _index = -1;
            for(let i=0 ; i<this.SpindleDatas.length ; i++){
				//GUI Setting
                this.SpindleDatas[i].GUI_Setting.visible.fill(false)
                for(let j=0 ; j<this.SpindleDatas[i].GUI_Setting.ModelforItems.length ; j++){
                    _index = this.SpidleInfoDatas.indexOf(this.SpindleDatas[i].GUI_Setting.ModelforItems[j]);
                    if(_index > -1){
                        this.SpindleDatas[i].GUI_Setting.visible[_index] = true;
                    }
                }
				//Mode visible
				this.SpindleModeSetting[0].visible[i] = false;
				this.SpindleModeSetting[1].visible[i] = false;
				this.SpindleModeSetting[2].visible[i] = false;
                for(let j=0 ; j<this.SpindleDatas[i].GUI_Setting.ModelforModes.length ; j++){
                    _index = this.ModesInfoDatasForItem.indexOf(this.SpindleDatas[i].GUI_Setting.ModelforModes[j]);
                    if(_index > -1){
						this.SpindleModeSetting[_index].visible[i] = true;
                    }
                }
            }
            //Save and Leave
            this.sheet_LimitSet = false;
        },
	},
	
}
</script>
