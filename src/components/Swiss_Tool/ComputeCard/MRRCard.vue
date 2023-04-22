<template>
    
    <v-card
    dark
    :color="CircleColor(GetMappingLoad)">
        <v-card-text>
            <v-row>
                <span>Metal Removal Rate</span>
            </v-row>
            <v-row>
                <span class="headline">{{GETMMRComm}}</span>
            </v-row>
            <v-row>
                <span>(cm3/min)</span>
            </v-row>
            <v-row>
                <span class="headline">{{GETMMRCommInches}}</span>
            </v-row>
            <v-row>
                <span>(inches3/min)</span>
            </v-row>
        </v-card-text>
    </v-card>
    
</template>
<script>
'use strict'
//import { mapState } from 'vuex'
export default {
    computed: {
        GETMMRComm(){
            return (this.feedrate * this.depthofcut * this.WidthOfCut / 1000).toFixed(3);
            //return 32.8;
        },
        GETMMRCommInches(){
            return (this.feedrate * this.depthofcut * this.WidthOfCut * 0.3937 * 0.3937 * 0.3937 / 1000).toFixed(3);
            //return 32.8;
        },
        GetMappingLoad(){
            if(this.isLathe)
            {
                return 3.04878 * this.GETMMRComm;
            }
            else{
                return 6.09756 * this.GETMMRComm;
            }
        },
        GetCircleConfig(){
            if(this.isCircle)
            {
                return 3.04878 * this.GETMMRComm;
            }
            else{
                return 1;
            }
        }
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
            default: 1,
		},
		depthofcut: {
			type: Number,
			default: 1,
		},
		WidthOfCut: {
			type: Number,
			default: 1,
		},
		isLathe: {
			type: Boolean,
			default: false
		},
        isCircle: {
			type: Boolean,
			default: false
		}
	},
	
}
</script>