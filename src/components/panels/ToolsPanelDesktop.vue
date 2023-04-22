
<template>
	<v-card>
		<v-card-title class="pb-0">            
			<v-icon small class="mr-1">mdi-wrench</v-icon> Tools			
		</v-card-title>
		
		<v-card-text>
            <v-row>
                <!-- <v-col>
                    <v-combobox v-on:change="SetToolRadial($event.value)" label="Tool Radial" dense hide-selected :items="ToolRadialitems"></v-combobox>
                </v-col>
                <v-col>
                    <v-combobox v-on:change="SetToolAxial($event.value)" label="Tool Axial" dense hide-selected :items="ToolAxialitems"></v-combobox>
                </v-col> -->
                <v-col cols="6">
                    <v-card width="100%" height="100%" class="pa-1">
                        <v-row 
                        justify="center">
                            Tool Radial
                        </v-row>
                        <v-row>
                            <v-col 
                                v-for="(_ctl, i) in Tools_Radial" 
                                :key="i"
                                cols="6">
                                <v-btn 
                                :color="ChoosedModeRadial==i ? 'primary' : ''"
                                @click="SetControlRadial(i)"
                                block
                                rounded
                                >
                                    {{_ctl.Name}}
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
                <v-col cols="6">
                    <v-card width="100%" height="100%" class="pa-1">
                        <v-row
                        justify="center">
                            Tool Axial
                        </v-row>
                        <v-row>
                            <v-col 
                                v-for="(_ctl, i) in Tools_Radial" 
                                :key="i"
                                cols="6">
                                    <v-btn 
                                    :color="ChoosedModeAxial==i ? 'primary' : ''"
                                    @click="SetControlAxial(i)"
                                    block
                                    rounded
                                    >
                                        {{_ctl.Name}}
                                    </v-btn>
                                </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
		</v-card-text>
	</v-card>
</template>

<script>
'use strict'
import { mapState,mapGetters,mapMutations,mapActions } from 'vuex'
export default {
	computed: {
        ...mapGetters(['uiFrozen']),
        ...mapState('ToolSettings', ['Tools_Radial','Tools_Axial']),
        ...mapState(['ToolSettings']),
        ChoosedModeRadial: {
			get() { return this.ToolSettings.ChoosedModeRadial; },
			set(value) { this.update({ ChoosedModeRadial: value }); }
        },
        ChoosedModeAxial: {
			get() { return this.ToolSettings.ChoosedModeAxial; },
			set(value) { this.update({ ChoosedModeAxial: value }); }
		},
	},
	methods:{
        ...mapActions('machine', ['sendCode']),
        ...mapMutations('ToolSettings', ['update']),
        async SetControlRadial(_no) {
            if(_no == this.ChoosedModeRadial)return;
           this.ChoosedModeRadial = _no;        
        },
        async SetControlAxial(_no) {
			if(_no == this.ChoosedModeAxial)return;
            this.ChoosedModeAxial = parseInt(_no);
			await this._SendCode(this.Tools_Axial[this.ChoosedModeAxial].sendcommand);          
        },
		async _SendCode(__command){   
            let returnstr;         
            if(this.isSending){
                return "";
            }else{
                this.isSending = true;
                try {
                    returnstr = await this.sendCode({ code: __command, log: true });                    
                } catch (error) {   
                    console.log(error);                 
                }
                this.isSending = false;
                return returnstr;
            }
        },
	},
	data(){
		return {
            isSending : false,           
		};
		
	}
}
</script>