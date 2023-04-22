<template>
    
    <v-card
    dark
    :color="CircleColor(GETSurfaceSpeedComm)">
        <v-card-text>
            <v-row>
                <span>Surface Speed</span>
            </v-row>
            <v-row>
                <span class="headline">{{GETSurfaceSpeedComm}}</span>
            </v-row>
            <v-row>
                <span>(m/min)</span>
            </v-row>
            <v-row>
                <span class="headline">{{GETSurfaceSpeedCommInches}}</span>
            </v-row>
            <v-row>
                <span>(SFM)</span>
            </v-row>
        </v-card-text>
    </v-card>
    
</template>
<script>
'use strict'
//import { mapState } from 'vuex'
export default {
    computed: {
        GETSurfaceSpeedComm(){
            return (this.ToolDiameter * this.SpindleRPM * this.GetCoefficient ).toFixed(3);
        },
        GETSurfaceSpeedCommInches(){
            return (this.ToolDiameter * this.SpindleRPM * this.GetCoefficient * 3.2808 ).toFixed(3);
        },
        GetCoefficient(){
            return Math.PI / 1000;
        },
    },
    methods: {
        CircleColor(_value){
			if(_value < 120){
				return "primary";
			}else if(_value < 140){
				return "teal";
			}else if(_value < 160){
				return "amber";
			}else{
				return "red";
			}
		},
    },
    props: {
		ToolDiameter: {
			type: Number,
			required: true,
            default: 1,
		},
		SpindleRPM: {
			type: Number,
            required: true,
			default: 1,
		},
		isLathe: {
			type: Boolean,
			default: false
		}
	},
	
}
</script>