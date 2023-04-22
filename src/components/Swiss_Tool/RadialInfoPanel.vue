
<template>
	<v-card width="100%" height="100%">
		<v-card-title class="pb-0">            
			<v-icon small class="mr-1">mdi-lock-pattern</v-icon> Radial Infomations		
		</v-card-title>
		
		<v-card-text>
            <v-row>
                <v-col cols="6">
                    <v-text-field v-model="ToolParameters.Length" label="Length" prepend-icon="mdi-arrow-right"></v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-text-field v-model="ToolParameters.Diameter" label="Diameter" prepend-icon="mdi-arrow-right"></v-text-field>                    
                </v-col>
                <v-col cols="6">
                    <v-text-field v-model="ToolParameters.Tip_Radius" label="Tip_Radius" prepend-icon="mdi-arrow-right"></v-text-field>                     
                </v-col>
                <v-col cols="6">
                    <v-text-field v-model="ToolParameters.Xoffset" label="Xoffset" prepend-icon="mdi-arrow-right"></v-text-field>                     
                </v-col>
                <v-col cols="6">
                    <v-text-field v-model="ToolParameters.Yoffset" label="Yoffset" prepend-icon="mdi-arrow-right"></v-text-field>                     
                </v-col>
                <v-col cols="6">
                    <v-text-field v-model="ToolParameters.Zoffset" label="Zoffset" prepend-icon="mdi-arrow-right"></v-text-field>                     
                </v-col>
                <v-col cols="6">
                    <v-text-field v-model="ToolParameters.Uoffset" label="Uoffset" prepend-icon="mdi-arrow-right"></v-text-field>                     
                </v-col>
                <v-col cols="6">
                    <v-text-field v-model="ToolParameters.Voffset" label="Voffset" prepend-icon="mdi-arrow-right"></v-text-field>                     
                </v-col>
                <v-col cols="6">
                    <v-text-field v-model="ToolParameters.Woffset" label="Woffset" prepend-icon="mdi-arrow-right"></v-text-field>                                 
                </v-col>
                <v-col cols="6">
                    <v-btn color="info" @click="SaveDatas()">
                        <v-icon>mdi-content-save</v-icon> Save
                    </v-btn>
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
        ...mapMutations('ToolSettings', ['update','updateToolRadial']),
        async SetControlRadial() {
            this.ToolParameters = this.ToolSettings.Tools_Radial[0].ToolParameters;
            console.log(this.ToolSettings.Tools_Radial[0].ToolParameters);
        //     if(_no == this.ChoosedModeRadial)return;
        //    this.ChoosedModeRadial = _no;
        },
        async SetControlAxial() {
            this.ToolParameters = this.ToolSettings.Tools_Radial[0].ToolParameters;
            console.log(this.ToolSettings.Tools_Radial[0].ToolParameters);
			// if(_no == this.ChoosedModeAxial)return;
            // this.ChoosedModeAxial = parseInt(_no);
			// await this._SendCode(this.Tools_Axial[this.ChoosedModeAxial].sendcommand);
        },
        SaveDatasRadial() {
            if(this.Radial_index == -1)return;
            this.updateToolRadial(JSON.stringify({ index: 0, ToolParameters: this.ToolParameters }));
        },
        SaveDatasAxial() {
            if(this.Axial_index == -1)return;
            this.updateToolAxial(JSON.stringify({ index: 0, ToolParameters: this.ToolParameters }));
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
            Radial_index :-1,
            Axial_index :-1,
            ToolParameters:{
                Length :  0,
                Diameter : 0,
                Tip_Radius : 0,
                Xoffset : 0,
                Yoffset : 0,
                Zoffset : 0,
                Uoffset : 0,
                Voffset : 0,
                Woffset : 0,
            }
		};
		
	}
}
</script>