<template>
    <v-card
    elevation="2"
    >
        <v-card-text>
            <v-row>
                <v-col sm=12 md=12 lg=12 xl=12>
                    <v-card>
                        <v-card-title>Start Position</v-card-title>
                        <v-card-text>
                            <v-row>
                                <v-col sm=12 md=12 lg=4 xl=4
                                v-for="(startParameter, i) in StartParameter"
                                :key="`startParameter-${i}`"
                                >
                                    <v-text-field
                                    class="pa-2"
                                    v-model="startParameter.datavalue" 
                                    :label="startParameter.paraname + ' (' + startParameter.unit + ')'"
                                    prepend-icon="mdi-gamepad-variant"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col sm=12 md=12 lg=12 xl=12>
                    <v-card>
                        <v-card-title>Cutting Parameters</v-card-title>
                        <v-card-text>
                            <v-row>
                                <v-col sm=12 md=12 lg=6 xl=6
                                v-for="(cuttingParameters, i) in CuttingParameters"
                                :key="`cuttingParameters-${i}`"
                                >
                                    <v-text-field
                                    class="pa-2"
                                    v-model="cuttingParameters.datavalue" 
                                    :label="cuttingParameters.paraname + ' (' + cuttingParameters.unit + ')'"
                                    prepend-icon="mdi-gamepad-variant"></v-text-field>
                                </v-col>
                                <v-col sm=12 md=12 lg=6 xl=6>
                                    <CuttingMode-ForMill @ModeIdx="ModeIdx"></CuttingMode-ForMill>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-textarea
                        height="300px"
                        outlined
                        label="Process of each side"
                        v-model ="innerValue"
                    ></v-textarea>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-btn
                    @click="CreateGCode"
                    rounded
                    color="primary">
                        Create G code
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
        <v-dialog 
        v-model="sheet_turret"
        @click="sheet_turret = false"
        ><Tool-List @CloseDig="CloseDig" v-bind:isLathe = false  @SetToolNum="SetToolNum"></Tool-List></v-dialog>
    </v-card>
</template>


<script>
'use strict'
import { mapMutations , mapState } from 'vuex'
export default {
    computed: {
        ...mapState('ToolSettings', {
            ToolMillingPathDatas: state => state.ToolMillingPathDatas,
            TurretMax :state => state.TurretMax,
        }),
	},
	data() {
		return {
            sheet_turret : false,
            innerValue :"",
            StartParameter :[
                {//0
                    paraname : "Start X",
                    datavalue : 90,
                    codetype : "X",
                    unit:"mm",
                },
                {
                    paraname : "Start Y",
                    datavalue : 50,
                    codetype : "Y",
                    unit:"mm",
                },
                {
                    paraname : "Start Z",
                    datavalue : 200,
                    codetype : "Z",
                    unit:"mm",
                },
            ],
            CuttingParameters :[
                {
                    paraname : "Sides",
                    datavalue : 6,
                    codetype : "Q",
                    unit:"Number",
                },
                {
                    paraname : "Start Angle",
                    datavalue : 0,
                    codetype : "K",
                    unit:"˚",
                },
            ],
            toolstruct:{
                paraname : "T11",
                datavalue : 11,
            },
            CuttingModeValue:0,
		}
	},
	methods: {
        ...mapMutations('EditCodesSettings', ['InsertEditCodes']),
        GetFlutes(){
            if(this.ToolMillingPathDatas[this.toolstruct.datavalue - this.TurretMax] === undefined)return 0;
            return parseInt(this.ToolMillingPathDatas[this.toolstruct.datavalue - this.TurretMax].flutes, 10);
        },
        GetDiameter(){
            if(this.ToolMillingPathDatas[this.toolstruct.datavalue - this.TurretMax] === undefined)return 0;
            return parseInt(this.ToolMillingPathDatas[this.toolstruct.datavalue - this.TurretMax].Diameter, 10);
        },
        GetWidthOfCut(){
            if(this.ToolMillingPathDatas[this.toolstruct.datavalue - this.TurretMax] === undefined)return 0;
            return parseInt(this.ToolMillingPathDatas[this.toolstruct.datavalue - this.TurretMax].WidthOfCut, 10);
        },
        FindParaNameIndex(_value){
            const result = this.CuttingParameters.filter(x => x.paraname == _value);
            return result[0].datavalue;
        },
        FindStartNameIndex(_value){
            const result = this.StartParameter.filter(x => x.paraname == _value);
            return result[0].datavalue;
        },
        showcommon(){
            let strcom = ";***Below is Milling Polygon (Repeat)***\n";
            for(let i=0 ; i< this.CuttingParameters.length ; i++ ){
                strcom += "; "  + this.CuttingParameters[i].codetype + ":" + this.CuttingParameters[i].paraname + "\n";
            }
            strcom += ";*******************\n";
            this.InsertEditCodes(strcom);
        },
        CloseDig(val){
            this.sheet_turret = val;
        },
        SetToolNum(idx){
            this.toolstruct.paraname = "T" + String(idx);
            this.toolstruct.datavalue = idx;
            this.sheet_turret = false;
            //set diameter
            this.CuttingParameters[2].datavalue = this.ToolMillingPathDatas[idx - this.TurretMax].Diameter;
        },
        Open_Sheet(){
            this.sheet_turret = true;
        },
        SafePosition(_status = 0){
            let g_code="";
            if(_status == 1){
                g_code += "G0";
                g_code = g_code + " " + this.StartParameter[2].codetype + String(this.StartParameter[2].datavalue);
                g_code += "\n";
            }
            g_code += "G0";
            for(let i=0 ; i< this.StartParameter.length-1 ; i++ ){
                g_code = g_code + " " + this.StartParameter[i].codetype + String(this.StartParameter[i].datavalue);
            }
            g_code += "\n";
            if(_status == 0){
                g_code += "G0";
                g_code = g_code + " " + this.StartParameter[2].codetype + String(this.StartParameter[2].datavalue);
                g_code += "\n";
            }
            return g_code;
        },
        CreateGCode(){
            //console.log(this.innerValue);
            let g_code="";
            g_code += this.SafePosition(0);
            //
            let imode = this.CuttingModeValue;
            let __Side = Math.abs(360 / this.FindParaNameIndex("Sides"));
            if(imode==1){
                g_code += "M5 A\n";
                g_code += "M800\n";
                g_code += "M98 P'/macros/0_SW_C_AXIS.g'\n";
            }
            for(let i=0 ; i<360 ; i = __Side + i){
                g_code += "\n";
                if(imode==0){
                    g_code += "M801\n";
                    g_code += "G4 P500\n";
                    g_code += "M19 A"+(i+parseInt(this.FindParaNameIndex("Start Angle"))).toString()+"\n";
                    g_code += "G4 P500\n";
                    g_code += "M800\n";
                }else if(imode==2){
                    g_code += "M801\n";
                    g_code += "G4 P500\n";
                    g_code += "M19 A"+(i+parseInt(this.FindParaNameIndex("Start Angle"))).toString()+"\n";
                    g_code += "G4 P500\n";
                }else{
                    g_code += "G0 A"+(-i-parseInt(this.FindParaNameIndex("Start Angle"))).toString()+"\n";
                    g_code += "G4 P500\n";
                }
                g_code += this.innerValue+"\n";
            }
            //
            g_code += this.SafePosition(1);
            //
            this.InsertEditCodes(g_code);
        },
        ModeIdx(_index){
            this.CuttingModeValue = _index;
        },
    },


}
</script>