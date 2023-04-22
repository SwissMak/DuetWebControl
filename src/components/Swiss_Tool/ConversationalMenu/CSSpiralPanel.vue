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
                                    <v-btn
                                    rounded
                                    @click="Open_Sheet()"
                                    color="blue lighten-4">Tool : {{toolstruct.paraname}}</v-btn>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col sm=12 md=12 lg=4 xl=4>
                                    <MRR-Card
                                    v-bind:feedrate=GetFeedrate()
                                    v-bind:depthofcut=GetDepthofCut()
                                    v-bind:WidthOfCut=GetWidthOfCut()
                                    v-bind:isLathe = false
                                    ></MRR-Card>
                                </v-col>
                                <v-col sm=12 md=12 lg=4 xl=4>
                                    <Chip-Load-Card
                                    v-bind:feedrate=GetFeedrate()
                                    v-bind:SpindleRPM=GetSpindleRPM()
                                    v-bind:CutterTooth=GetFlutes()
                                    v-bind:isLathe=false
                                    ></Chip-Load-Card>
                                </v-col>
                                <v-col sm=12 md=12 lg=4 xl=4>
                                    <Surface-Speed-Card
                                    v-bind:ToolDiameter=GetDiameter()
                                    v-bind:SpindleRPM=GetSpindleRPM()
                                    v-bind:isLathe=false
                                    ></Surface-Speed-Card>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
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
        
    </v-card>
</template>


<script>
//<v-combobox v-on:change="SendAxis_State($event.value)" label="Axis State" dense hide-selected :items="Axis_State_items" v-model="spindle.Datas.nowStateItem"></v-combobox>
'use strict'
import { mapMutations, mapState } from 'vuex'
export default {
    computed: {
        ...mapState('ToolSettings', {
            ToolMillingPathDatas: state => state.ToolMillingPathDatas,
            TurretMax :state => state.TurretMax,
        }),
    },
	data() {
		return {
            StartParameter :[
                {//0
                    paraname : "Start Z",
                    datavalue : 200,
                    codetype : "Z",
                    unit:"mm",
                },
            ],
            CuttingParameters :[                
                {//0
                    paraname : "Center X",
                    datavalue : 90,
                    codetype : "X",
                    unit:"mm",
                },
                {//1
                    paraname : "Center Y",
                    datavalue : 50 ,
                    codetype : "Y",
                    unit:"mm",
                },
                {//2
                    paraname : "Diameter of hole",
                    datavalue : 40,
                    codetype : "A",
                    unit:"mm",
                },
                {//3
                    paraname : "Diameter of Tool",
                    datavalue : 10,
                    codetype : "B",
                    unit:"mm",
                },
                {//4
                    paraname : "Offset for spiral",
                    datavalue : 0,
                    codetype : "C",
                    unit:"mm",
                },
                {//5
                    paraname : "Feedrate",
                    datavalue : 500,
                    codetype : "F",
                    unit:"mm/min",
                },
                {//6    
                    paraname : "Resolution",
                    datavalue : 0.1,
                    codetype : "R",
                    unit:"points",
                },
                {//7
                    paraname : "Stepover",
                    datavalue : 1,
                    codetype : "P",
                    unit:"mm",
                },
                {//8
                    paraname : "cw=0 ccw=1",
                    datavalue : 0,
                    codetype : "H",
                },
                {//9
                    paraname : "Spindle Speed",
                    datavalue : 3000,
                    codetype : "F",
                    unit:"RPM",
                },
            ],
            toolstruct:{
                paraname : "T11",
                datavalue : 11,
            },
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
        GetFeedrate(){
            return this.FindParaNameIndex("Feedrate");
        },
        GetDepthofCut(){
            return this.FindParaNameIndex("Stepover");
        },
        GetSpindleRPM(){
            return this.FindParaNameIndex("Spindle Speed");
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
            let strcom = ";***Below is Spiral***\n";
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
        },
        Open_Sheet(){
            this.sheet_turret = true;
        },
        SafePosition(_status = 0){
            let g_code="";
            if(_status == 1){
                g_code += "G0";
                g_code = g_code + " " + this.StartParameter[0].codetype + String(this.StartParameter[0].datavalue);
                g_code += "\n";
            }
            g_code += "G0";
            g_code = g_code + " " + "X" + String(this.FindParaNameIndex("Center X"));
            g_code = g_code + " " + "Y" + String(this.FindParaNameIndex("Center Y"));
            g_code += "\n";
            if(_status == 0){
                g_code += "G0";
                g_code = g_code + " " + this.StartParameter[0].codetype + String(this.StartParameter[0].datavalue);
                g_code += "\n";
            }
            return g_code;
        },
        CreateGCode(){   
            let g_code="";
            g_code += "M3";
            g_code += " S" + String(this.GetSpindleRPM());
            g_code += "\n";
            g_code += this.SafePosition(0);
            g_code += "M2001";
            for(let i=0 ; i< this.CuttingParameters.length - 1 ; i++ ){
                g_code = g_code + " " + this.CuttingParameters[i].codetype + String(this.CuttingParameters[i].datavalue);
            }
            g_code += "\n";
            g_code += "M5\n";
            g_code += this.SafePosition(1);
            this.InsertEditCodes(g_code);
        },
    },
    mounted() {
    },
}
</script>