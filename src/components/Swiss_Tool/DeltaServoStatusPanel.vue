<template>
	<div>
        <v-row>
            <v-col>
                <v-card
                color="#2DDAF0"
                dark
                >
                    <v-card-title>
                        <h2>All Servo Control</h2>
                    </v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col
                            xs="12" sm="12" md="12" lg="12" xl="12">
                                <v-btn
                                @click="setPower(1,true)"
                                class="ml-2"
                                x-large
                                color="primary">
                                    On
                                </v-btn>
                                <v-btn
                                @click="setPower(1,false)"
                                class="ml-12"
                                x-large
                                color="error">
                                    Off
                                </v-btn>
                                <v-btn
                                @click="setPower(2,false)"
                                class="ml-12"
                                x-large
                                color="warning">
                                    Reset
                                </v-btn>
                            </v-col>
                        </v-row>
                       
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
		<v-row>
            <template
            v-for="(deltaServo, i) in DeltaServoParameter"
            >
                <v-col 
                :key="`deltaServo-${i}`"
                xs="12" sm="12" md="12" lg="4" xl="4">
                    <v-card
                    :color="ShowServoStatus(i)=='NORMAL'? '#26c6da' : 'pink'"
                    dark
                        >
                        <v-card-title>
                        <v-icon
                            large
                            left
                        >
                            mdi-arrow-right-drop-circle
                        </v-icon>
                        <span class="title font-weight-light">{{deltaServo.paraname}}</span>
                        </v-card-title>

                        <v-card-text class="headline font-weight-bold">
                            {{ShowServoStatus(i)}}
                            <v-container
                                fluid>
                                <v-row>
                                    <v-col
                                    xs="12" sm="12" md="12" lg="4" xl="4"
                                    >
                                        <v-btn
                                        @click="GetServoOn(i)"
                                        x-large
                                        color="primary">
                                            On
                                        </v-btn>
                                    </v-col>
                                    <v-col
                                    xs="12" sm="12" md="12" lg="4" xl="4"
                                    >
                                        <v-btn
                                        @click="GetServoOff(i)"
                                        x-large
                                        color="error">
                                            Off
                                        </v-btn>
                                    </v-col>
                                    <v-col
                                    xs="12" sm="12" md="12" lg="4" xl="4"
                                    >
                                        <v-btn
                                        @click="GetServoReset(i)"
                                        x-large
                                        color="warning">
                                            Reset
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                    </v-card>
                </v-col>
            </template>
		</v-row>
	</div>
	
	
</template>


<script>
'use strict'

import { mapActions   , mapState } from 'vuex'
import Path from '../../utils/path.js'

