<template>
    <v-card
    elevation="2"
    >
        <v-card-text>
            <v-row>
                <v-col sm=12 md=12 lg=12 xl=12>
                    <v-row>
                        <v-col sm=12 md=12 lg=6 xl=6
                        v-for="(paradata, i) in ParameterDataArray"
                        :key="i"
                        >
                            <v-combobox 
                            v-if="i==6"
                            :label="paradata.paraname" 
                            dense 
                            hide-selected 
                            :items="toolItems"
                            prepend-icon="mdi-gamepad-variant"
                            class="pa-2"
                            v-model="paradata.datavalue">
                            </v-combobox>
                            <v-text-field
                            v-else
                            class="pa-2"
                            v-model="paradata.datavalue" 
                            :label="paradata.paraname" 
                            prepend-icon="mdi-gamepad-variant"></v-text-field>                   
                        </v-col>
                    </v-row>
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
import { mapMutations } from 'vuex'
export default {
	data() {
		return {     
            toolItems:[],  
            ParameterDataArray :[                
                {//0
                    paraname : "Start X (mm)",
                    datavalue : -10,
                    codetype : "C",
                },
                {//1
                    paraname : "End X (mm)",
                    datavalue : -20,
                    codetype : "L",
                },
                {//2
                    paraname : "Start Y (mm)",
                    datavalue : 100,
                    codetype : "L",
                },
                {//3
                    paraname : "End Y for Ending (mm)",
                    datavalue : 90,
                    codetype : "D",
                },
                {//4
                    paraname : "Start Z (mm)",
                    datavalue : 100,
                    codetype : "D",
                },
                {//5
                    paraname : "Feedrate X axis (mm/min)",
                    datavalue : 20,
                    codetype : "B",
                },
                {//6
                    paraname : "Tool number",
                    datavalue : "T1",
                    codetype : "W",
                },
                {//7
                    paraname : "Milling speed (RPM)",
                    datavalue : 1000,
                    codetype : "R",
                },
                {//8
                    paraname : "Headstock speed (RPM)",
                    datavalue : 500,
                    codetype : "S",
                },
                {//9
                    paraname : "Dwell (milliseconds)",
                    datavalue : 1000,
                    codetype : "t",
                },
                
            ],
		}
	},	
	methods: {
        ...mapMutations('EditCodesSettings', ['InsertEditCodes']),
        getConsole(_value){
            console.log(_value);
        },
        CreateGCode(){
            //let _temp = 0;
            let g_code="";
            //spindle RPM
            g_code += "M3 A" + String(this.ParameterDataArray[8].datavalue) + " S" + String(this.ParameterDataArray[7].datavalue);
            g_code += "\n";
            //choose tool
            g_code += String(this.ParameterDataArray[6].datavalue);
            g_code += "\n";
            //start X Z
            g_code += "G0"+ " X" + String(this.ParameterDataArray[0].datavalue)+ " Y" + String(this.ParameterDataArray[2].datavalue) + " Z" + String(this.ParameterDataArray[4].datavalue);
            g_code += "\n";
            g_code += "G1"+ " X" + String(this.ParameterDataArray[1].datavalue) + " F" + String(this.ParameterDataArray[5].datavalue);
            g_code += "\n";
            g_code += "G4 P" + String(this.ParameterDataArray[9].datavalue);
            g_code += "\n";
            //end back
            g_code += "G0"+ " Y" + String(this.ParameterDataArray[3].datavalue );
            g_code += "\n";
            g_code += "G0"+ " X" + String(this.ParameterDataArray[0].datavalue );
            g_code += "\n";
            //
            g_code += "M5 ; end program\n";
            this.InsertEditCodes(g_code);
        },
        Initialize(){
            for(let i=1 ; i<9 ; i++){
                this.toolItems.push("T"+String(i));
            }
        },
    },
    mounted() {
        this.Initialize();
    },


}
</script>