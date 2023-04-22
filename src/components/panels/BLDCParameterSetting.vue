<style scoped>
.spindleDatas {
	position: relative;
}

</style>

<template>
    <v-card class="pb-5" >  
        <v-container>
            <v-row dense>
                <v-col
                cols="12"
                class="mt-5"
                >
                    <v-btn 
                    x-large 
                    color="success" 
                    @click="GetBLDCDatas()"
                    dark>
                    <v-progress-circular
                        indeterminate
                        color="amber"
                        v-show="isSending"
                    ></v-progress-circular>    
                    <v-icon v-show="!isSending">mdi-inbox-arrow-down</v-icon> Get                   
                       Update Data
                    </v-btn>
                </v-col>
                <v-col
                cols="12"
                class="mt-5"
                >
                    <v-btn 
                    x-large 
                    color="success" 
                    @click="SaveConfig()"
                    dark>
                       Save Configuration and Reboot
                    </v-btn>  
                </v-col>
                <v-col
                cols="12"
                class="mt-5"
                >
                    <div>
                        <v-combobox v-on:change="ChooseSpindle_fun($event.value)" label="Spindle Choose" dense hide-selected :items="SpindleNames" v-model="ChooseSpindle"></v-combobox>
                    </div>
                </v-col>
                <v-col
                v-for="(spindle, i) in SpindleDatas"
                :key="i"
                cols="12"
                class="spindleDatas"
                >
                    <v-card
                    :color="spindle.color"
                    >                        
                        <v-card-title
                        class="headline"
                        v-text="spindle.SpiName"
                        v-if="spindle.visible"
                        ></v-card-title>
                        <v-card-text  class="d-flex flex-column pb-0" v-if="spindle.visible">
                            <v-row>
                                <v-col>
                                    <v-btn x-large color="success" dark @click="UpdateVPT(0)">                                        
                                        <v-icon>mdi-history</v-icon>
                                    </v-btn>
                                </v-col>
                                <v-col>
                                    <v-btn x-large color="success" dark @click="UpdateVPT(1)">                                        
                                        <v-icon>mdi-history</v-icon>
                                    </v-btn>
                                </v-col>
                                <v-col>
                                    <v-btn x-large color="success" dark @click="UpdateVPT(2)">                                        
                                        <v-icon>mdi-history</v-icon>
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <v-btn x-large color="success" dark @click="Get_single_Velocity()">
                                        Velocity：{{spindle.Datas.nowvel}} RPM
                                    </v-btn>
                                </v-col>
                                <v-col>
                                    <v-btn x-large color="success" dark @click="Get_single_Position()">
                                        Position：{{spindle.Datas.nowpos}} &deg;
                                    </v-btn>
                                </v-col>
                                <v-col>
                                    <v-btn x-large color="success" dark @click="Get_single_Torque()">
                                        Torque：{{spindle.Datas.nowtoq}} N．M
                                    </v-btn> 
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <v-combobox v-on:change="SendAxis_State($event.value)" label="Axis State" dense hide-selected :items="Axis_State_items" v-model="spindle.Datas.nowStateItem"></v-combobox>
                                </v-col>
                                <v-col>
                                    <v-combobox v-on:change="SendCtl_Mode($event.value)" label="Control Mode" dense hide-selected :items="Control_Mode_items" v-model="spindle.Datas.nowCtlModeItem"></v-combobox>
                                </v-col>
                                <v-col>
                                    <v-combobox v-on:change="SendInput_Mode($event.value)" label="Input Mode" dense hide-selected :items="Input_Mode_items" v-model="spindle.Datas.nowInputModeItem"></v-combobox>
                                </v-col>                                
                            </v-row>
                            <v-row>
                                <v-col>
                                    <v-text-field v-model="spindle.Datas.input_vel" label="Input Velocity(0-6000 rpm)" prepend-icon="mdi-run-fast"></v-text-field>         
                                </v-col>
                                <v-col>
                                    <v-btn color="info" @click="SendVel(spindle.Datas.input_vel)">
                                        <v-icon>mdi-shuffle-variant</v-icon> {{ $t('input.code.send') }} 
                                    </v-btn>
                                </v-col>
                                <v-col>
                                    <v-text-field v-model="spindle.Datas.input_pos" label="Input Position(0.0-360.0 angle)" prepend-icon="mdi-speedometer"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-btn color="info" @click="SendPos(spindle.Datas.input_pos)">
                                        <v-icon>mdi-shuffle-variant</v-icon> {{ $t('input.code.send') }} 
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <v-row>
                                <!-- pos_gain -->
                                <v-col>
                                    <v-text-field v-model="spindle.Datas.pos_gain" label="Position Gain" prepend-icon="mdi-gamepad-variant"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-btn color="info" @click="Pos_gain()">
                                        <v-icon>mdi-inbox-arrow-down</v-icon> Get
                                    </v-btn>
                                    <v-btn color="info" @click="Pos_gain(spindle.Datas.pos_gain)">
                                        <v-icon>mdi-shuffle-variant</v-icon> {{ $t('input.code.send') }} 
                                    </v-btn>
                                </v-col>
                                <!-- vel_gain -->
                                <v-col>
                                    <v-text-field v-model="spindle.Datas.vel_gain" label="Velocity Gain" prepend-icon="mdi-gamepad-variant"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-btn color="info" @click="Vel_gain()">
                                        <v-icon>mdi-inbox-arrow-down</v-icon> Get
                                    </v-btn>
                                    <v-btn color="info" @click="Vel_gain(spindle.Datas.vel_gain)">
                                        <v-icon>mdi-shuffle-variant</v-icon> {{ $t('input.code.send') }} 
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <v-row>
                                <!-- vel_integrator_gain -->
                                <v-col>
                                    <v-text-field v-model="spindle.Datas.vel_integrator_gain" label="Vel Integrator Gain" prepend-icon="mdi-gamepad-variant"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-btn color="info" @click="Vel_Integrator_gain()">
                                        <v-icon>mdi-inbox-arrow-down</v-icon> Get
                                    </v-btn>
                                    <v-btn color="info" @click="Vel_Integrator_gain(spindle.Datas.vel_integrator_gain)">
                                        <v-icon>mdi-shuffle-variant</v-icon> {{ $t('input.code.send') }} 
                                    </v-btn>
                                </v-col>
                                <!-- current limit -->
                                <v-col>
                                    <v-text-field v-model="spindle.Datas.current_lim" label="Current Limit" prepend-icon="mdi-gamepad-variant"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-btn color="info" @click="Current_Limit()">
                                        <v-icon>mdi-inbox-arrow-down</v-icon> Get
                                    </v-btn>
                                    <v-btn color="info" @click="Current_Limit(spindle.Datas.current_lim)">
                                        <v-icon>mdi-shuffle-variant</v-icon> {{ $t('input.code.send') }} 
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <v-row>
                                <!-- vel limit -->
                                <v-col>
                                    <v-text-field v-model="spindle.Datas.vel_limit" label="Vel Limit" prepend-icon="mdi-gamepad-variant"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-btn color="info" @click="Vel_Limit()">
                                        <v-icon>mdi-inbox-arrow-down</v-icon> Get
                                    </v-btn>
                                    <v-btn color="info" @click="Vel_Limit(spindle.Datas.vel_limit)">
                                        <v-icon>mdi-shuffle-variant</v-icon> {{ $t('input.code.send') }} 
                                    </v-btn>
                                </v-col>
                                <!-- trap_traj.config.vel_limit -->
                                <v-col>
                                    <v-text-field v-model="spindle.Datas.trap_traj_vel_limit" label="Trap Traj Vel Limit" prepend-icon="mdi-gamepad-variant"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-btn color="info" @click="Trap_Traj_vel_limit()">
                                        <v-icon>mdi-inbox-arrow-down</v-icon> Get
                                    </v-btn>
                                    <v-btn color="info" @click="Trap_Traj_vel_limit(spindle.Datas.trap_traj_vel_limit)">
                                        <v-icon>mdi-shuffle-variant</v-icon> {{ $t('input.code.send') }} 
                                    </v-btn>
                                </v-col>                             
                            </v-row>
                            <v-row>
                                <!-- trap_traj.config.accel_limit -->
                                <v-col>
                                    <v-text-field v-model="spindle.Datas.trap_traj_accel_limit" label="Trap Traj Accel Limit" prepend-icon="mdi-gamepad-variant"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-btn color="info" @click="Trap_Traj_accel_limit()">
                                        <v-icon>mdi-inbox-arrow-down</v-icon> Get
                                    </v-btn>
                                    <v-btn color="info" @click="Trap_Traj_accel_limit(spindle.Datas.trap_traj_accel_limit)">
                                        <v-icon>mdi-shuffle-variant</v-icon> {{ $t('input.code.send') }} 
                                    </v-btn>
                                </v-col>
                                <!-- trap_traj.config.decel_limit -->
                                <v-col>
                                    <v-text-field v-model="spindle.Datas.trap_traj_decel_limit" label="Trap Traj Decel Limit" prepend-icon="mdi-gamepad-variant"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-btn color="info" @click="Trap_Traj_decel_limit()">
                                        <v-progress-circular
                                            indeterminate
                                            color="amber"
                                            v-show="isSending"
                                        ></v-progress-circular>   
                                        <v-icon v-show="!isSending">mdi-inbox-arrow-down</v-icon> Get
                                    </v-btn>
                                    <v-btn color="info" @click="Trap_Traj_decel_limit(spindle.Datas.trap_traj_decel_limit)">
                                        <v-icon>mdi-shuffle-variant</v-icon> {{ $t('input.code.send') }} 
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <v-row>
                                <!-- enable_gain_scheduling -->
                                <v-col>
                                    Enable Gain Scheduling                                    
                                </v-col>
                                <v-col>
                                    <v-btn-toggle v-model="spindle.Datas.enable_gain_scheduling" mandatory color="green">
                                        <v-btn text value=1 @click="Enable_Gain_Scheduling(1)" >
                                            On
                                        </v-btn>
                                        <v-btn text value=0 @click="Enable_Gain_Scheduling(0)">
                                            Off
                                        </v-btn>
                                    </v-btn-toggle>
                                </v-col>
                                <!-- gain_scheduling_width -->
                                <v-col>
                                    <v-text-field v-model="spindle.Datas.gain_scheduling_width" label="Gain Scheduling Width" prepend-icon="mdi-gamepad-variant"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-btn color="info" @click="Gain_Scheduling_Width()">
                                        <!-- <v-progress-circular
                                            indeterminate
                                            color="amber"
                                            v-show="isSending"
                                        ></v-progress-circular>    
                                        <v-icon v-show="!isSending">mdi-inbox-arrow-down</v-icon> Get
                                        -->
                                        <v-icon>mdi-inbox-arrow-down</v-icon> Get
                                    </v-btn>
                                    <v-btn color="info" @click="Gain_Scheduling_Width(spindle.Datas.gain_scheduling_width)">
                                        <v-icon>mdi-shuffle-variant</v-icon> {{ $t('input.code.send') }} 
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <v-row>
                                <!-- offset -->
                                <v-col>
                                    <v-text-field v-model="spindle.Datas.offset" label="Offset" prepend-icon="mdi-gamepad-variant"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-btn color="info" @click="Encoder_Offset()">
                                        <v-icon>mdi-inbox-arrow-down</v-icon> Get
                                    </v-btn>
                                    <v-btn color="info" @click="Encoder_Offset(spindle.Datas.offset)">
                                        <v-icon>mdi-shuffle-variant</v-icon> {{ $t('input.code.send') }} 
                                    </v-btn>
                                </v-col>
                                <!-- pre_calibrated -->
                                <v-col>
                                    Pre Calibrated
                                </v-col>
                                <v-col>
                                    <v-btn-toggle v-model="spindle.Datas.pre_calibrated" mandatory color="green">
                                        <v-btn text value=1 @click="Pre_Calibrated(1)" >
                                            On
                                        </v-btn>
                                        <v-btn text value=0 @click="Pre_Calibrated(0)">
                                            Off
                                        </v-btn>
                                    </v-btn-toggle>
                                </v-col>
                            </v-row>
                            <v-row>
                                <!-- config_.vel_ramp_rate -->
                                <v-col>
                                    <v-text-field v-model="spindle.Datas.vel_ramp_rate" label="Vel Ramp Rate" prepend-icon="mdi-gamepad-variant"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-btn color="info" @click="Vel_ramp_rate_()">
                                        <v-icon>mdi-inbox-arrow-down</v-icon> Get
                                    </v-btn>
                                    <v-btn color="info" @click="Vel_ramp_rate_(spindle.Datas.vel_ramp_rate)">
                                        <v-icon>mdi-shuffle-variant</v-icon> {{ $t('input.code.send') }} 
                                    </v-btn>
                                </v-col>
                                <!-- config_.inertia -->
                                <v-col>
                                    <v-text-field v-model="spindle.Datas.inertia" label="Inertia" prepend-icon="mdi-gamepad-variant"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-btn color="info" @click="Inertia_()">
                                        <v-icon>mdi-inbox-arrow-down</v-icon> Get
                                    </v-btn>
                                    <v-btn color="info" @click="Inertia_(spindle.Datas.inertia)">
                                        <v-icon>mdi-shuffle-variant</v-icon> {{ $t('input.code.send') }} 
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <v-row>
                                <!-- Axis.config_.turns_per_step -->
                                <v-col>
                                    <v-text-field v-model="spindle.Datas.turns_per_step" label="turns_per_step" prepend-icon="mdi-gamepad-variant"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-btn color="info" @click="Turns_per_step()">
                                        <v-icon>mdi-inbox-arrow-down</v-icon> Get
                                    </v-btn>
                                    <v-btn color="info" @click="Turns_per_step(spindle.Datas.turns_per_step)">
                                        <v-icon>mdi-shuffle-variant</v-icon> {{ $t('input.code.send') }} 
                                    </v-btn>
                                </v-col>
                                <!-- config_.inertia -->
                                <v-col>
                                    
                                </v-col>
                                <v-col>

                                </v-col>
                            </v-row>
                            <v-row>
                                <!-- Axis.config_.axis_to_mirror   -->
                                <v-col>
                                    <v-text-field v-model="spindle.Datas.axis_to_mirror" label="axis_to_mirror" prepend-icon="mdi-gamepad-variant"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-btn color="info" @click="Axis_to_mirror()">
                                        <v-icon>mdi-inbox-arrow-down</v-icon> Get
                                    </v-btn>
                                    <v-btn color="info" @click="Axis_to_mirror(spindle.Datas.axis_to_mirror)">
                                        <v-icon>mdi-shuffle-variant</v-icon> {{ $t('input.code.send') }} 
                                    </v-btn>
                                </v-col>
                                <!-- Axis.config_.mirror_ratio     -->
                                <v-col>
                                    <v-text-field v-model="spindle.Datas.mirror_ratio" label="mirror_ratio" prepend-icon="mdi-gamepad-variant"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-btn color="info" @click="Mirror_ratio()">
                                        <v-icon>mdi-inbox-arrow-down</v-icon> Get
                                    </v-btn>
                                    <v-btn color="info" @click="Mirror_ratio(spindle.Datas.mirror_ratio)">
                                        <v-icon>mdi-shuffle-variant</v-icon> {{ $t('input.code.send') }} 
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>                    
                </v-col>
            </v-row>
        </v-container>      
	</v-card>    