export default {
    computed: {
        //this.move.axes  babystep
		...mapState('machine/model', ['move']),  
	},
	methods:{
        ...mapActions('machine', ['sendCode']),
        async setPower(_no, _value) {
            if(this.isSending)return;
            this.isSending = true;
            //
            if(_no == 1){
                //
                let filename = "";
                if(_value)filename = Path.combine(this.directory, "0_Servo1_On.g");
                else filename = Path.combine(this.directory, "0_Servo1_Off.g");
                //console.log(filename);
                await this.sendCode({ code: `M98 P"${filename}"`, log: false });
            }else if(_no == 2){
                let filename = Path.combine(this.directory, "0_Servo_RESET.g");
                await this.sendCode({ code: `M98 P"${filename}"`, log: false });
            }else if(_no == 3){
                await this.sendCode({ code: _value ? 'M106 P4 S255' : 'M106 P4 S0', log: false });
            }
            //
            this.isSending = false;            
        },
        async GetServoOn(_no) {
            _no++;
            let _back = "M118 P1 S";
            _back += `"` + ":C " + this.padLeft(_no,2) + "0602140001" + `"`;
            //console.log(_back);
            await this.sendCode({ code: _back, log: false });
        },
        async GetServoOff(_no) {
            _no++;
            let _back = "M118 P1 S";
            _back += `"` + ":C " + this.padLeft(_no,2) + "0602140101" + `"`;
            await this.sendCode({ code: _back, log: false });
        },
        async GetServoReset(_no) {
            _no++;
            let _back = "";
            _back += `M118 P1 S"` + ":C " + this.padLeft(_no,2) + "06021C0002" + `" \n`;
            _back += `G4 P1000 \n`;
            _back += `M118 P1 S"` + ":C " + this.padLeft(_no,2) + "06021C0102" + `" \n`;
            _back += `G4 P1000 \n`;
            await this.sendCode({ code: _back, log: false });
        },
        padLeft(str, len) {
            str = '' + str;
            if (str.length >= len) {
                return str;
            } else {
                return this.padLeft("0" + str, len);
            }
        },
        ShowServoStatus(_idx){
            if(_idx > 9 || _idx<0 )return "NORMAL";
            else
            {
                if(_idx >= this.move.axes.length){
                    return "UNCONNECT";
                    //return this.AlarmMapping(1);
                }
                else if(this.move.axes[_idx].babystep ==0 ){
                    return "NORMAL";
                }
                else{
                    return String(this.move.axes[_idx].babystep) +":"+ this.AlarmMapping(this.move.axes[_idx].babystep);
                }
            }
        },
        AlarmMapping(_idx){
            switch(_idx){
                case 1:return "Overcurrent";
                case 2:return "Overvoltage";
                case 3:return "Undervoltage";
                case 4:return "Motor combination error";
                case 5:return "Regeneration error";
                case 6:return "Overload";
                case 7:return "Excessive deviation of Speed command";
                case 8:return "Abnormal pulse command ";
                case 9:return "Excessive deviation of Position command ";
                case 16:return "Voltage error during regeneration";
                case 17:return "Encoder error";
                case 18:return "Calibration error";
                case 19:return "Emergency stop";
                case 20:return "Negative limit error";
                case 21:return "Positive limit error";
                case 22:return "Abnormal IGBT temperature";
                case 23:return "EEPROM error";
                case 24:return "Encoder output error";
                case 32:return "Serial communication timeout";
                case 34:return "RST leak phase";
                case 35:return "Early overload warning";
                case 36:return "Encoder initial magnetic field error";
                case 37:return "Encoder internal error";
                case 38:return "Encoder unreliable internal data";
                case 39:return "Encoder internal reset error";
                case 40:return "Battery voltage error or encoder internal error";
                case 41:return "Gray code error";
                case 42:return "Number of revolutions of the encoder is in error";
                case 43:return "Motor data error";
                case 48:return "Motor collision error";
                case 49:return "Motor power cable wiring error / disconnection";
                case 50:return "Abnormal encoder vibration";
                case 52:return "Encoder internal communication error";
                case 53:return "Encoder temperature exceeds the protective range";
                case 54:return "Encoder alarm status error";
                case 66:return "Analog voltage input for Speed command is too high";
                case 68:return "Servo function operational warning";
                case 69:return "E-Gear ratio value error";
                case 72:return "Encoder output error";
                case 83:return "Motor parameters are not confirmed";
                case 86:return "Excessive motor speed";
                case 92:return "Motor position feedback error";
                case 131:return "Servo drive outputs excessive current";
                case 133:return "Regeneration setting error";
                case 134:return "Regenerative resistor overload";
                case 136:return "Servo function operational alarm";
                case 137:return "Current detection interference ";
                default: return "None";
            }            
        },
    },
    data() {
		return {
            isSending : false,
            directory: Path.macros,
            DeltaServoParameter :[
                {//1
                    paraname : "Milling Spindle",
                },
                {//2
                    paraname : "Headstock Spindle",
                },
                {//3
                    paraname : "Tailstock Spindle",
                },
                {//4
                    paraname : "Milling Travel",
                },
                {//5
                    paraname : "Milling Vertical",
                },
                {//6
                    paraname : "Headstock Travel",
                },
                {//7
                    paraname : "Turret Travel",
                },
                {//8
                    paraname : "Tailstock Travel",
                },
                {//9
                    paraname : "Tailstock Harmonic",
                },
                {//10
                    paraname : "Milling Harmonic",
                },
                {//11
                    paraname : "Headstock Harmonic",
                },
            ],
        }
    },
}
</script>
