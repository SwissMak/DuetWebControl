<template>
    <div>
        <v-row> 
            <v-col>
                <v-btn class="hidden-sm-and-down mr-2" 
                :disabled="uiFrozen"
                color="primary"
                @click="showNewFile = true">
                    <v-icon class="mr-1">mdi-file-plus</v-icon> Save to Job
                </v-btn>
            </v-col>
            <v-col>
                <v-btn
                class="mr-2"
                color="primary"
                @click="CopyData()"
                >COPY</v-btn>
            </v-col>
            <v-col>
                <v-btn
                color="primary"
                @click="clearDatas()"
                >clear</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-textarea
                    height="600px"
                    id="testing-code"
                    outlined
                    label="G codes"
                    :value="innerValue"
                    @input.passive="valueChanged = true"
                    @blur="innerValue = $event.target.value"
                ></v-textarea>
            </v-col>
        </v-row>
        <new-file-dialog 
        :shown.sync="showNewFile"
        :value = "innerValue"
        :directory="directory"></new-file-dialog>
    </div>
</template>

<script>
'use strict'
import { mapMutations, mapState , mapGetters } from 'vuex'
import Path from '../../utils/path.js'

export default {
    computed: {
        ...mapGetters(['uiFrozen']),
        innerValue: {
            get: function() {
                return this.$store.state.EditCodesSettings.EditCodes;
            },
            set: function(_value) {
                this.UpdateEditCodes(_value);
            },
        },
        ...mapState('machine/model', {
			gcodeDirectory: state => state.directories.gCodes
		}),
    },
	data() {
		return {
            valueChanged : false,
            showNewFile: false,
            directory: Path.macros,
		}
	},	
	methods: {
        ...mapMutations('EditCodesSettings', ['UpdateEditCodes','ClearEditCodes']),
        getConsole(){
            console.log(this.directory);
        },
        CopyData(){
            let testingCodeToCopy = document.getElementById('testing-code');
            testingCodeToCopy.setAttribute('type', 'text');
            testingCodeToCopy.select();
            try {
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
                alert('Code was copied ' + msg);
            } catch (err) {
                alert('Oops, unable to copy');
            }
        },
        clearDatas(){
            this.ClearEditCodes("");
        },
    },
    mounted() {
		this.directory = this.gcodeDirectory;
	},

}
</script>