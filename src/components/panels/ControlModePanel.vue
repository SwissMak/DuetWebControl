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
	padding: 8px;
	color: white;
	/* background-color: rgb(23, 214, 39); */
	background-color: #000;
	text-align: center;
	width: 100%;
}
.btnClick{
	background-color: greenyellow;
}
.btnNoneClick{
	background-color: rgb(0, 0, 0);
}

button:hover, a:hover {
  opacity: 0.7;
}
</style>
<template>
    
	<v-card>
        
		<v-card-title class="pb-0">
			<v-icon small class="mr-1">mdi-telegram</v-icon> Control Mode
		</v-card-title>
		
		<v-card-text> 
			<v-row>
				<v-col
				v-for="(_ctl, i) in ControlMode"
                :key="i"
				sm=12 md=12 lg=3 xl=3
				>
					<button 
					:class="(i == SelectedMode? 'btnClick':'btnNoneClick')" 
					@click="SetControl(i)">
						<h2>{{_ctl.sendcommand}}</h2>
						<img 
						:src="_ctl.img_src" 
						:alt="_ctl.Name" 
						style="width:100%;height:250px"
						:title="_ctl.Name"
						>
					</button>
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
		...mapGetters(['isConnected']),
		...mapState('machine/model', {
			machineMode: state => state.state.machineMode,
		}),
		SelectedMode () {
            if(this.machineMode == "Lathe Mode - Radius" || this.machineMode == "Lathe Mode - Diameter"){
				return 0;
			}else if(this.machineMode == "Milling Mode"){
				return 1;
			}else if(this.machineMode == "HMC Mode"){
				return 2;
			}else if(this.machineMode == "5 Axis BC Mode"){
				return 3;
			}else if(this.machineMode == "Lathe Mode - Tailstock"){
				return 4;
			}else if(this.machineMode == "Milling Mode - Tailstock"){
				return 5;
			}else if(this.machineMode == "HMC Mode - Tailstock"){
				return 6;
			}else if(this.machineMode == "5 Axis BC Mode - Tailstock"){
				return 7;
			}else{
				return 0;
			}
        },
	},
	methods:{
		...mapActions('machine', ['sendCode']),
        SetControl(_no) {
			if(_no == this.SelectedMode)return;
			this._SendCode(this.ControlMode[_no].sendcommand);          
		},
		_SendCode(__command){   
            let returnstr;         
            if(this.isSending){
                return "";
            }else{
                this.isSending = true;
                try {
                    returnstr = this.sendCode({ code: __command, log: false });                    
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
			//isLoadDatas : false,
			isSending : false,
			ControlMode:[
                // {
                //     img_src: "/defaut_mode.png",
				// 	Name: "Machine 5 axis VMC",
				// 	sendcommand: `M456`,
				// 	//sendcommand: `M98 P"/macros/default_mode_setting.g"`,
				// },
				{
                    img_src: "/Lathe Mode Icon.png",
					Name: "Lathe Mode",
					sendcommand: `M454`,
				},
				{
                    img_src: "/4 Axis Milling Mode Icon.jpg",
					Name: "4 Axis Milling Mode",
					sendcommand: `M455`,
                },
				{
                    img_src: "/HMC Mode Icon.jpg",
					Name: "HMC Mode",
					sendcommand: `M457`,
                },
				{
                    img_src: "/5 Axis BC Mode Icon.jpg",
					Name: "5 Axis BC Mode",
					sendcommand: `M458`,
                },
				// {
                //     img_src: "/LatheMode_Tailstock.png",
				// 	Name: "Lathe Mode - Tailstock",
				// 	sendcommand: `M459`,
                // },
				// {
                //     img_src: "/MillingMode_Tailstock.png",
				// 	Name: "Milling Mode - Tailstock",
				// 	sendcommand: `M461`,
                // },
				// {
                //     img_src: "/HMCMode_Tailstock.png",
				// 	Name: "HMC Mode - Tailstock",
				// 	sendcommand: `M462`,
                // },
				// {
                //     img_src: "/FiveAxisBCMode_Tailstock.png",
				// 	Name: "5 Axis BC Mode - Tailstock",
				// 	sendcommand: `M463`,
                // },
            ],
		};
		
	},
}
</script>