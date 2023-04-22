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
                                        @click="Open_Sheet(0)"
                                        color="blue lighten-4">Roughing Tool : {{Routoolstruct.paraname}}</v-btn>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col sm=12 md=12 lg=4 xl=4>
                                        <MRR-Card
                                        v-bind:feedrate=ThreadParameters[3].datavalue
                                        v-bind:depthofcut=ThreadParameters[2].datavalue
                                        v-bind:WidthOfCut=GetWidthOfCut(0)
                                        v-bind:isLathe = true
                                        ></MRR-Card>
                                    </v-col>
                                    <v-col sm=12 md=12 lg=4 xl=4>
                                        <Chip-Load-Card
                                        v-bind:feedrate=ThreadParameters[3].datavalue
                                        v-bind:SpindleRPM=ThreadParameters[4].datavalue
                                        v-bind:CutterTooth=GetFlutes(0)
                                        v-bind:isLathe=true
                                        ></Chip-Load-Card>
                                    </v-col>
                                    <v-col sm=12 md=12 lg=4 xl=4>
                                        <Surface-Speed-Card
                                        v-bind:ToolDiameter=GetDiameter(0)
                                        v-bind:SpindleRPM=ThreadParameters[4].datavalue
                                        v-bind:isLathe=true
                                        ></Surface-Speed-Card>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col sm=12 md=12 lg=12 xl=12>
                        <v-card>
                            <v-card-title>
                                Finishing Pass
                                <v-spacer></v-spacer>
                                <v-checkbox
                                v-model="isDoFinish"
                                label="Run Finish"
                                ></v-checkbox>
                            </v-card-title>
                            <v-card-text
                            v-show="isDoFinish">
                                <v-row>
                                    <v-col sm=12 md=12 lg=6 xl=6
                                    v-for="(finishingPass, i) in FinishingPass"
                                    :key="`finishingPass-${i}`"
                                    >
                                        <v-text-field
                                        class="pa-2"
                                        v-model="finishingPass.datavalue" 
                                        :label="finishingPass.paraname" 
                                        prepend-icon="mdi-gamepad-variant"></v-text-field>
                                    </v-col>
                                    <v-col sm=12 md=12 lg=6 xl=6>
                                        <v-btn
                                        rounded
                                        @click="Open_Sheet(1)"
                                        color="blue lighten-4">finishing Tool : {{finitoolstruct.paraname}}</v-btn>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col sm=12 md=12 lg=4 xl=4>
                                        <MRR-Card
                                        v-bind:feedrate=FinishingPass[1].datavalue
                                        v-bind:depthofcut=FinishingPass[0].datavalue
                                        v-bind:WidthOfCut=GetWidthOfCut(1)
                                        v-bind:isLathe = true
                                        ></MRR-Card>
                                    </v-col>
                                    <v-col sm=12 md=12 lg=4 xl=4>
                                        <Chip-Load-Card
                                        v-bind:feedrate=FinishingPass[1].datavalue
                                        v-bind:SpindleRPM=ThreadParameters[4].datavalue
                                        v-bind:CutterTooth=GetFlutes(1)
                                        v-bind:isLathe=true
                                        ></Chip-Load-Card>
                                    </v-col>
                                    <v-col sm=12 md=12 lg=4 xl=4>
                                        <Surface-Speed-Card
                                        v-bind:ToolDiameter=GetDiameter(1)
                                        v-bind:SpindleRPM=ThreadParameters[4].datavalue
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
                    datavalue : 100,
                    codetype : "X",
                    unit:"mm",
                },
                {
                    paraname : "Start Z",
                    datavalue : 90,
                    codetype : "Z",
                    unit:"mm",
                },
            ],
            ThreadParameters :[
                {
                    paraname : "End X",
                    datavalue : 80,
                    codetype : "E",
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
                    datavalue : 1,
                    codetype : "P",
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
            FinishingPass :[
                {
                    paraname : "Finishing Pass",
                    datavalue : 0.1,
                    codetype : "U",
                    unit:"mm",
                },
                {
                    paraname : "Finishing Feedrate",
                    datavalue : 300,
                    codetype : "V",
                    unit:"mm/min",
                },
            ],
            sheet_turret : false,
            toolbtnSelected : 0,
            Routoolstruct:{
                paraname : "T1",
                datavalue : 1,
            },
            finitoolstruct:{
                paraname : "T3",
                datavalue : 3,
            },
            isDoFinish : true,
		}
	},	
	methods: {
        ...mapMutations('EditCodesSettings', ['InsertEditCodes']),
        getConsole(_value){
            console.log(_value);
        },
        GetFlutes(_idx){
            if(!this.ToolTurretPathDatas)return 0;
            if(_idx == 0)
                return parseFloat(this.ToolTurretPathDatas[this.Routoolstruct.datavalue].flutes, 10);
            else
                return parseFloat(this.ToolTurretPathDatas[this.finitoolstruct.datavalue].flutes, 10);
        },
        GetDiameter(_idx){
            if(!this.ToolTurretPathDatas)return 0;
            if(_idx == 0)
                return parseFloat(this.ToolTurretPathDatas[this.Routoolstruct.datavalue].Diameter, 10);
            else
                return parseFloat(this.ToolTurretPathDatas[this.finitoolstruct.datavalue].Diameter, 10);
        },//
        GetWidthOfCut(_idx){
            if(!this.ToolTurretPathDatas)return 0;
            if(_idx == 0)
                return parseFloat(this.ToolTurretPathDatas[this.Routoolstruct.datavalue].WidthOfCut, 10);
            else
                return parseFloat(this.ToolTurretPathDatas[this.finitoolstruct.datavalue].WidthOfCut, 10);
        },
        FindParaNameIndex(_value){
            const result = this.CuttingParameters.filter(x => x.paraname == _value);
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
        StartPosition(){
            let g_code="";
            g_code += "G0";
            for(let i=0 ; i< this.StartParameter.length ; i++ ){
                g_code = g_code + " " + this.StartParameter[i].codetype + String(this.StartParameter[i].datavalue);
            }
            g_code += "\n";
            return g_code;
        },
        CreateGCode(){   
            let g_code="";
            this.showcommon();
            g_code += this.SafePosition();
            g_code += this.Routoolstruct.paraname + "\n";
            g_code += this.StartPosition();
            g_code += "M2003";            
            //
            for(let i=0 ; i< this.StartParameter.length ; i++ ){
                g_code = g_code + " " + this.StartParameter[i].codetype + String(this.StartParameter[i].datavalue);
            }
            for(let i=0 ; i< this.ThreadParameters.length ; i++ ){
                if(i==0 && this.isDoFinish){
                    g_code = g_code + " " + this.ThreadParameters[i].codetype + String( parseFloat(this.ThreadParameters[i].datavalue) + parseFloat(this.FinishingPass[0].datavalue));
                }else
                    g_code = g_code + " " + this.ThreadParameters[i].codetype + String(this.ThreadParameters[i].datavalue);
            }
            g_code += "\n";
            if(this.isDoFinish){
                g_code += this.SafePosition();
                g_code += this.finitoolstruct.paraname + "\n";
                g_code += this.StartPosition();
                //finish pass
                g_code += "M2003";
                for(let i=0 ; i< this.StartParameter.length ; i++ ){
                    if(i==0){
                        //ThreadParameters   
                        g_code = g_code + " " + this.StartParameter[i].codetype + String(parseFloat(this.ThreadParameters[0].datavalue) + parseFloat(this.FinishingPass[i].datavalue));
                    }else
                        g_code = g_code + " " + this.StartParameter[i].codetype + String(this.StartParameter[i].datavalue);
                    
                }
                for(let i=0 ; i< this.ThreadParameters.length ; i++ ){
                    g_code = g_code + " " + this.ThreadParameters[i].codetype + String(this.ThreadParameters[i].datavalue);
                }
                g_code += "\n";
            }
            g_code += this.SafePosition();
            this.InsertEditCodes(g_code);
        },
        CloseDig(val){
            this.sheet_turret = val;
        },
        SetToolNum(idx){
            if( this.toolbtnSelected == 0 ){
                this.Routoolstruct.paraname = "T" + String(idx);
                this.Routoolstruct.datavalue = idx;
            }else{
                this.finitoolstruct.paraname = "T" + String(idx);
                this.finitoolstruct.datavalue = idx;
            }
            this.sheet_turret = false;
        },
        showcommon(){
            let strcom = ";***Below is Turning Cycle***\n";
            for(let i=0 ; i< this.StartParameter.length ; i++ ){
                strcom += "; "  + this.StartParameter[i].codetype + ":" + this.StartParameter[i].paraname + "\n";
            }
            for(let i=0 ; i< this.ThreadParameters.length ; i++ ){
                strcom += "; "  + this.ThreadParameters[i].codetype + ":" + this.ThreadParameters[i].paraname + "\n";
            }
            strcom += ";*******************\n";
            this.InsertEditCodes(strcom);
        },
        Open_Sheet(idx){
            this.toolbtnSelected = idx ;
            this.sheet_turret = true;
        }
    },


}
</script>