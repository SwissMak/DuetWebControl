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
            <v-row>
                <v-col>
                    <v-btn
                    rounded
                    @click="AddHolePosi"
                    color="primary">
                        Add Hole Position
                    </v-btn>
                </v-col>
                <v-col>
                    <v-btn
                    rounded
                    @click="PopHolePosi"
                    color="warning">
                        Delete
                    </v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col sm=12 md=12 lg=12 xl=12>
                    <v-simple-table
                    class="pa-2"
                    >
                        <template v-slot:default>
                        <thead>
                            <tr>
                            <th class="text-left">
                                X axis
                            </th>
                            <th class="text-left">
                                Y axis
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                            v-for="(item,i) in XYarray"
                            :key="i"
                            >
                                <td>
                                    <v-text-field
                                    class="pa-2"
                                    v-model="item.X"></v-text-field>
                                </td>
                                <td>
                                    <v-text-field
                                    class="pa-2"
                                    v-model="item.Y"></v-text-field>
                                </td>
                            </tr>
                        </tbody>
                        </template>
                    </v-simple-table>
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
                    paraname : "Hole Z bottom",
                    datavalue : 180,
                    codetype : "Z",
                    unit:"mm",
                },
                {
                    paraname : "Hole Z top",
                    datavalue : 190,
                    codetype : "R",
                    unit:"mm",
                },
                {
                    paraname : "Depth of each peck",
                    datavalue : 1,
                    codetype : "Q",
                    unit:"mm",
                },
                {
                    paraname : "Feedrate",
                    datavalue : 300,
                    codetype : "F",
                    unit:"mm/min",
                },
                {
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
            XYarray:[
            ],
		}
	},
	methods: {
        ...mapMutations('EditCodesSettings', ['InsertEditCodes']),
        getConsole(_value){
            console.log(_value);
        },
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
            return this.FindParaNameIndex("Depth of each peck");
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
            let strcom = ";***Below is Drilling Cycle***\n";
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
            //
            g_code += this.SafePosition(0);
            //
            g_code += this.toolstruct.paraname + "\n";
            //
            g_code += "M3";
            g_code += " S" + String(this.GetSpindleRPM());
            g_code += "\n";
            //
            g_code += "G83";
            for(let i=0 ; i< this.CuttingParameters.length ; i++ ){
                g_code = g_code + " " + this.CuttingParameters[i].codetype + String(this.CuttingParameters[i].datavalue);
            }
            g_code += "\n";
            //XY pos
            for(let i=0 ; i< this.XYarray.length ; i++ ){
                g_code = g_code + "X" + String(this.XYarray[i].X) + " Y" + String(this.XYarray[i].Y);
                g_code += "\n";
            }
            //
            g_code += "G80\n";
            g_code += this.SafePosition(1);
            g_code += "M5\n";
            this.InsertEditCodes(g_code);
        },
        AddHolePosi(){
            this.XYarray.push({X:0,Y:0});
        },
        PopHolePosi(){
            this.XYarray.pop();
        },
    },


}
</script>