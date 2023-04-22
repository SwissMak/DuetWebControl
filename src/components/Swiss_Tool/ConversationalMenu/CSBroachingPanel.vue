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
                            v-if="i==4"
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
'use strict'
import { mapMutations } from 'vuex'
export default {
	data() {
		return {     
            toolItems:[],  
            ParameterDataArray :[                
                {//0
                    paraname : "Start X (mm)",
                    datavalue : 100,
                    codetype : "C",
                },
                {//1
                    paraname : "Start Z (mm)",
                    datavalue : -130,
                    codetype : "L",
                },
                {//2
                    paraname : "End Z (mm)",
                    datavalue : -125,
                    codetype : "D",
                },
                {//3
                    paraname : "Start angle (degree)",
                    datavalue : 20,
                    codetype : "B",
                },
                {//4
                    paraname : "Tool number",
                    datavalue : "T1",
                    codetype : "W",
                },
                {//5
                    paraname : "Number of teeth",
                    datavalue : 5,
                    codetype : "R",
                },
                {//6
                    paraname : "Angle of per Teeth (mm)",
                    datavalue : 10,
                    codetype : "S",
                },
                {//7
                    paraname : "Feedrate Z axis (mm/min)",
                    datavalue : 1000,
                    codetype : "X",
                },
                {//8
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
            let _cycle = this.ParameterDataArray[5].datavalue;
            let _sumAngle = 0;
            //headstock RPM
            //_temp = Math.round( this.ParameterDataArray[5].datavalue / this.ParameterDataArray[6].datavalue);
            // g_code += "M3 A" + String(_temp) + " B" + String(this.ParameterDataArray[5].datavalue);
            // g_code += "\n";
            //choose tool
            g_code += String(this.ParameterDataArray[4].datavalue);
            g_code += "\n";
            _sumAngle = this.ParameterDataArray[3].datavalue;
            for(let i=0 ; i<_cycle ; i++){
                //start X Z
                _sumAngle =  this.ParameterDataArray[3].datavalue + this.ParameterDataArray[5].datavalue * i;
                g_code += "G0 Z" + String(this.ParameterDataArray[0].datavalue);
                g_code += "\n";
                g_code += "G0 X" + String(this.ParameterDataArray[1].datavalue);
                g_code += "\n";
                g_code += "M19 S" + String(_sumAngle);
                g_code += "\n";
                g_code += "G4 P2000";
                g_code += "\n";
                g_code += "G1 Z" + String(this.ParameterDataArray[2].datavalue) + " F" + String(this.ParameterDataArray[7].datavalue);
                g_code += "\n";
                g_code += "G4 P" + String(this.ParameterDataArray[8].datavalue);
                g_code += "\n";
                g_code += "G0 X" + String(this.ParameterDataArray[1].datavalue + 10 );
                g_code += "\n";
            }
            g_code += "G30 ; end program\n";
            //  
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