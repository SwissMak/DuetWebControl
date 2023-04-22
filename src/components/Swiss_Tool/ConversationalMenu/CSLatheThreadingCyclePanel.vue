<template>
    <v-card
    elevation="2"
    >
        <v-card-text>
            <v-row>
                <v-col sm=12 md=12 lg=12 xl=12>
                    <v-card>
                        <v-card-title>Safe Position</v-card-title>
                        <v-card-text>
                            <v-row>
                                <v-col sm=12 md=12 lg=6 xl=6
                                v-for="(safeParameter, i) in SafeParameter"
                                :key="`safeParameter-${i}`"
                                >
                                    <v-text-field
                                    class="pa-2"
                                    v-model="safeParameter.datavalue" 
                                    :label="safeParameter.paraname + ' (' + safeParameter.unit + ')'"
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
                        <v-card-title>Start Position</v-card-title>
                        <v-card-text>
                            <v-row>
                                <v-col sm=12 md=12 lg=6 xl=6
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
                        <v-card-title>Thread Parameters</v-card-title>
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
                                v-for="(threadParameters, i) in CuttingParameters"
                                :key="`threadParameters-${i}`"
                                >
                                    <v-text-field
                                    class="pa-2"
                                    v-model="threadParameters.datavalue" 
                                    :label="threadParameters.paraname + ' (' + threadParameters.unit + ')'"
                                    prepend-icon="mdi-gamepad-variant"></v-text-field>
                                </v-col>
                                <v-col sm=12 md=12 lg=6 xl=6>
                                    <v-btn
                                    rounded
                                    @click="Open_Sheet(0)"
                                    color="blue lighten-4">Thread Tool : {{toolstruct.paraname}}</v-btn>
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
        ><Tool-List @CloseDig="CloseDig" v-bind:isLathe = true  @SetToolNum="SetToolNum"></Tool-List></v-dialog>
    </v-card>
</template>


<script>
'use strict'
import { mapMutations , mapState } from 'vuex'
export default {
    computed: {
        ...mapState('ToolSettings', {
            ToolTurretPathDatas: state => state.ToolTurretPathDatas,
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
            SafeParameter :[
                {//0
                    paraname : "Safe X Position",
                    datavalue : 110,
                    codetype : "X",
                    unit:"mm",
                },
                {
                    paraname : "Safe Z Position",
                    datavalue : 110,
                    codetype : "Z",
                    unit:"mm",
                },
            ],
            StartParameter :[
                {//0
                    paraname : "Start X",
                    datavalue : 90,
                    codetype : "X",
                    unit:"mm",
                },
            ],
            CuttingParameters :[
                {
                    paraname : "Minor Diameter",
                    datavalue : 20,
                    codetype : "X",
                    unit:"mm",
                },
                {
                    paraname : "Start Z",
                    datavalue : 100,
                    codetype : "Z",
                    unit:"mm",
                },
                {
                    paraname : "End Z",
                    datavalue : 75,
                    codetype : "Q",
                    unit:"mm",
                },
                {
                    paraname : "Cutting Depth Per Pass",
                    datavalue : 0.1,
                    codetype : "P",
                    unit:"mm",
                },
                {
                    paraname : "Pitch",
                    datavalue : 2,
                    codetype : "F",
                    unit:"mm",
                },
                {
                    paraname : "Spindle Speed",
                    datavalue : 200,
                    codetype : "S",
                    unit:"RPM",
                },
            ],
            sheet_turret : false,
            toolstruct:{
                paraname : "T1",
                datavalue : 1,
            },
            selectedSize: "",
		}
	},	
	methods: {
        ...mapMutations('EditCodesSettings', ['InsertEditCodes']),
        getConsole(_value){
            console.log(_value);
        },
        GetFlutes(){
            if(this.ToolTurretPathDatas[this.toolstruct.datavalue] === undefined)return 0;
            return parseInt(this.ToolTurretPathDatas[this.toolstruct.datavalue].flutes, 10);
        },
        GetDiameter(){
            if(this.ToolTurretPathDatas[this.toolstruct.datavalue] === undefined)return 0;
            return parseInt(this.ToolTurretPathDatas[this.toolstruct.datavalue].Diameter, 10);
        },
        GetWidthOfCut(){
            if(this.ToolTurretPathDatas[this.toolstruct.datavalue] === undefined)return 0;
            return parseInt(this.ToolTurretPathDatas[this.toolstruct.datavalue].WidthOfCut, 10);
        },
        GetFeedrate(){
            return this.GetSpindleRPM() * this.FindParaNameIndex("Pitch");
        },
        GetDepthofCut(){
            return this.FindParaNameIndex("Cutting Depth Per Pass");
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
            let strcom = ";***Below is Threading Cycle***\n";
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
        SafePosition(){
            let g_code="";
            g_code += "G0";
            for(let i=0 ; i< this.SafeParameter.length ; i++ ){
                g_code = g_code + " " + this.SafeParameter[i].codetype + String(this.SafeParameter[i].datavalue);
            }
            g_code += "\n";
            return g_code;
        },
        StartPosition(){
            let g_code="";
            g_code += "G0";
            g_code = g_code + " " + "X" + String(this.FindStartNameIndex("Start X"));
            g_code = g_code + " " + "Z" + String(this.FindParaNameIndex("Start Z"));
            g_code += "\n";
            return g_code;
        },
        CreateGCode(){
            this.showcommon();
            let g_code="";
            g_code += this.SafePosition();
            g_code += this.toolstruct.paraname + "\n";
            g_code += this.StartPosition();
            g_code += "G76";
            for(let i=0 ; i< this.CuttingParameters.length ; i++ ){
                g_code = g_code + " " + this.CuttingParameters[i].codetype + String(this.CuttingParameters[i].datavalue);
            }
            g_code += "\n";
            g_code += this.SafePosition();
            this.InsertEditCodes(g_code);
        },
        SizevalueHasChanged() {
            this.CuttingParameters[4].datavalue = this.MappingSize[this.ObjectSize.findIndex(X => X == this.selectedSize)];
        },
    },


}
</script>