</template>

<script>
//
//set_linear_count(0)
'use strict'
import { mapActions,mapState} from 'vuex'
const Axis_State_items_const = [
    {text: "UNDEFINED",value:0},
    {text: "IDLE",value:1},
    {text: "FULL_CALIBRATION_SEQUENCE",value:3},
    {text: "MOTOR_CALIBRATION",value:4},
    {text: "SENSORLESS_CONTROL",value:5},
    {text: "ENCODER_INDEX_SEARCH",value:6},
    {text: "ENCODER_OFFSET_CALIBRATION",value:7},
    {text: "CLOSED_LOOP_CONTROL",value:8},
];
const Control_Mode_items_const = [
    {text: "VELOCITY_CONTROL",value:2},
    {text: "POSITION_CONTROL",value:3},
];
const Input_Mode_items_const = [
    {text: "PASSTHROUGH",value:1},
    {text: "VEL_RAMP",value:2},
    {text: "TRAP_TRAJ",value:5},
    {text: "MIRROR",value:7},
];
const Spindles_const = [
    {text: "Milling Spindle",value:0},
    {text: "Headstock Spindle",value:1},
    {text: "Tailstock Spindle",value:2},
];


export default {
	computed: {
        ...mapState('machine/model', {
			tools: state => state.tools
		}),
		
    },    
    methods: {
        ...mapActions('machine', ['sendCode','download','upload']),
        GetConsole(){
            console.log(this.tools);
            //this.SpindleDatas[0].Datas.nowvel =this.tools[2].standby[0];
            //this.SpindleDatas[0].Datas.nowCtlModeItem = 99;
            //console.log(this.SpindleDatas[0].Datas.turns_per_step);
        },
        AnylCode_float(_value){
			_value = _value.split("\n");
			(_value.length > 2) ? _value=parseFloat(_value[2]) : _value=0 ;
			return _value;
        },
        splitResponseString(_value){
            let tmpstr;
            tmpstr = _value.split("\n");
            (tmpstr.length > 2) ? tmpstr=parseFloat(tmpstr[2]).toString() : tmpstr=0 ;
            return tmpstr;
        },
        SendVel(value){
            value = Math.round(value * 0.01745329);
            let __command = "";
            this.MapAxisToSetting();
            __command = `M118 S"M84${this.Mcode} A(w axis${this.Axiscode}.controller.input_vel ${value})"`;
            this.sendCode({ code: __command, log: false });
        },
        SendAxis_State(value){
            let __command = "";
            this.MapAxisToSetting();
            __command = `M118 S"M84${this.Mcode} A(w axis${this.Axiscode}.requested_state ${value})"`;
            this.sendCode({ code: __command, log: false });
        },
        SendCtl_Mode(value){
            let __command = "";
            this.MapAxisToSetting();
            __command = `M118 S"M84${this.Mcode} A(w axis${this.Axiscode}.controller.config.control_mode ${value})"`;
            this.sendCode({ code: __command, log: false });
        },
        SendInput_Mode(value){
            let __command = "";
            this.MapAxisToSetting();
            __command = `M118 S"M84${this.Mcode} A(w axis${this.Axiscode}.controller.config.input_mode ${value})"`;
            this.sendCode({ code: __command, log: false });
        },
        SendPos(value){  
            let __command = "";
            this.MapAxisToSetting();
            __command = `M118 S"M84${this.Mcode} A(w axis${this.Axiscode}.controller.config.input_pos ${value})"`;
            this.sendCode({ code: __command, log: false });
        },
        SendToq(value){
            let __command = "";
            this.MapAxisToSetting();
            __command = `M118 S"M84${this.Mcode} A(w axis${this.Axiscode}.controller.config.input_torque ${value})"`;
            this.sendCode({ code: __command, log: false });
        },        
        async Pos_gain(_value=-99999){
            let __command = "";let tmpstr = "";let rw="w";
            this.MapAxisToSetting();
            if(_value==-99999){rw = "r";tmpstr = "";}else {tmpstr = " " + _value.toString();}
            try {
                __command = `M118 S"M84${this.Mcode} A(${rw} axis${this.Axiscode}.controller.config.pos_gain${tmpstr})"`;
                tmpstr = await this.sendCode({ code: __command, log: false });
                if(rw == "w")return;
                this.SpindleDatas[this.ChooseSpindle.value].Datas.pos_gain = this.splitResponseString(tmpstr);
            } catch (error) {
                console.log(error);
            }
        },
        async Vel_gain(_value=-99999){
            let __command = "";let tmpstr = "";let rw="w";
            this.MapAxisToSetting();
            if(_value==-99999){rw = "r";tmpstr = "";}else {tmpstr = " " + _value.toString();}
            try {
                __command = `M118 S"M84${this.Mcode} A(${rw} axis${this.Axiscode}.controller.config.vel_gain${tmpstr})"`;
                tmpstr = await this.sendCode({ code: __command, log: false });
                if(rw == "w")return;
                this.SpindleDatas[this.ChooseSpindle.value].Datas.vel_gain = this.splitResponseString(tmpstr);
            } catch (error) {
                console.log(error);
            }
        },
        async Vel_Integrator_gain(_value=-99999){
            let __command = "";let tmpstr = "";let rw="w";
            this.MapAxisToSetting();
            //
            if(_value==-99999){rw = "r";tmpstr = "";}else {tmpstr = " " + _value.toString();}
            try {
                __command = `M118 S"M84${this.Mcode} A(${rw} axis${this.Axiscode}.controller.config.vel_integrator_gain${tmpstr})"`;
                tmpstr = await this.sendCode({ code: __command, log: false });
                if(rw == "w")return;
                this.SpindleDatas[this.ChooseSpindle.value].Datas.vel_integrator_gain = this.splitResponseString(tmpstr);
            } catch (error) {
                console.log(error);
            }
        },
        async Vel_Limit(_value=-99999){
            let __command = "";let tmpstr = "";let rw="w";
            this.MapAxisToSetting();
            //
            if(_value==-99999){rw = "r";tmpstr = "";}else {tmpstr = " " + _value.toString();}
            try {
                __command = `M118 S"M84${this.Mcode} A(${rw} axis${this.Axiscode}.controller.config.vel_limit${tmpstr})"`;
                tmpstr = await this.sendCode({ code: __command, log: false });
                if(rw == "w")return;
                this.SpindleDatas[this.ChooseSpindle.value].Datas.vel_limit = this.splitResponseString(tmpstr);
            } catch (error) {
                console.log(error);
            }
        },
        async Current_Limit(_value=-99999){
            let __command = "";let tmpstr = "";let rw="w";
            this.MapAxisToSetting();
            //
            if(_value==-99999){rw = "r";tmpstr = "";}else {tmpstr = " " + _value.toString();}
            try {
                __command = `M118 S"M84${this.Mcode} A(${rw} axis${this.Axiscode}.motor.config.current_lim${tmpstr})"`;
                tmpstr = await this.sendCode({ code: __command, log: false });
                if(rw == "w")return;
                this.SpindleDatas[this.ChooseSpindle.value].Datas.current_lim = this.splitResponseString(tmpstr);
            } catch (error) {
                console.log(error);
            }
        },
        async Trap_Traj_vel_limit(_value=-99999){
            let __command = "";let tmpstr = "";let rw="w";
            this.MapAxisToSetting();
            //
            if(_value==-99999){rw = "r";tmpstr = "";}else {tmpstr = " " + _value.toString();}
            try {
                __command = `M118 S"M84${this.Mcode} A(${rw} axis${this.Axiscode}.trap_traj.config.vel_limit${tmpstr})"`;
                tmpstr = await this.sendCode({ code: __command, log: false });
                if(rw == "w")return;
                this.SpindleDatas[this.ChooseSpindle.value].Datas.trap_traj_vel_limit = this.splitResponseString(tmpstr);
            } catch (error) {
                console.log(error);
            }
        },
        async Trap_Traj_accel_limit(_value=-99999){
            let __command = "";let tmpstr = "";let rw="w";
            this.MapAxisToSetting();
            //
            if(_value==-99999){rw = "r";tmpstr = "";}else {tmpstr = " " + _value.toString();}
            try {
                __command = `M118 S"M84${this.Mcode} A(${rw} axis${this.Axiscode}.trap_traj.config.accel_limit${tmpstr})"`;
                tmpstr = await this.sendCode({ code: __command, log: false });
                if(rw == "w")return;
                this.SpindleDatas[this.ChooseSpindle.value].Datas.trap_traj_accel_limit = this.splitResponseString(tmpstr);
            } catch (error) {
                console.log(error);
            }
        },
        async Trap_Traj_decel_limit(_value=-99999){
            let __command = "";let tmpstr = "";let rw="w";
            this.MapAxisToSetting();
            //
            if(_value==-99999){rw = "r";tmpstr = "";}else {tmpstr = " " + _value.toString();}
            try {
                __command = `M118 S"M84${this.Mcode} A(${rw} axis${this.Axiscode}.trap_traj.config.decel_limit${tmpstr})"`;
                tmpstr = await this.sendCode({ code: __command, log: false });
                if(rw == "w")return;
                this.SpindleDatas[this.ChooseSpindle.value].Datas.trap_traj_decel_limit = this.splitResponseString(tmpstr);
            } catch (error) {
                console.log(error);
            }
        },
        async Enable_Gain_Scheduling(_value=-99999){
            let __command = "";let tmpstr = "";let rw="w";
            this.MapAxisToSetting();
            //
            if(_value==-99999){rw = "r";tmpstr = "";}else {tmpstr = " " + _value.toString();}
            try {
                __command = `M118 S"M84${this.Mcode} A(${rw} axis${this.Axiscode}.controller.config.enable_gain_scheduling${tmpstr})"`;
                tmpstr = await this.sendCode({ code: __command, log: false });
                if(rw == "w")return;
                this.SpindleDatas[this.ChooseSpindle.value].Datas.enable_gain_scheduling = this.splitResponseString(tmpstr);
            } catch (error) {
                console.log(error);
            }
        },
        async Gain_Scheduling_Width(_value=-99999){
            let __command = "";let tmpstr = "";let rw="w";
            this.MapAxisToSetting();
            //
            if(_value==-99999){rw = "r";tmpstr = "";}else {tmpstr = " " + _value.toString();}
            try {
                __command = `M118 S"M84${this.Mcode} A(${rw} axis${this.Axiscode}.controller.config.gain_scheduling_width${tmpstr})"`;
                tmpstr = await this.sendCode({ code: __command, log: false });
                if(rw == "w")return;
                this.SpindleDatas[this.ChooseSpindle.value].Datas.gain_scheduling_width = this.splitResponseString(tmpstr);
            } catch (error) {
                console.log(error);
            }
        },        
        async Encoder_Offset(_value=-99999){
            let __command = "";let tmpstr = "";let rw="w";
            this.MapAxisToSetting();
            //
            if(_value==-99999){rw = "r";tmpstr = "";}else {tmpstr = " " + _value.toString();}
            try {
                __command = `M118 S"M84${this.Mcode} A(${rw} axis${this.Axiscode}.encoder.config.index_offset${tmpstr})"`;
                tmpstr = await this.sendCode({ code: __command, log: false });
                if(rw == "w")return;
                this.SpindleDatas[this.ChooseSpindle.value].Datas.offset = this.splitResponseString(tmpstr);
            } catch (error) {
                console.log(error);
            }
        },
        async Pre_Calibrated(_value=-99999){
            let __command = "";let tmpstr = "";let rw="w";
            this.MapAxisToSetting();
            //
            if(_value==-99999){rw = "r";tmpstr = "";}else {tmpstr = " " + _value.toString();}
            try {
                __command = `M118 S"M84${this.Mcode} A(${rw} axis${this.Axiscode}.encoder.config.pre_calibrated${tmpstr})"`;
                tmpstr = await this.sendCode({ code: __command, log: false });
                if(rw == "w")return;
                this.SpindleDatas[this.ChooseSpindle.value].Datas.pre_calibrated = this.splitResponseString(tmpstr);
            } catch (error) {
                console.log(error);
            }
        },
        async Vel_ramp_rate_(_value=-99999){
            let __command = "";let tmpstr = "";let rw="w";
            this.MapAxisToSetting();
            //
            if(_value==-99999){rw = "r";tmpstr = "";}else {tmpstr = " " + _value.toString();}
            try {
                __command = `M118 S"M84${this.Mcode} A(${rw} axis${this.Axiscode}.controller.config.vel_ramp_rate${tmpstr})"`;
                tmpstr = await this.sendCode({ code: __command, log: false });
                if(rw == "w")return;
                this.SpindleDatas[this.ChooseSpindle.value].Datas.vel_ramp_rate = this.splitResponseString(tmpstr);
            } catch (error) {
                console.log(error);
            }
        },
        async Inertia_(_value=-99999){
            let __command = "";let tmpstr = "";let rw="w";
            this.MapAxisToSetting();
            //
            if(_value==-99999){rw = "r";tmpstr = "";}else {tmpstr = " " + _value.toString();}
            try {
                __command = `M118 S"M84${this.Mcode} A(${rw} axis${this.Axiscode}.controller.config.inertia${tmpstr})"`;
                tmpstr = await this.sendCode({ code: __command, log: false });
                if(rw == "w")return;
                this.SpindleDatas[this.ChooseSpindle.value].Datas.inertia = this.splitResponseString(tmpstr);
            } catch (error) {
                console.log(error);
            }
        },
        async Get_single_Velocity(){ 
            let __command = "";let temp;
            this.MapAxisToSetting();
            try {
                //get vel
                __command = `M118 S"M84${this.Mcode} A(r axis${this.Axiscode}.encoder.vel_estimate)"`;
                temp = await this.sendCode({ code: __command, log: false });
                let _tempvalue = this.AnylCode_float(temp);
                this.SpindleDatas[this.ChooseSpindle.value].Datas.nowvel = Math.round(_tempvalue * 57.2957899 * 1000) / 1000;
            } catch (error) {
                console.log(error);
            }
        },
        async Get_single_Position(){ 
            let __command = "";let temp;
            this.MapAxisToSetting();
            try {
                //get pos
                __command = `M118 S"M84${this.Mcode} A(r axis${this.Axiscode}.encoder.pos_estimate)"`;
                temp = await this.sendCode({ code: __command, log: false });
                let _tempvalue = this.AnylCode_float(temp);
                if(this.ChooseSpindle.value == 0){
                    _tempvalue = parseFloat(_tempvalue) % 1;
                }else{
                    _tempvalue = parseFloat(_tempvalue) % 3 / 3;
                }
                _tempvalue = Math.round(_tempvalue * 360 * 1000) / 1000;
                this.SpindleDatas[this.ChooseSpindle.value].Datas.nowpos = _tempvalue;
            } catch (error) {
                console.log(error);
            }  
        },
        async Get_single_Torque(){ 
            let __command = "";let temp;
            this.MapAxisToSetting();
            try {
                //get toq / current
                __command = `M118 S"M84${this.Mcode} A(r axis${this.Axiscode}.motor.current_control.Iq_measured)"`;
                temp = await this.sendCode({ code: __command, log: false });
                temp = this.AnylCode_float(temp);
                this.SpindleDatas[this.ChooseSpindle.value].Datas.nowtoq = Math.round(temp * 0.056172 * 1000) / 1000;
            } catch (error) {
                console.log(error);
            }
        },
        async Turns_per_step(_value=-99999){
            let __command = "";let tmpstr = "";let rw="w";
            this.MapAxisToSetting();
            //
            if(_value==-99999){rw = "r";tmpstr = "";}else {tmpstr = " " + _value.toString();}
            try {
                __command = `M118 S"M84${this.Mcode} A(${rw} axis${this.Axiscode}.config.turns_per_step${tmpstr})"`;
                tmpstr = await this.sendCode({ code: __command, log: false });
                if(rw == "w")return;
                this.SpindleDatas[this.ChooseSpindle.value].Datas.turns_per_step = this.splitResponseString(tmpstr);
            } catch (error) {
                console.log(error);
            }
        },
        async Axis_to_mirror(_value=-99999){
            let __command = "";let tmpstr = "";let rw="w";
            this.MapAxisToSetting();
            //
            if(_value==-99999){rw = "r";tmpstr = "";}else {tmpstr = " " + _value.toString();}
            try {
                __command = `M118 S"M84${this.Mcode} A(${rw} axis${this.Axiscode}.controller.config.axis_to_mirror${tmpstr})"`;
                tmpstr = await this.sendCode({ code: __command, log: false });
                if(rw == "w")return;
                this.SpindleDatas[this.ChooseSpindle.value].Datas.axis_to_mirror = this.splitResponseString(tmpstr);
            } catch (error) {
                console.log(error);
            }
        },
        async Mirror_ratio(_value=-99999){
            let __command = "";let tmpstr = "";let rw="w";
            this.MapAxisToSetting();
            //
            if(_value==-99999){rw = "r";tmpstr = "";}else {tmpstr = " " + _value.toString();}
            try {
                __command = `M118 S"M84${this.Mcode} A(${rw} axis${this.Axiscode}.controller.config.mirror_ratio${tmpstr})"`;
                tmpstr = await this.sendCode({ code: __command, log: false });
                if(rw == "w")return;
                this.SpindleDatas[this.ChooseSpindle.value].Datas.mirror_ratio = this.splitResponseString(tmpstr);
            } catch (error) {
                console.log(error);
            }
        },
        sleep(milliseconds) {
            let start = new Date().getTime();
            for (let i = 0; i < 1e7; i++) {
                if ((new Date().getTime() - start) > milliseconds){
                    break;
                }
            }
        },
        async UpdateVPT(_code) {
            for(let i=0 ; i<3 ; i++){
                if(_code==0){
                    await this.Get_single_Velocity();
                }else if(_code==1){
                    await this.Get_single_Position();
                }else{
                    await this.Get_single_Torque();
                }
            }            
        },
        async saveFile() {
            let contextvalue = JSON.stringify(this.SpindleDatas);
			const content = new Blob([contextvalue]);
			try {
                await this.upload({ filename: "0:/macros/saveAxisSetting.g", content, showSuccess: false });
			} catch (e) {
				alert(e);
			}
        },
        async loadFile() {
            try {
				let filename = "0:/macros/saveAxisSetting.g";//Path.combine(this.innerDirectory, item.name);
                const response = await this.download({ filename, type: 'text', showSuccess: false });
                this.SpindleDatas = JSON.parse(response);
			} catch (e) {
				alert(e);
			}
		},
        async GetBLDCDatas(){   
            if(this.isSending)return;
            this.isSending = true;
            //                  
            let __command = "";
            let temp;
            let statuscode=0;
            let ctlModeCode=0;   
            let inputModeCode=0;        
            this.MapAxisToSetting();
            await this.Get_single_Velocity();
            await this.Get_single_Position();
            await this.Get_single_Torque();
            try {
                //get axis state
                __command = `M118 S"M84${this.Mcode} A(r axis${this.Axiscode}.requested_state)"`;
                temp = await this.sendCode({ code: __command, log: false });
                statuscode = this.AnylCode_float(temp);
                for(let i=0 ; i<this.Axis_State_items.length;i++){
                    if(this.Axis_State_items[i].value == statuscode)
                    {
                        this.SpindleDatas[this.ChooseSpindle.value].Datas.nowStateItem = this.Axis_State_items[i].text;
                        break;
                    }
                }
            } catch (error) {
                console.log(error);
            }
            try {
                //get ctl mode
                __command = `M118 S"M84${this.Mcode} A(r axis${this.Axiscode}.controller.config.control_mode)"`;
                temp = await this.sendCode({ code: __command, log: false });
                ctlModeCode = this.AnylCode_float(temp);
                for(let i=0 ; i<this.Control_Mode_items.length;i++){
                    if(this.Control_Mode_items[i].value == ctlModeCode)
                    {
                        this.SpindleDatas[this.ChooseSpindle.value].Datas.nowCtlModeItem = this.Control_Mode_items[i].text;
                        break;
                    }
                }
            } catch (error) {
                console.log(error);
            }               
            try {
                //get input mode
                __command = `M118 S"M84${this.Mcode} A(r axis${this.Axiscode}.controller.config.input_mode)"`;
                temp = await this.sendCode({ code: __command, log: false });
                inputModeCode = this.AnylCode_float(temp);
                for(let i=0 ; i<this.Input_Mode_items.length;i++){
                    if(this.Input_Mode_items[i].value == inputModeCode)
                    {
                        this.SpindleDatas[this.ChooseSpindle.value].Datas.nowInputModeItem = this.Input_Mode_items[i].text;
                        break;
                    }
                }
            } catch (error) {
                console.log(error);
            }
            await this.Enable_Gain_Scheduling();  
            await this.Pre_Calibrated();
            await this.Pos_gain();
            await this.Vel_gain();
            await this.Vel_Integrator_gain();
            await this.Current_Limit();
            await this.Vel_Limit();
            await this.Trap_Traj_vel_limit();
            await this.Trap_Traj_accel_limit();
            await this.Trap_Traj_decel_limit();
            await this.Gain_Scheduling_Width();
            await this.Encoder_Offset();
            await this.Vel_ramp_rate_();
            await this.Inertia_();
            await this.Turns_per_step();
            //
            this.isSending = false;
        },
        async SaveConfig(){
            this.MapAxisToSetting();
            await this.sendCode({ code: `M118 S"M84${this.Mcode} A(ss)"`, log: false });
            this.sleep(500);
            await this.sendCode({ code: `M118 S"M84${this.Mcode} A(sr)"`, log: false });                 
        },
        ChooseSpindle_fun(_value){
            for(let i=0 ; i<this.SpindleDatas.length; i++){
                this.SpindleDatas[i].visible = false;
            }
            this.SpindleDatas[_value].visible = true;
            console.log(this.ChooseSpindle.value);
        },
        MapAxisToSetting(){
            switch (this.ChooseSpindle.value) {
                case 0:this.Mcode=2;this.Axiscode=0;break;
                case 1:this.Mcode=0;this.Axiscode=0;break;
                case 2:this.Mcode=0;this.Axiscode=1;break;
                default:return;				
            }
        },
//         const Spindles_const = [
//     {text: "Milling Spindle",value:0},
//     {text: "Headstock Spindle",value:1},
//     {text: "Tailstock Spindle",value:2},
// ];
    },
	data() {
		return {
            isSending : false,
            Mcode : 0,
            Axiscode : 0,
            setIntervalTime:null,
			Axis_State_items: Axis_State_items_const.slice(),
			Control_Mode_items: Control_Mode_items_const.slice(),
            Input_Mode_items:Input_Mode_items_const.slice(),
            SpindleNames:Spindles_const.slice(),
            ChooseSpindle:{text: "Milling Spindle",value:0},
            SpindleDatas:[
                {
                    color: '#F0F8FF',
                    SpiName: "Milling Spindle",
                    Datas:{
                        spinNum:0,
                        nowvel:0,
                        nowpos:0,
                        nowtoq:0,
                        nowStateItem:"UNDEFINED",
                        nowCtlModeItem:"VELOCITY_CONTROL",
                        nowInputModeItem:"VEL_RAMP",
                        input_vel:0,
                        input_pos:0,
                        input_torque:0,
                        pos_gain:0,
                        vel_gain:0,
                        vel_integrator_gain:0,
                        vel_limit:0,
                        current_lim:0,
                        trap_traj_vel_limit:0,
                        trap_traj_accel_limit:0,
                        trap_traj_decel_limit:0,
                        enable_gain_scheduling:0,
                        gain_scheduling_width:0,
                        offset:0,
                        pre_calibrated:0,
                        vel_ramp_rate:0,
                        inertia:0,
                        turns_per_step:0,
                        axis_to_mirror:0,
                        mirror_ratio:0,
                    },
                    visible: true
                },
                {
                    color: '#F0FFF0',
                    SpiName: "Headstock Spindle",
                    Datas:{
                        spinNum:1,
                        nowvel:0,
                        nowpos:0,
                        nowtoq:0,
                        nowStateItem:"UNDEFINED",
                        nowCtlModeItem:"VELOCITY_CONTROL",
                        nowInputModeItem:"VEL_RAMP",
                        input_vel:0,
                        input_pos:0,
                        input_torque:0,
                        pos_gain:0,
                        vel_gain:0,
                        vel_integrator_gain:0,
                        vel_limit:0,
                        current_lim:0,
                        trap_traj_vel_limit:0,
                        trap_traj_accel_limit:0,
                        trap_traj_decel_limit:0,
                        enable_gain_scheduling:0,
                        gain_scheduling_width:0,
                        offset:0,
                        pre_calibrated:0,
                        vel_ramp_rate:0,
                        inertia:0,
                        turns_per_step:0,
                        axis_to_mirror:0,
                        mirror_ratio:0,
                    },
                    visible: false
                },
                {
                    color: '#F8F8FF',
                    SpiName: "Tailstock Spindle",
                    Datas:{
                        spinNum:2,
                        nowvel:0,
                        nowpos:0,
                        nowtoq:0,
                        nowStateItem:"UNDEFINED",
                        nowCtlModeItem:"VELOCITY_CONTROL",
                        nowInputModeItem:"VEL_RAMP",
                        input_vel:0,
                        input_pos:0,
                        input_torque:0,
                        pos_gain:0,
                        vel_gain:0,
                        vel_integrator_gain:0,
                        vel_limit:0,
                        current_lim:0,
                        trap_traj_vel_limit:0,
                        trap_traj_accel_limit:0,
                        trap_traj_decel_limit:0,
                        enable_gain_scheduling:0,
                        gain_scheduling_width:0,
                        offset:0,
                        pre_calibrated:0,
                        vel_ramp_rate:0,
                        inertia:0,
                        turns_per_step:0,
                        axis_to_mirror:0,
                        mirror_ratio:0,
                    },
                    visible: false
                }
            ]
		}
    },
    activated() { 
    }
}
</script>
