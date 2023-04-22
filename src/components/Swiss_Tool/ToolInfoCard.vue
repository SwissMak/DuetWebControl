<template>
    <v-card
        v-if="isShow"
        class="mx-auto"
        max-width="200"
        :color="isSelected?'light-blue lighten-5':''"
        @click="SetToolNum(indexvalue)"
    >
        <v-img
        :src="imgURL"
        ></v-img>

        <v-card-title
        class="justify-center">
        Tool {{indexvalue}} <br/> {{ toolName }}
        </v-card-title>
    </v-card>

    <v-card
        v-else
        class="mx-auto"
        max-width="200"
    >
        <v-card-title
        class="justify-center">
        {{NothingMSG}}
        </v-card-title>
    </v-card>
</template>
<script>
'use strict'
//import { mapState } from 'vuex'
export default {
    computed: {
    },
    methods: {
        SetToolNum(_index){
            this.$emit('SetToolNum' , _index);
        },
    },
    props: {
		isSelected: {
			type: Boolean,
			default: false
		},
		isShow: {
			type: Boolean,
			default: false
		},
        indexvalue: {
			type: Number,
            default: 0,
		},
        imgURL: {
			type: String,
            default: "",
		},
        toolName: {
			type: String,
            default: "",
		},
        NothingMSG: {
			type: String,
            default: "",
		},
	},
	
}
</script>