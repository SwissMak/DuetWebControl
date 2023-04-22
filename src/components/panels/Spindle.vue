<style scoped>
.v-btn-toggle {
	display: flex;
}
.v-btn-toggle > button {
	display: flex;
	flex: 1 1 auto;
}
</style>
<template>
	<v-card>
        <v-btn 
		x-large 
		color="success" 
		@click="UpdateErrorCode_BLDC()"
		v-show="false"
		dark>
			<v-progress-circular
				indeterminate
				color="amber"
				v-show="sendingCode"
			></v-progress-circular>
			<v-icon v-show="!sendingCode">mdi-clipboard-alert</v-icon>
			Update Error Code
		</v-btn> 
		<v-card-title class="pb-0">         
			<v-icon small class="mr-1">mdi-texture</v-icon> Spindle Control
		</v-card-title>
		
		<v-card-text  class="d-flex flex-column pb-0">
			<template
			v-for="(spin, i) in SpindlePara">
				<v-row
				class="pt-6"
				:key="`spin-${i}`">
					<v-col
					align="center"
					sm=12 md=12 lg=4 xl=4>
						<h3>{{spin.spinName}}</h3>
					</v-col>
					<v-col
					align="center"
					sm=12 md=12 lg=4 xl=4>
						<v-btn-toggle v-model="spin._state" mandatory >
							<v-btn text :value="1" @click="SwitchBLDCMode(spin.spinNo,1)" :disabled="spin.PowerOn">
								Orient(M19)
							</v-btn>
							<v-btn text :value="2" @click="SwitchBLDCMode(spin.spinNo,2)" :disabled="spin.PowerOn">
								CCW(M4)
							</v-btn>
							<v-btn text :value="3" @click="SwitchBLDCMode(spin.spinNo,3)" :disabled="spin.PowerOn">
								CW(M3)
							</v-btn>
						</v-btn-toggle>
					</v-col>
					<v-col
					align="center"
					sm=12 md=12 lg=4 xl=4>
						<v-btn-toggle :value="2" mandatory>
							<v-btn text :value="1" @click="togglePower(spin.spinNo,1)">
								ON
							</v-btn>
							<v-btn text :value="2" @click="togglePower(spin.spinNo,2)">
								OFF(M5)
							</v-btn>
							<!-- <v-btn text :value="3" @click="togglePower(spin.spinNo,3)">
								clear
							</v-btn> -->
						</v-btn-toggle>
					</v-col>
				</v-row>
				<v-row
				:key="`spider-${i}`">
					<slider :value=0 @input="setSpindleSpeed(spin.spinNo, $event)" :max="spin.MaxValue" ></slider>
				</v-row>
			</template>			
		</v-card-text>
	</v-card>
</template>

<script>
'use strict'

import { mapActions,mapState } from 'vuex'

