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

.toolPanelRadial{
    top: 24%;
    left: 50.5%;
    width: 18%;
    height: 69%;
    /* border: greenyellow;
    border-style:solid;
    border-width:1px; */
    position: absolute;
}
.toolPanelAxial{
    top: 24%;
    left: 75%;
    width: 18%;
    height: 69%;
    /* border: greenyellow;
    border-style:solid;
    border-width:1px; */
    position: absolute;
}
.SeletedTool_Turning{
    top: 30%;
    left: 16.5%;
    width: 3%;
    height: 20%;
    border: greenyellow;
    border-style:solid;
    border-width:5px;
    position: absolute;
}
.SeletedTool_Facing{
    top: 33%;
    left: 25%;
    width: 3%;
    height: 20%;
    border: greenyellow;
    border-style:solid;
    border-width:5px;
    position: absolute;
    transform: rotate(45deg);
}
.SeletedTool_Threading{
    top: 45%;
    left: 28.5%;
    width: 3%;
    height: 20%;
    border: greenyellow;
    border-style:solid;
    border-width:5px;
    position: absolute;
    transform: rotate(90deg);
}
.SeletedTool_TCenter{
    top: 61%;
    left: 18%;
    width: 3%;
    height: 20%;
    border: greenyellow;
    border-style:solid;
    border-width:5px;
    position: absolute;
}
.SeletedTool_Grooving{
    top: 58%;
    left: 26%;
    width: 4%;
    height: 20%;
    border: greenyellow;
    border-style:solid;
    border-width:5px;
    position: absolute;
    transform: rotate(135deg);
}
.SeletedTool_Boring{
    top: 59%;
    left: 27%;
    width: 5%;
    height: 7%;
    border: greenyellow;
    border-style:solid;
    border-width:5px;
    position: absolute;
    border-radius: 50%;
}
.SeletedTool_InterThreading{
    top: 46%;
    left: 27%;
    width: 5%;
    height: 7%;
    border: greenyellow;
    border-style:solid;
    border-width:5px;
    position: absolute;
    border-radius: 50%;
}

button:hover, a:hover {
  opacity: 0.7;
}
</style>
<template>    
	<v-card>
		<v-card-title class="pb-0">            
			<v-icon small class="mr-1">mdi-wrench</v-icon> Tools		
		</v-card-title>
		
		<v-card-text>
            <v-row>
				<v-col>
                    <div :class="SelectedTool"></div>
					<img src="/Turret Tool Menu.png" alt="_ctl.Name" style="width:100%">
                    <div class="toolPanelRadial">
                        <v-row>
                            <v-col
                            cols="12"
                            sm="12"
                            md="12"
                            v-for="i in ToolRadial" 
                            :key="i"
                            >
                                <v-btn 
                                @click="SetControlRadial(i)"
                                block
                                :color="ChoosedMode==i ? 'primary' : ''"
                                tile>
                                    <!-- {{_ctl.Name}} -->
                                    {{i}}
                                </v-btn>
                            </v-col>
                        </v-row> 
                    </div>
                    <div class="toolPanelAxial">
                        <v-row>
                            <v-col
                            cols="12"
                            sm="12"
                            md="12"
                            v-for="i in ToolAxial" 
                            :key="i"
                            >
                                <v-btn
                                @click="SetControlRadial(i)"
                                block
                                :color="ChoosedMode==i+ToolRadial.length ? 'primary' : ''"
                                tile>
                                    <!-- {{_ctl.Name}} -->
                                        {{i}}
                                </v-btn>
                            </v-col>                            
                        </v-row>  
                    </div>                    
				</v-col>                
			</v-row>          
		</v-card-text>
	</v-card>    
</template>



<script>
'use strict'
import { mapGetters,mapActions,mapState,mapMutations } from 'vuex'
export default {
	computed: {
        ...mapGetters(['isConnected']),
        ...mapGetters(['uiFrozen']),
        ...mapState('ToolSettings', {
            ToolsParameter: state => state.Tools_turrent,
            Tools_Path_turrent: state => state.Tools_Path_turrent,
            // Tools_Path_turrent_Radial() {
            //     let _flag = false;
            //     let _array =[];
            //     for(let i=0 ; i<this.Tools_Path_turrent.length ; i++ ){
            //         _flag = false;
            //         for(let j=0 ; j< this.ToolsParameter.length ; j++){
            //             if(this.Tools_Path_turrent[i] == this.ToolsParameter[j].oid){
            //                 _array.push({text: this.ToolsParameter[j].name,value: this.ToolsParameter[j].oid});
            //                 _flag = true;
            //             }
            //         }
            //     }
            //     // return this.Tools_Path_turrent
            //     //     .map(x => ({
            //     //         text: x.name,
            //     //         value: x.oid
            //     //     }), this);
            // },
        }),
        SelectedTool(){
            switch(this.ChoosedMode){
                case 0:
                    return "SeletedTool_Turning";
                case 1:
                    return "SeletedTool_Facing";
                case 2:
                    return "SeletedTool_Threading";
                case 3:
                    return "SeletedTool_TCenter";
                case 4:
                    return "SeletedTool_Grooving";
                case 5:
                    return "SeletedTool_Boring";
                case 6:
                    return "SeletedTool_InterThreading";
            }
            return "";
        },
	},
	methods:{
        ...mapMutations('ToolSettings', ['LoadParameter_Tools_turrent','LoadParameter_Tools_Path_turrent','updateToolAllparas']),
        ...mapActions('machine', ['sendCode','download','upload']),
        async SetControlRadial(_no) {
            _no -=1 ;
            //console.log("T"+String(_no));
			// if(_no == this.ChoosedMode)return;
            // this.ChoosedMode = parseInt(_no);
			await this._SendCode("T" + String(_no));
        },
        SetControlAxial(_no) {
            _no -=1 ;
            console.log(_no);
			// if(_no == this.ChoosedMode + this.ToolRadial.length)return;  
            // this.ChoosedMode = parseInt(_no) + this.ToolRadial.length;
			// await this._SendCode(this.ToolAxial[_no].sendcommand);
        },
		async _SendCode(__command){
            if(this.isConnected == false){
                console.log("not connect!");
                return "";
            }
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
        async loadFile(filename) {
            try {
				filename = "0:/sys/"+ filename +".g";
				const response = await this.download({ filename, type: 'text', showSuccess: false });
				return response;
			} catch (e) {
				alert(e);
			}
		},
        async initialize() {
            try {
                let getvalue = await this.loadFile(this.ToolParameterFileName);
                //console.log(getvalue);
                await this.LoadParameter_Tools_turrent(getvalue);
                getvalue = await this.loadFile(this.ToolParameterFileNamePath);
                //console.log(getvalue);
                await this.LoadParameter_Tools_Path_turrent(getvalue);
                //
                this.updateToolAllparas(true);
			} catch (e) {
				alert(e);
			}
		},
	},
	data(){
		return {
            isLoadDatas : false,
            ToolParameterFileName : "ToolsParameters",
            ToolParameterFileNamePath : "Tools_Path_turrent",
            isSending : false,
            ChoosedMode:0,
            ToolRadial:[1,3,5,7],
            ToolAxial:[2,4,6,8],
		};
		
    },
    // watch: {
    //     isConnected(to) {
	// 		if (to) {
	// 			// connet is true
	// 			if(this.isLoadDatas == false){
	// 				this.initialize();
	// 				this.isLoadDatas = true;
	// 			}
	// 		}
	// 	},
    // },
}
</script>