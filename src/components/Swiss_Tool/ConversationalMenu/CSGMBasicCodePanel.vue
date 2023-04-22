<template>
    <v-card
    elevation="2"
    >
        <v-card-text>
            <template
            v-for="(item,index) in ParameterDataArray"
            >
                <v-row
                no-gutters
                :key="`row-${index}`"
                >
                    <v-col
                    sm=12 md=12 lg=3 xl=3>
                        <v-row>
                            <v-col>
                                <h1>{{item.paraname}}</h1>
                                <h6>{{item.paraps}}</h6>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col
                    sm=12 md=12 lg=6 xl=6>
                        <v-row
                        no-gutters>
                            <v-col
                            v-for="(subitem,subindex) in ParameterDataArray[index].paraconfig"
                            :key="`row-${index}-${subindex}`"
                            class="flex-shrink-1 hidden-sm-and-down"
                            sm=12 md=12 lg=3 xl=3>
                                <v-text-field
                                v-model="subitem.datavalue" 
                                :label="subitem.codetype"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col
                    class="flex-grow-0 flex-shrink-0"
                    sm=12 md=12 lg=3 xl=3>
                        <v-row>
                            <v-col>
                                <v-btn
                                @click="CreateGCode(index)"
                                rounded
                                color="primary">
                                    Add to code
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
                <v-divider
                no-gutters
                :key="`divider-${index}`"></v-divider>
            </template>
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
                {
                    paraname : "G0",
                    paraps:"Rapid Move",
                    paraconfig :[
                        {codetype : "X",datavalue : 0,},
                        {codetype : "Y",datavalue : 0,},
                        {codetype : "Z",datavalue : 0,},
                    ],
                },
                {
                    paraname : "G1",
                    paraps:"Controlled Move",
                    paraconfig :[
                        {codetype : "X",datavalue : 0,},
                        {codetype : "Y",datavalue : 0,},
                        {codetype : "Z",datavalue : 0,},
                        {codetype : "F",datavalue : 1000,},
                        
                    ],
                },
                {
                    paraname : "M3",
                    paraps:"Spindle On Clockwise",
                    paraconfig :[
                        {codetype : "A",datavalue : 0,},
                        {codetype : "B",datavalue : 0,},
                        {codetype : "C",datavalue : 0,},
                        
                    ],
                },
                {
                    paraname : "M4",
                    paraps:"Spindle On Counterclockwise",
                    paraconfig :[
                        {codetype : "A",datavalue : 0,},
                        {codetype : "B",datavalue : 0,},
                        {codetype : "C",datavalue : 0,},
                        
                    ],
                },
                {
                    paraname : "M5",
                    paraps:"Spindle Off",
                    paraconfig :[
                        
                    ],
                },
            ],
		}
	},	
	methods: {
        ...mapMutations('EditCodesSettings', ['InsertEditCodes']),
        getConsole(_value){
            console.log(_value);
        },
        CreateGCode(_idx){
            let g_code="";
            g_code += this.ParameterDataArray[_idx].paraname;
            for(let i=0 ; i< this.ParameterDataArray[_idx].paraconfig.length ; i++ ){
                g_code = g_code + " " + this.ParameterDataArray[_idx].paraconfig[i].codetype + String(this.ParameterDataArray[_idx].paraconfig[i].datavalue);
            }
            this.InsertEditCodes(g_code);
        }
    },


}
</script>