export default {
	computed: {
		...mapState('machine/model', {
			machineMode: state => state.state.machineMode,
		}),
	},
	props: {
		showWhat: {
			type: Number,
            default: 0,
		},
	},
	data() {
		return {
			sendingCode: false,
			SpindlePara: [
				{
					spinName:"Milling Spindle",
					spinNo:0,
					MaxValue:24000,
					PowerOn:false,
					_state:3,
				},
				{
					spinName:"Headstock Spindle",
					spinNo:1,
					MaxValue:3600,
					PowerOn:false,
					_state:3,
				},
				{
					spinName:"Tailstock Spindle",
					spinNo:2,
					MaxValue:3600,
					PowerOn:false,
					_state:3,
				},
			],
			BLDC_Alarm_Milling: [
				{strcontent:""},
				{strcontent:""},
				{strcontent:""},
				{strcontent:""}
			],
			BLDC_Alarm_Head: [
				{strcontent:""},
				{strcontent:""},
				{strcontent:""},
				{strcontent:""}
			],
			BLDC_Alarm_Trail: [
				{strcontent:""},
				{strcontent:""},
				{strcontent:""},
				{strcontent:""}
			],
			error_code:0,
			BLDC_Axis_Error: [
				{ code: 1 , strcontent: 'AXIS_ERROR_INVALID_STATE'},
				{ code: 2 , strcontent: 'AXIS_ERROR_DC_BUS_UNDER_VOLTAGE'},
				{ code: 4 , strcontent: 'AXIS_ERROR_DC_BUS_OVER_VOLTAGE'},
				{ code: 8 , strcontent: 'AXIS_ERROR_CURRENT_MEASUREMENT_TIMEOUT'},
				{ code: 10 , strcontent: 'AXIS_ERROR_BRAKE_RESISTOR_DISARMED'},
				{ code: 20 , strcontent: 'AXIS_ERROR_MOTOR_DISARMED'},
				{ code: 40 , strcontent: 'AXIS_ERROR_MOTOR_FAILED'},
				{ code: 80 , strcontent: 'AXIS_ERROR_SENSORLESS_ESTIMATOR_FAILED'},
				{ code: 100 , strcontent: 'AXIS_ERROR_ENCODER_FAILED'},
				{ code: 200 , strcontent: 'AXIS_ERROR_CONTROLLER_FAILED'},
				{ code: 400 , strcontent: 'AXIS_ERROR_POS_CTRL_DURING_SENSORLESS'},
				{ code: 800 , strcontent: 'AXIS_ERROR_WATCHDOG_TIMER_EXPIRED'},
				{ code: 1000 , strcontent: 'AXIS_ERROR_MIN_ENDSTOP_PRESSED'},
				{ code: 2000 , strcontent: 'AXIS_ERROR_MAX_ENDSTOP_PRESSED'},
				{ code: 4000 , strcontent: 'AXIS_ERROR_ESTOP_REQUESTED'},
				{ code: 20000 , strcontent: 'AXIS_ERROR_HOMING_WITHOUT_ENDSTOP'},
				{ code: 40000 , strcontent: 'AXIS_ERROR_OVER_TEMP'}
			],
			BLDC_Motor_Error: [
				{ code: 1 , strcontent: 'MOTOR_ERROR_PHASE_RESISTANCE_OUT_OF_RANGE'},
				{ code: 2 , strcontent: 'MOTOR_ERROR_PHASE_INDUCTANCE_OUT_OF_RANGE'},
				{ code: 4 , strcontent: 'MOTOR_ERROR_ADC_FAILED'},
				{ code: 8 , strcontent: 'MOTOR_ERROR_DRV_FAULT'},
				{ code: 10 , strcontent: 'MOTOR_ERROR_CONTROL_DEADLINE_MISSED'},
				{ code: 20 , strcontent: 'MOTOR_ERROR_NOT_IMPLEMENTED_MOTOR_TYPE'},
				{ code: 40 , strcontent: 'MOTOR_ERROR_BRAKE_CURRENT_OUT_OF_RANGE'},
				{ code: 80 , strcontent: 'MOTOR_ERROR_MODULATION_MAGNITUDE'},
				{ code: 100 , strcontent: 'MOTOR_ERROR_BRAKE_DEADTIME_VIOLATION'},
				{ code: 200 , strcontent: 'MOTOR_ERROR_UNEXPECTED_TIMER_CALLBACK'},
				{ code: 400 , strcontent: 'MOTOR_ERROR_CURRENT_SENSE_SATURATION'},
				{ code: 1000 , strcontent: 'MOTOR_ERROR_CURRENT_LIMIT_VIOLATION'},
				{ code: 2000 , strcontent: 'MOTOR_ERROR_BRAKE_DUTY_CYCLE_NAN'},
				{ code: 4000 , strcontent: 'MOTOR_ERROR_DC_BUS_OVER_REGEN_CURRENT'},
				{ code: 8000 , strcontent: 'MOTOR_ERROR_DC_BUS_OVER_CURRENT'}
			],
			BLDC_Controller_Error: [
				{ code: 1 , strcontent: 'CONTROLLER_ERROR_OVERSPEED'},
				{ code: 2 , strcontent: 'CONTROLLER_ERROR_INVALID_INPUT_MODE'},
				{ code: 4 , strcontent: 'CONTROLLER_ERROR_UNSTABLE_GAIN'},
				{ code: 8 , strcontent: 'CONTROLLER_ERROR_INVALID_MIRROR_AXIS'},
				{ code: 10 , strcontent: 'CONTROLLER_ERROR_INVALID_LOAD_ENCODER'},
				{ code: 20 , strcontent: 'CONTROLLER_ERROR_INVALID_ESTIMATE'}
			],
			BLDC_Encoder_Error: [
				{ code: 1 , strcontent: 'ENCODER_ERROR_UNSTABLE_GAIN'},
				{ code: 2 , strcontent: 'ENCODER_ERROR_CPR_POLEPAIRS_MISMATCH'},
				{ code: 4 , strcontent: 'ENCODER_ERROR_NO_RESPONSE'},
				{ code: 8 , strcontent: 'ENCODER_ERROR_UNSUPPORTED_ENCODER_MODE'},
				{ code: 10 , strcontent: 'ENCODER_ERROR_ILLEGAL_HALL_STATE'},
				{ code: 20 , strcontent: 'ENCODER_ERROR_INDEX_NOT_FOUND_YET'},
				{ code: 40 , strcontent: 'ENCODER_ERROR_ABS_SPI_TIMEOUT'},
				{ code: 80 , strcontent: 'ENCODER_ERROR_ABS_SPI_COM_FAIL'},
				{ code: 100 , strcontent: 'ENCODER_ERROR_ABS_SPI_NOT_READY'}
			]
		}
	},	
	methods: {
		...mapActions('machine', ['sendCode']),
		async setSpindleSpeed(spindle_num, value) {
			if(!this.SpindlePara[spindle_num].PowerOn)return;
			switch (spindle_num) {
				case 0:
					switch (this.SpindlePara[spindle_num]._state) {
						case 1:
							await this.sendCode(`M19 B${value}`);
							break;
						case 2:
							await this.sendCode(`M4 B${value}`);
							break;
						case 3:
							await this.sendCode(`M3 B${value}`);
							break;
					}
					break;
				case 1:{
					let _code = (this.machineMode == "Milling Mode") ? "A" : "C";
					switch (this.SpindlePara[spindle_num]._state) {
						case 1:
							await this.sendCode(`M19 ${_code}${value}`);
							break;
						case 2:
							await this.sendCode(`M4 ${_code}${value}`);
							break;
						case 3:
							await this.sendCode(`M3 ${_code}${value}`);							
							break;
					}
					break;
				}
				case 2:
				{
					let _code = (this.machineMode == "Milling Mode") ? "C" : "A";
					switch (this.SpindlePara[spindle_num]._state) {
						case 1:
							await this.sendCode(`M19 ${_code}${value}`);
							break;
						case 2:
							await this.sendCode(`M4 ${_code}${value}`);
							break;
						case 3:
							await this.sendCode(`M3 ${_code}${value}`);
							break;
					}
					break;
				}
				default:
					return;				
			}
		},
		GetConsole(){
			// console.log(this.BLDC_Axis_Error.filter(BLDC_Axis_Error => BLDC_Axis_Error.code == 10)[0]);
		},
		SwitchData(BLDC_part_code,part_type,_error_code) {
			let return_str = "";		
			let getErrorDetail="";	
			if(_error_code==0){
				switch (BLDC_part_code) {
				case 0:
					this.BLDC_Alarm_Milling[part_type].strcontent = "";
					break;
				case 1:
					this.BLDC_Alarm_Head[part_type].strcontent = "";
					break;
				case 2:
					this.BLDC_Alarm_Trail[part_type].strcontent = "";
					break;
				default:
					return;
				} 
				return;
			}		
			switch (part_type) {
				case 0:
					for(let i=0 ; i<this.BLDC_Axis_Error.length;i++){
						if(this.BLDC_Axis_Error[i].code == _error_code)
						{
							getErrorDetail = this.BLDC_Axis_Error[i].strcontent;
							break;
						}
					}
					break;
				case 1:
					for(let i=0 ; i<this.BLDC_Motor_Error.length;i++){
						if(this.BLDC_Motor_Error[i].code == _error_code)
						{
							getErrorDetail = this.BLDC_Motor_Error[i].strcontent;
							break;
						}
					}
					break;
				case 2:
					for(let i=0 ; i<this.BLDC_Controller_Error.length;i++){
						if(this.BLDC_Controller_Error[i].code == _error_code)
						{
							getErrorDetail = this.BLDC_Controller_Error[i].strcontent;
							break;
						}
					}
					break;
				case 3:
					for(let i=0 ; i<this.BLDC_Encoder_Error.length;i++){
						if(this.BLDC_Encoder_Error[i].code == _error_code)
						{
							getErrorDetail = this.BLDC_Encoder_Error[i].strcontent;
							break;
						}
					}
					break;
				default:
					getErrorDetail = "";
					break;
			} 
			if(getErrorDetail=="")return_str +=_error_code;
			else return_str +=getErrorDetail;
			
			if(return_str=="")return;
			switch (BLDC_part_code) {
				case 0:
					this.BLDC_Alarm_Milling[part_type].strcontent = return_str;
					break;
				case 1:
					this.BLDC_Alarm_Head[part_type].strcontent = return_str;
					break;
				case 2:
					this.BLDC_Alarm_Trail[part_type].strcontent = return_str;
					break;
				default:
					return;
			} 			
		},
		async togglePower(spindle_num,state) {
			if (!this.sendingCode) {
				let _command = null;
				this.sendingCode = true;
				try {
					let spindlecode = "";
					if(spindle_num == 0){
						spindlecode = "B";
					}else if(spindle_num == 1){
						spindlecode = (this.machineMode == "Milling Mode") ? "A" : "C";
					}else if(spindle_num == 2){
						spindlecode = (this.machineMode == "Milling Mode") ? "C" : "A";
					}
					
					switch (state) {
						case 1:	
							//on
							this.SpindlePara[spindle_num].PowerOn = true;
							break;
						case 2:
							//off
							this.SpindlePara[spindle_num].PowerOn = false;
							_command = "M5"+" "+ spindlecode;
							// console.log(_command);
							// await this.sendCode({ code: _command, log: false }); 
							await this.sendCode(_command);
							break;
						case 3:
							//clear
							//idle
							//await this.sendCode({ code: `M118 S"M84${Mcode} A(sr)"`, log: false });
							break;
						default:
							return;				
					}
				} catch (e) {
					console.log(e);
				}
				this.sendingCode = false;
			}
		},
		async SwitchBLDCMode(spindle_num,state) {
			if (!this.sendingCode) {
				this.sendingCode = true;
				try {
					this.SpindlePara[spindle_num]._state = state;
					if(state == 1){
						this.SpindlePara[spindle_num].MaxValue=360;						
					}
					else if(spindle_num==0){
						this.SpindlePara[spindle_num].MaxValue=24000;						
					}
					else{
						this.SpindlePara[spindle_num].MaxValue=3600;						
					}
				} catch (e) {
					// handled before we get here
				}
				this.sendingCode = false;
			}
		},
		SendErrorCode(_value){
			let tmpstr = null;
			try {	
				tmpstr = _value.split("\n");
				(tmpstr.length > 2) ? tmpstr=parseInt(parseInt(tmpstr[2]).toString(16)) : tmpstr=0 ;
				return tmpstr;
			} catch (error) {
				console.log(error);
			}			
		},
		async UpdateErrorCode_BLDC(){
			if (this.sendingCode) return;
			this.sendingCode = true;
			//
			let tmpstr = null;
			let _command = null;
			//Milling
			_command = `M118 S"M842 A(r axis0.error)"`;
			tmpstr = await this.sendCode({ code: _command, log: false });
			tmpstr = this.SendErrorCode(tmpstr);
			this.SwitchData(0,0,tmpstr);
			_command = `M118 S"M842 A(r axis0.motor.error)"`;
			tmpstr = await this.sendCode({ code: _command, log: false });
			tmpstr = this.SendErrorCode(tmpstr);
			this.SwitchData(0,1,tmpstr);
			_command = `M118 S"M842 A(r axis0.controller.error)"`;
			tmpstr = await this.sendCode({ code: _command, log: false });
			tmpstr = this.SendErrorCode(tmpstr);
			this.SwitchData(0,2,tmpstr);
			_command = `M118 S"M842 A(r axis0.encoder.error)"`;
			tmpstr = await this.sendCode({ code: _command, log: false });
			tmpstr = this.SendErrorCode(tmpstr);
			this.SwitchData(0,3,tmpstr);				
			//head
			_command = `M118 S"M840 A(r axis0.error)"`;
			tmpstr = await this.sendCode({ code: _command, log: false });
			tmpstr = this.SendErrorCode(tmpstr);
			this.SwitchData(1,0,tmpstr);
			_command = `M118 S"M840 A(r axis0.motor.error)"`;
			tmpstr = await this.sendCode({ code: _command, log: false });
			tmpstr = this.SendErrorCode(tmpstr);
			this.SwitchData(1,1,tmpstr);
			_command = `M118 S"M840 A(r axis0.controller.error)"`;
			tmpstr = await this.sendCode({ code: _command, log: false });
			tmpstr = this.SendErrorCode(tmpstr);
			this.SwitchData(1,2,tmpstr);
			_command = `M118 S"M840 A(r axis0.encoder.error)"`;
			tmpstr = await this.sendCode({ code: _command, log: false });
			tmpstr = this.SendErrorCode(tmpstr);
			this.SwitchData(1,3,tmpstr);		
			//tail
			_command = `M118 S"M840 A(r axis1.error)"`;
			tmpstr = await this.sendCode({ code: _command, log: false });
			tmpstr = this.SendErrorCode(tmpstr);
			this.SwitchData(2,0,tmpstr);
			_command = `M118 S"M840 A(r axis1.motor.error)"`;
			tmpstr = await this.sendCode({ code: _command, log: false });
			tmpstr = this.SendErrorCode(tmpstr);
			this.SwitchData(2,1,tmpstr);
			_command = `M118 S"M840 A(r axis1.controller.error)"`;
			tmpstr = await this.sendCode({ code: _command, log: false });
			tmpstr = this.SendErrorCode(tmpstr);
			this.SwitchData(2,2,tmpstr);
			_command = `M118 S"M840 A(r axis1.encoder.error)"`;
			tmpstr = await this.sendCode({ code: _command, log: false });
			tmpstr = this.SendErrorCode(tmpstr);
			this.SwitchData(2,3,tmpstr);
			//
			this.sendingCode = false;	
		}
	}
}
</script>