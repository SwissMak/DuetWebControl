<template>
    
    <v-card>
        <v-card-title>
            <span class="headline">{{formTitle}}</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-row 
                v-show="isLathe">
                    <v-col>
                        <h1>{{MessageInfo.TurretName}}</h1>
                    </v-col>
                </v-row>
                <v-row
                v-show="isLathe">
                    <v-col
                    v-for="(tmp,index) in ToolTurretPathDatas"
                    :key="`ToolTurretPathDatas-${index}`"
                    cols="6"
                    sm="4"
                    md="2"
                    class="pa-5"
                    >
                        <v-card
                            v-if="tmp.tooltypeID >-1"
                            class="mx-auto"
                            max-width="200"
                            @click="SetToolNum(index)"
                        >
                            <v-img
                            :src="GetTypeIMG(tmp.tooltypeID,0)"
                            ></v-img>

                            <v-card-title
                            class="justify-center">
                            Tool {{index}} <br/> {{ tmp.toolName }}
                            </v-card-title>
                        </v-card>

                        <v-card
                            v-else
                            class="mx-auto"
                            max-width="200"
                        >
                            <v-card-title
                            class="justify-center">
                            Tool {{index}} {{MessageInfo.NoneSetting}}
                            </v-card-title>
                        </v-card>
                    </v-col>
                </v-row>
                
                <v-row
                v-show="!isLathe">
                    <v-col>
                        <h1>{{MessageInfo.MillingName}}</h1>
                    </v-col>
                </v-row>
                <v-row
                v-show="!isLathe">
                    <v-col
                    v-for="(tmp,index) in ToolMillingPathDatas"
                    :key="`Milling-${index}`"
                    cols="6"
                    sm="4"
                    md="2"
                    class="pa-5"
                    >
                        <v-card
                            v-if="tmp.tooltypeID >-1"
                            class="mx-auto"
                            max-width="200"
                            @click="SetToolNum(index+ TurretMax)"
                        >
                            <v-img
                            :src="GetTypeIMG(tmp.tooltypeID,1)"
                            ></v-img>

                            <v-card-title
                            class="justify-center">
                            Tool {{index + TurretMax}} <br/> {{ tmp.toolName }}
                            </v-card-title>
                        </v-card>

                        <v-card
                            v-else
                            class="mx-auto"
                            max-width="200"
                        >
                            <v-card-title
                            class="justify-center">
                            Tool {{index+TurretMax}} {{MessageInfo.NoneSetting}}
                            </v-card-title>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
            color="blue darken-1"
            text
            @click="CancelToolPanel"
            >
                Cancel
            </v-btn>
        </v-card-actions>
    </v-card>
    
</template>
<script>
'use strict'
import { mapState } from 'vuex'
export default {
    props: {
		isLathe: {
			type: Boolean,
			default: false
		}
	},
    computed: {
        formTitle () {
            return "Select Tool"
        },
        ...mapState('ToolSettings', {
            ToolMillingPathDatas: state => state.ToolMillingPathDatas,
            ToolTurretPathDatas: state => state.ToolTurretPathDatas,
            MessageInfo :state => state.MessageInfo,
            ToolType_Milling :state => state.ToolType_Milling,
            ToolType_Turret :state => state.ToolType_Turret,
            ToolDefault :state => state.ToolDefault,
            TurretMax :state => state.TurretMax,
            MillingMax :state => state.MillingMax,
        }),
    },
    methods: {
        GetTypeName(_oid,_type){
            if(_type == 0) return this.ToolType_Turret[_oid].TypeName;
            else return this.ToolType_Milling[_oid].TypeName;
        },
        GetTypeIMG(_oid,_type){
            if(_type == 0) return this.ToolType_Turret[_oid].IMG;
            else return this.ToolType_Milling[_oid].IMG;
        },
        CancelToolPanel(){
            this.$emit('CloseDig' , false);
        },
        SetToolNum(_index){
            this.$emit('SetToolNum' , _index);
        },
    },
	
}
</script>