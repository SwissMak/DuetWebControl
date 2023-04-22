<style scoped>
.spindleDatas {
	position: relative;
}

</style>

<template>
    <v-card class="pb-5" >  
        <v-container fluid>
            <v-row dense>
                <v-col
                cols="12"
                class="mt-5"
                >
                    <v-combobox v-on:change="ChooseSpindle_fun($event.value)" label="Spindle Choose" dense hide-selected :items="SpindleNames" v-model="ChooseSpindle"></v-combobox>
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
                        <v-card-text  
                        class="d-flex flex-column pb-0"
                        v-if="spindle.visible">
                            <v-row>
                                <v-col
                                cols="3">
                                    <v-btn
                                    color="primary"
                                    @click="ChangeMode"
                                    >
                                        {{btnEditName}}
                                    </v-btn>
                                </v-col>
                                <v-col
                                v-if="spindle.isEditMode"
                                cols="3">
                                    <v-btn
                                    color="primary"
                                    @click="UpdateAllDatas">
                                        Get All Datas
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col
                                v-for="(paradd, indexParadd) in ParameterDatas" 
                                :key="`paradd-${indexParadd}`"
                                align="center"
                                sm="6"
                                md="6">
                                    <v-row
                                    v-if="spindle.isEditMode">
                                        <v-col
                                        sm="8"
                                        md="8">
                                            <v-text-field
                                            v-model="spindle.Datas[indexParadd]" 
                                            :label="paradd.funcName" 
                                            prepend-icon="mdi-gamepad-variant"></v-text-field>
                                        </v-col>
                                        <v-col
                                        align="start"
                                        sm="4"
                                        md="4">
                                            <v-btn color="info"
                                            @click="DeltaFunctionCode(i,indexParadd,paradd.funcCode)">
                                                <v-icon>mdi-inbox-arrow-down</v-icon> Get
                                            </v-btn>
                                            <v-btn
                                            color="info" @click="DeltaFunctionCode(i,indexParadd,paradd.funcCode , spindle.Datas[indexParadd])">
                                                <v-icon>mdi-shuffle-variant</v-icon> {{ $t('input.code.send') }} 
                                            </v-btn>
                                        </v-col>
                                    </v-row>
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
import { mapActions} from 'vuex'
const Spindles_const = [
    {text: "Milling Spindle",value:0},
    {text: "Headstock Spindle",value:1},
    {text: "Tailstock Spindle",value:2},
];


export default {
	computed: {
        ParameterDatas(){
            return [
                {funcName:"Position Control Gain(rad/s)(0-2047)",funcCode:"0200",},
                {funcName:"Position Control Gain Rate of Change(%)(10-500)",funcCode:"0202",},
                {funcName:"Position Feed Forward Gain(%)(0-100)",funcCode:"0204",},
                {funcName:"Position Feed Forward Gain Smoothing Constant(ms)(2-100)",funcCode:"0206",},
                {funcName:"Speed Control Gain(rad/s)(0-8191)",funcCode:"0208",},
                {funcName:"Speed Control Gain Rate of Change(%)(10-500)",funcCode:"020A",},
                {funcName:"Speed Integral Compensation(rad/s)(0-1023)",funcCode:"020C",},
                {funcName:"Speed Feed Forward Gain(%)(0-100)",funcCode:"020E",},
                {funcName:"Speed Limit(rpm)(0~max)",funcCode:"016E",},
                //{funcName:"Torque Limit(%)(-500~500)",funcCode:"01F0",},
            ];
        },
        btnEditName(){
            return this.SpindleDatas[this.ChooseSpindle.value].isEditMode ? "Save Mode":"Edit Mode";
        },
    },    
    methods: {
        ...mapActions('machine', ['sendCode']),
        splitResponseString(_value){
            let tmpstr;
            tmpstr = _value.split("\n");
            (tmpstr.length > 2) ? tmpstr=tmpstr[2] : tmpstr=0 ;
            if(tmpstr != 0){
                tmpstr = parseInt(tmpstr.substring(7, 11),16);
            }
            //console.log(tmpstr);
            //console.log(this.SpindleDatas);
            return tmpstr;
        }, 
        async DeltaFunctionCode(spinIdx,paraIdx,_funcCode,_value=-99999){
            let __command = "";let tmpstr = "";let rw=":C ";
            if(_value==-99999){rw = ":B ";tmpstr = "0002";}else {tmpstr = Number(_value).toString("16").padStart(4,0).toUpperCase();}
            let _motorNo = (this.ChooseSpindle.value+1).toString().padStart(2,0);
            __command = rw+_motorNo;
            if(_value==-99999){
                __command += "03";
            }else{
                __command += "06";
            }
            __command += _funcCode;
            __command += tmpstr;
            // console.log("------------------------------");
            __command = `M118 S"` + __command + `"`
            //console.log(__command);
            try {
                tmpstr = await this.sendCode({ code: __command, log: false });
                if(rw == ":C ")return;
                //console.log(tmpstr);
                this.SpindleDatas[spinIdx].Datas[paraIdx] = this.splitResponseString(tmpstr);
                //return this.splitResponseString(tmpstr);
                this.SpindleDatas[spinIdx].Datas.push(0);
                this.SpindleDatas[spinIdx].Datas.pop();
                console.log(this.SpindleDatas[spinIdx].Datas[paraIdx]);
            } catch (error) {
                console.log(error);
            }
        },
        ChooseSpindle_fun(_value){
            for(let i=0 ; i<this.SpindleDatas.length; i++){
                this.SpindleDatas[i].visible = false;
            }
            this.SpindleDatas[_value].visible = true;
        },
        initialDatas(){
            for(let i=0 ; i<this.SpindleDatas.length; i++){
                while(this.SpindleDatas[i].Datas.length < this.ParameterDatas.length){
                    this.SpindleDatas[i].Datas.push(0);
                }
            }
        },
        async ChangeMode(){
            if(this.SpindleDatas[this.ChooseSpindle.value].isEditMode){
                await this.DeltaFunctionCode(this.ChooseSpindle.value , 0,"023C" , 5);
            }else{
                await this.DeltaFunctionCode(this.ChooseSpindle.value , 0,"023C" , 0)
            }
            this.SpindleDatas[this.ChooseSpindle.value].isEditMode = !this.SpindleDatas[this.ChooseSpindle.value].isEditMode;
        },
        async UpdateAllDatas(){
            for(let i=0 ; i<this.SpindleDatas[this.ChooseSpindle.value].Datas.length ; i++ ){
                this.DeltaFunctionCode(this.ChooseSpindle.value,i,this.ParameterDatas[i].funcCode);
            }
        }
    },
	data() {
		return {
            isSettingMode : false,
            SpindleNames:Spindles_const.slice(),
            ChooseSpindle:{text:"Milling Spindle" ,value:0},
            
            SpindleDatas:[
                {
                    color: '#F0F8FF',
                    SpiName: "Milling Spindle",
                    Datas:[],
                    visible: true,
                    isEditMode: false,
                },
                {
                    color: '#F0FFF0',
                    SpiName: "Headstock Spindle",
                    Datas:[],
                    visible: false,
                    isEditMode: false,
                },
                {
                    color: '#F8F8FF',
                    SpiName: "Tailstock Spindle",
                    Datas:[],
                    visible: false,
                    isEditMode: false,
                }
            ]
		}
    },
    mounted() {
        this.initialDatas();
    },
}
</script>
