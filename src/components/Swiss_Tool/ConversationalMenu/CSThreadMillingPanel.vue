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
                                <v-col
                                sm=12 md=12 lg=6 xl=6>
                                    <v-select
                                    :items="ObjectSize"
                                    label="Normal Size"
                                    @change="SizevalueHasChanged()"
                                    v-model="selectedSize"
                                    prepend-icon="mdi-gamepad-variant"
                                    ></v-select>
                                </v-col>
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
        <v-dialog 
        v-model="sheet_turret"
        @click="sheet_turret = false"
        ><Tool-List @CloseDig="CloseDig" v-bind:isLathe = false  @SetToolNum="SetToolNum"></Tool-List></v-dialog>
    </v-card>
</template>


<script>
'use strict'
import { mapMutations ,mapState } from 'vuex'
export default {
    computed: {
        ...mapState('ToolSettings', {
            ToolMillingPathDatas: state => state.ToolMillingPathDatas,
            TurretMax :state => state.TurretMax,
        }),
        ObjectSize() {
			return [
                "M2x0.3","M3x0.5","M4x0.7","M6x1","M5x0.8","M8x1.25","M10x1.5"
            ];
		},
        MappingSize() {
			return [
                0.3,0.5,0.7,1,0.8,1.25,1.5
            ];
		},
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
                    paraname : "Thread diameter",
                    datavalue : 20,
                    codetype : "D",
                    unit:"mm",
                },
                {
                    paraname : "Tool diameter",
                    datavalue : 10,
                    codetype : "B",
                    unit:"mm",
                },
                {
                    paraname : "Pitch",
                    datavalue : 3,
                    codetype : "C",
                    unit:"mm",
                },
                {
                    paraname : "Thread length",
                    datavalue : 30,
                    codetype : "L",
                    unit:"mm",
                },
                {
                    paraname : "Retract Z",
                    datavalue : 2,
                    codetype : "R",
                    unit:"mm",
                },
                {
                    paraname : "Spindle Speed",
                    datavalue : 300,
                    codetype : "S",
                    unit:"RPM",
                },
            ],
            toolstruct:{
                paraname : "T11",
                datavalue : 11,
            },
            selectedSize: "",
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
            return this.FindParaNameIndex("Pitch") * this.FindParaNameIndex("Spindle Speed");
        },
        GetDepthofCut(){
            return this.FindParaNameIndex("Pitch");
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
            g_code += this.toolstruct.paraname + "\n";
            g_code += "M3 S" + String(this.GetSpindleRPM());
            g_code += "\n";
            //
            let _temp = this.FindStartNameIndex("Start Z") - this.FindParaNameIndex("Retract Z");
            g_code += "G1 Z" + String(_temp);
            g_code += "\n";
            g_code += "M400\n";
            //radius = (A/2)-(B/2)
            _temp = (this.FindParaNameIndex("Thread diameter")/2) - (this.FindParaNameIndex("Tool diameter")/2);
            //move to arc point
            g_code += "G1 X" + String(this.FindStartNameIndex("Start X") - _temp) + " Y" + String(this.FindStartNameIndex("Start Y"));
            g_code += "\n";
            g_code += "G2"+" X"+ String(this.FindStartNameIndex("Start X") - _temp) + " Y" + String(this.FindStartNameIndex("Start Y"))+" I" + String(_temp);
            _temp = this.FindStartNameIndex("Start Z") - this.FindParaNameIndex("Retract Z") - this.FindParaNameIndex("Thread length");
            g_code += " Z" + String(_temp);
            //Feedrate = pitch * rpm
            _temp = this.FindParaNameIndex("Pitch") * this.FindParaNameIndex("Spindle Speed");
            g_code += " F" + String(_temp);
            g_code += "\n";

            g_code += this.SafePosition(1);
            //  
            this.InsertEditCodes(g_code);
        },
        showcommon(){
            let strcom = ";***Below is Thread Milling***\n";
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
        SizevalueHasChanged() {
            this.CuttingParameters[2].datavalue = this.MappingSize[this.ObjectSize.findIndex(X => X == this.selectedSize)];
        },
    },


}
</script>