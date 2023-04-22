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
                                    :label="cuttingParameters.paraname" 
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
                    paraname : "Center X",
                    datavalue : 70,
                    codetype : "X",
                    unit:"mm",
                },
                {
                    paraname : "Center Y",
                    datavalue : 30,
                    codetype : "Y",
                    unit:"mm",
                },
                {
                    paraname : "End Z",
                    datavalue : 150,
                    codetype : "Z",
                    unit:"mm",
                },
                {
                    paraname : "Radius",
                    datavalue : 10,
                    codetype : "R",
                    unit:"mm",
                },
                {//5
                    paraname : "Feedrate",
                    datavalue : 500,
                    codetype : "F",
                    unit:"mm/min",
                },
                {//6
                    paraname : "Direction",
                    datavalue : 0,
                    codetype : "H",
                    unit:"cw=0 ccw=1",
                },
                {
                    paraname : "Spindle Speed",
                    datavalue : 3000,
                    codetype : "S",
                    unit:"RPM",
                },
            ],
            toolstruct:{
                paraname : "T11",
                datavalue : 11,
            }, 
            toolItems:[],
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
            return 1 * this.FindParaNameIndex("Spindle Speed");
        },
        GetDepthofCut(){
            return 1;
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
            let strcom = ";***Below is Circle and Herical***\n";
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
                g_code += " " + this.StartParameter[2].codetype + String(this.StartParameter[2].datavalue);
                g_code += "\n";
            }
            g_code += "G0";
            for(let i=0 ; i< this.StartParameter.length-1 ; i++ ){
                g_code = g_code + " " + this.StartParameter[i].codetype + String(this.StartParameter[i].datavalue);
            }
            g_code += "\n";
            if(_status == 0){
                g_code += "G0";
                g_code += " " + this.StartParameter[2].codetype + String(this.StartParameter[2].datavalue);
                g_code += "\n";
            }
            return g_code;
        },
        CreateGCode(){
            this.showcommon();
            let g_code="";
            g_code += this.SafePosition(0);
            //move to arc point
            g_code += "M3";
            g_code += " S" + String(this.GetSpindleRPM());
            g_code += "\n";
            
            if(this.FindParaNameIndex("Direction") == 0)
                g_code += "G2";
            else
                g_code += "G3";
            g_code += " X" + String(this.FindParaNameIndex("Center X") - this.FindParaNameIndex("Radius"));
            g_code += " Y" + String(this.FindParaNameIndex("Center Y"));
            g_code += " I" + String(this.FindParaNameIndex("Radius"));
            g_code += " Z" + String(this.FindParaNameIndex("End Z"));
            g_code += " F" + String(this.FindParaNameIndex("Feedrate"));
            g_code += "\n";
            g_code += this.SafePosition(1);
            g_code += "M5\n";
            this.InsertEditCodes(g_code);
        },
        Initialize(){
        },
    },
    mounted() {
    },


}
</script>