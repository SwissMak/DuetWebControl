<style scoped>
.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  max-width: 300px;
  margin: auto;
  text-align: center;
}

.title {
  color: grey;
  font-size: 18px;
}

button {
	border: none;
	color: white;
	/* background-color: rgb(23, 214, 39); */	
	text-align: center;
	width: 100%;
    border-radius: 16px;
    
}
.btnClick{
	background-color: greenyellow;
    color: #000;
}
.btnNoneClick{
	background-color: #000;
    /* color: white; */
    color: #000;
}
.toolPanelRadial{
    top: 18.7%;
    left: 48%;
    width: 23%;
    height: 69%;
    /* border: greenyellow;
    border-style:solid;
    border-width:1px; */
    position: absolute;
}
.toolPanelAxial{
    top: 18.7%;
    left: 73.5%;
    width: 23%;
    height: 69%;
    /* border: greenyellow;
    border-style:solid;
    border-width:1px; */
    position: absolute;
}
.toolPanelRadial_info{
    top: 6%;
    left: 1%;
    width: 23%;
    height: 20%;
    /* border: greenyellow;
    border-style:solid;
    border-width:1px; */
    position: absolute;
}
.toolPanelAxial_info{
    top: 6%;
    left: 24%;
    width: 23%;
    height: 20%;
    /* border: greenyellow;
    border-style:solid;
    border-width:1px; */
    position: absolute;
}

button:hover, a:hover {
  opacity: 0.7;
}
</style>
<template>
    
	<v-card>
		<v-card-title class="pb-0">            
			<v-icon small class="mr-1">mdi-wrench</v-icon> Tools Edit		
		</v-card-title>
		
		<v-card-text>
            <v-row>
				<v-col>
					<img src="/Turret Tool Menu.png" alt="_ctl.Name" style="width:100%">
                    <!-- <div class="toolPanelRadial_info">
                        <Radial-Info-Panel></Radial-Info-Panel>
                    </div>
                    <div class="toolPanelAxial_info"></div> -->
                    <div class="toolPanelRadial">
                        <v-row>
                            <v-col 
                            v-for="(_ctl, i) in Tools_Radial" 
                            :key="i"
                            cols="6">
                                <v-btn 
                                @click="SetControlRadial(i)"
                                block
                                :color="ChoosedModeRadial==i ? 'primary' : ''"
                                tile>
                                    {{_ctl.Name}}
                                </v-btn>
                            </v-col>
                        </v-row>                        
                    </div>
                    <div class="toolPanelAxial">
                        <v-row>
                            <v-col 
                            v-for="(_ctl, i) in Tools_Axial" 
                            :key="i"
                            cols="6">
                                <v-btn 
                                @click="SetControlAxial(i)"
                                block
                                :color="ChoosedModeAxial==i ? 'primary' : ''"
                                tile>
                                    {{_ctl.Name}}
                                </v-btn>
                            </v-col>
                        </v-row>  
                    </div>
				</v-col>                
			</v-row>
            <v-row>
                <v-col cols="6">
                    <Radial-Info-Panel></Radial-Info-Panel>
                </v-col>
                 <v-col cols="6">
                    <Axial-Info-Panel></Axial-Info-Panel>
                </v-col>
            </v-row>           
		</v-card-text>
	</v-card>    
</template>



<script>
'use strict'
import { mapState,mapGetters,mapActions } from 'vuex'
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
        async SetControlRadial(_no) {
            // let contextvalue = JSON.stringify(this.Tools_Radial);
            // console.log(contextvalue);
			if(_no == this.ChoosedModeRadial)return;
            this.ChoosedModeRadial = parseInt(_no);
			await this._SendCode(this.Tools_Radial[this.ChoosedModeRadial].sendcommand);          
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
                    returnstr = await this.sendCode({ code: __command, log: false });                    
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