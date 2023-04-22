<template>
    
    <v-card
    dark
    :color="CircleColor(GETChipLoadComm)">
        <v-card-text>
            <v-row>
                <span>Chip Load</span>
            </v-row>
            <v-row>
                <span class="headline">{{GETChipLoadComm}}</span>
            </v-row>
            <v-row>
                <span>(mm/tooth)</span>
            </v-row>
            <v-row>
                <span class="headline">{{GETChipLoadCommInches}}</span>
            </v-row>
            <v-row>
                <span>(inch/tooth)</span>
            </v-row>
        </v-card-text>
    </v-card>
    
</template>
<script>
'use strict'
//import { mapState } from 'vuex'
export default {
    computed: {
        GETChipLoadComm(){
            if(this.isLathe)
                return (this.feedrate / this.SpindleRPM).toFixed(3);
            else
                return (this.feedrate / (this.SpindleRPM * this.CutterTooth)).toFixed(3);
        },
        GETChipLoadCommInches(){
            if(this.isLathe)
                return (this.feedrate * 0.0393 / this.SpindleRPM).toFixed(3);
            else
                return (this.feedrate * 0.0393 / (this.SpindleRPM * this.CutterTooth)).toFixed(3);
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
		feedrate: {
			type: Number,
			required: true,
            default: 1,
		},
		SpindleRPM: {
			type: Number,
            required: true,
			default: 1,
		},
		CutterTooth: {
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