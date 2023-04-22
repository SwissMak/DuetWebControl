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
                            <v-text-field
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
            ParameterDataArray :[                
                {//0
                    paraname : "Start X (mm)",
                    datavalue : 30,
                    codetype : "C",
                },
                {//1
                    paraname : "End X (mm)",
                    datavalue : 10,
                    codetype : "L",
                },
                {//2
                    paraname : "Start Y (mm)",
                    datavalue : 20,
                    codetype : "D",
                },
                {//3
                    paraname : "End Y (mm)",
                    datavalue : 20,
                    codetype : "B",
                },
                {//4
                    paraname : "Z Position (mm)",
                    datavalue : 100,
                    codetype : "W",
                },
                {//5
                    paraname : "Millingspindle speed (RPM)",
                    datavalue : 3000,
                    codetype : "R",
                },
                {//6
                    paraname : "Teeth (mm)",
                    datavalue : 50,
                    codetype : "S",
                },
                {//7
                    paraname : "Feedrate X/Y axis (mm/min)",
                    datavalue : 10,
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
            let _temp = 0;
            let g_code="";
            //headstock RPM
            _temp = Math.round( this.ParameterDataArray[5].datavalue / this.ParameterDataArray[6].datavalue);
            g_code += "M3 A" + String(_temp) + " B" + String(this.ParameterDataArray[5].datavalue);
            g_code += "\n";
            g_code += "G0 X" + String(this.ParameterDataArray[0].datavalue) + " Y" + String(this.ParameterDataArray[2].datavalue)+ " Z" + String(this.ParameterDataArray[4].datavalue);
            g_code += "\n";
            g_code += "G1 X" + String(this.ParameterDataArray[1].datavalue) + " Y" + String(this.ParameterDataArray[3].datavalue) + " F" + String(this.ParameterDataArray[7].datavalue);
            g_code += "\n";
            g_code += "G4 P" + String(this.ParameterDataArray[8].datavalue);
            g_code += "\n";
            g_code += "G0 X" + String(this.ParameterDataArray[0].datavalue) + " Y" + String(this.ParameterDataArray[2].datavalue);
            g_code += "\n";
            g_code += "M5";
            g_code += "\n";
            //  
            this.InsertEditCodes(g_code);
        }
    },


}
</script>