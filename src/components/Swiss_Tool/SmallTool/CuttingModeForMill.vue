<template>
    <v-combobox
    label="Mode" dense hide-selected 
    :items="CuttingMode"
    @change="GetIndexNumber"
    v-model="CuttingModeValue"></v-combobox>
</template>
<script>
'use strict'
//import { mapState } from 'vuex'
export default {
    computed: {
        CuttingMode(){
            return ["M19(no clamp)","Harmonic","M19(clamp)"];
        },
    },
    methods: {
        GetIndexNumber(){
            const result = this.CuttingMode.findIndex(x => x == this.CuttingModeValue);
            if(result)return this.$emit('ModeIdx', result);
            else return this.$emit('ModeIdx', 0);
        },
    },
    props: {
	},
    data() {
		return {
            CuttingModeValue :"M19(no clamp)",
		}
	},
	
}
</script>