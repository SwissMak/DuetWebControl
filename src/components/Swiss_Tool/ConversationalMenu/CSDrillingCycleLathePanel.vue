<template>
    <div>
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
                            <v-card-title>Thread Parameters</v-card-title>
                            <v-card-text>
                                <v-row>
                                    <v-col sm=12 md=12 lg=6 xl=6
                                    v-for="(threadParameters, i) in ThreadParameters"
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
                                        @click="Open_Sheet()"
                                        color="blue lighten-4">Tool : {{toolstruct.paraname}}</v-btn>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col sm=12 md=12 lg=4 xl=4>
                                        <MRR-Card
                                        v-bind:feedrate=GetFeedrate()
                                        v-bind:depthofcut=GetDepthofCut
                                        v-bind:WidthOfCut=GetWidthOfCut(0)
                                        v-bind:isLathe = true
                                        ></MRR-Card>
                                    </v-col>
                                    <v-col sm=12 md=12 lg=4 xl=4>
                                        <Chip-Load-Card
                                        v-bind:feedrate=GetFeedrate()
                                        v-bind:SpindleRPM=GetSpindleRPM()
                                        v-bind:CutterTooth=GetFlutes(0)
                                        v-bind:isLathe=true
                                        ></Chip-Load-Card>
                                    </v-col>
                                    <v-col sm=12 md=12 lg=4 xl=4>
                                        <Surface-Speed-Card
                                        v-bind:ToolDiameter=GetDiameter(0)
                                        v-bind:SpindleRPM=GetSpindleRPM()
                                        v-bind:isLathe=true
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
        <v-dialog 
        v-model="sheet_turret"
        @click="sheet_turret = false"
        ><Tool-List @CloseDig="CloseDig" v-bind:isLathe = true  @SetToolNum="SetToolNum"></Tool-List></v-dialog>
    </div>
</template>


<script>
'use strict'
import { mapMutations , mapState } from 'vuex'
export default {
    computed: {
        ...mapState('ToolSettings', {
            ToolTurretPathDatas: state => state.ToolTurretPathDatas,
        }),
        GetDepthofCut(){
            return this.FindParaNameIndex("Distance of each pecking");
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
            ThreadParameters :[
                {
                    paraname : "Start Z",
                    datavalue : 100,
                    codetype : "Z",
                    unit:"mm",
                },
                {
                    paraname : "End Z",
                    datavalue : 80,
                    codetype : "U",
                    unit:"mm",
                },
                {
                    paraname : "X Position",
                    datavalue : 70,
                    codetype : "X",
                    unit:"mm",
                },
                {
                    paraname : "Distance of each pecking",
                    datavalue : 2,
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
                    datavalue : 1000,
                    codetype : "S",
                    unit:"RPM",
                },
            ],
            sheet_turret : false,
            toolstruct:{
                paraname : "T1",
                datavalue : 1,
            },
            isDoFinish : true,
		}
	},
	methods: {
        ...mapMutations('EditCodesSettings', ['InsertEditCodes']),
        getConsole(_value){
            console.log(_value);
        },
        GetFlutes(){
            if(!this.ToolTurretPathDatas)return 0;
            return parseInt(this.ToolTurretPathDatas[this.toolstruct.datavalue].flutes, 10)
        },
        GetDiameter(){
            if(!this.ToolTurretPathDatas)return 0;
            return parseInt(this.ToolTurretPathDatas[this.toolstruct.datavalue].Diameter, 10);
        },//
        GetWidthOfCut(){
            if(!this.ToolTurretPathDatas)return 0;
            return parseInt(this.ToolTurretPathDatas[this.toolstruct.datavalue].WidthOfCut, 10);
        },
        GetFeedrate(){
            return this.FindParaNameIndex("Feedrate");
        },
        GetSpindleRPM(){
            return this.FindParaNameIndex("Spindle Speed");
        },
        FindParaNameIndex(_value){
            const result = this.ThreadParameters.filter(x => x.paraname == _value);
            return result[0].datavalue;
        },
        FindStartNameIndex(_value){
            const result = this.StartParameter.filter(x => x.paraname == _value);
            return result[0].datavalue;
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
        CreateGCode(){   
            let g_code="";
            this.showcommon();
            g_code += this.SafePosition();
            g_code += this.toolstruct.paraname + "\n";
            g_code += "M2009";
            //
            for(let i=0 ; i< this.ThreadParameters.length ; i++ ){
                g_code = g_code + " " + this.ThreadParameters[i].codetype + String(this.ThreadParameters[i].datavalue);
            }
            g_code += "\n";
            g_code += this.SafePosition();
            this.InsertEditCodes(g_code);
        },
        CloseDig(val){
            this.sheet_turret = val;
        },
        SetToolNum(idx){
            this.toolstruct.paraname = "T" + String(idx);
            this.toolstruct.datavalue = idx;
            this.sheet_turret = false;
        },
        showcommon(){
            let strcom = ";***Below is Lathe Drilling***\n";
            for(let i=0 ; i< this.ThreadParameters.length ; i++ ){
                strcom += "; "  + this.ThreadParameters[i].codetype + ":" + this.ThreadParameters[i].paraname + "\n";
            }
            strcom += ";*******************\n";
            this.InsertEditCodes(strcom);
        },
        Open_Sheet(){
            this.sheet_turret = true;
        }
    },


}
</script>