
<style scoped>
.btn-toggle {
	flex-direction: column;
}
</style>
<template>
	<div>
		<v-row>
			<v-col>
				
			</v-col>
		</v-row>
		<v-row>
			<v-col xs="12" sm="12" md="2" lg="2" xl="2">
				<v-btn-toggle 
				class="btn-toggle"
				:value="0" mandatory>
					<v-btn 
						v-for="(_tool, i) in ToolArrays"
						:key="i"
						text 
						:value="_tool.toolvalue" 
						@click="SwitchFuction(_tool.toolvalue)">
						{{_tool.toolname}}
					</v-btn>				
				</v-btn-toggle>
			</v-col>	
			<v-col xs="12" sm="12" md="10" lg="10" xl="10">
				<v-row>
					<v-col sm="12" md=12 lg=12 xl=12>					
						<v-row v-if="ChooseFunction==0">
							<v-col sm="12" md=12 lg=12 xl=12>
								<Axis-Gloable-Variable-Panel></Axis-Gloable-Variable-Panel>
							</v-col>
						</v-row>
						<!-- <v-row v-else-if="ChooseFunction==1">
							<v-col sm="12" md=12 lg=12 xl=12>
								<CS-Thread-Milling-Panel></CS-Thread-Milling-Panel>
							</v-col>
						</v-row>
						<v-row v-else-if="ChooseFunction==2">
							<v-col sm="12" md=12 lg=12 xl=12>
								<CS-Rigid-Tapping-Panel></CS-Rigid-Tapping-Panel>
							</v-col>
						</v-row>
						<v-row v-else-if="ChooseFunction==3">
							<v-col sm="12" md=12 lg=12 xl=12>
								<CS-Drilling-Cycle-Panel></CS-Drilling-Cycle-Panel>
							</v-col>
						</v-row>
						<v-row v-else-if="ChooseFunction==4">
							<v-col sm="12" md=12 lg=12 xl=12>
								<CS-Lathe-Threading-Cycle-Panel></CS-Lathe-Threading-Cycle-Panel>
							</v-col>
						</v-row>
						<v-row v-else-if="ChooseFunction==5">
							<v-col sm="12" md=12 lg=12 xl=12>
								<CS-Gear-Hobbing-Panel></CS-Gear-Hobbing-Panel>
							</v-col>
						</v-row>
						<v-row v-else-if="ChooseFunction==6">
							<v-col sm="12" md=12 lg=12 xl=12>
								<CS-Broaching-Panel></CS-Broaching-Panel>
							</v-col>
						</v-row>
						<v-row v-else-if="ChooseFunction==7">
							<v-col sm="12" md=12 lg=12 xl=12>
								<CS-Power-Skiving-Panel></CS-Power-Skiving-Panel>
							</v-col>
						</v-row>
						<v-row v-else-if="ChooseFunction==8">
							<v-col sm="12" md=12 lg=12 xl=12>
								<CS-Circle-And-Herical></CS-Circle-And-Herical>
							</v-col>
						</v-row>
						<v-row v-else-if="ChooseFunction==9">
							<v-col sm="12" md=12 lg=12 xl=12>
								<CS-Spiral-Panel></CS-Spiral-Panel>
							</v-col>
						</v-row> -->
					</v-col>
					<!-- <v-col sm="12" md=12 lg=4 xl=4>
						<Codes-Edit-Panel></Codes-Edit-Panel>
					</v-col> -->
				</v-row>
			</v-col>
		</v-row>
	</div>
</template>


<script>
'use strict'
import { mapState,mapGetters,mapActions,mapMutations } from 'vuex'
//let _flag = false;
export default {
	computed: {
        ...mapGetters(['uiFrozen']),
        ...mapState('ToolSettings', {
            ToolsParameter: state => state.Tools_turrent,
            Tools_Path_turrent: state => state.Tools_Path_turrent,
        }),
        ToolsParameterItems() {
			return this.ToolsParameter
				.map(x => ({
					text: x.name,
					value: x.oid
				}), this);
        },
        ToolTurretPathData() {
			return this.Tools_Path_turrent
				.map(function(obj) {
                        //_flag = false;
                        if(obj < 0)return "";
                        else return obj;
                    });
		},
    },    
	methods:{
        ...mapActions('machine', ['sendCode']),
        ...mapMutations('ToolSettings', ['AddTool_turrent','EditTool_turrent']),
        ...mapActions('machine', ['download','upload']),
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
		SwitchFuction(_value){   
            this.ChooseFunction = _value;
        },
        
    },    
	data(){
		return {
            AxisParameterFileName : "ToolsParameters",
			isLoadDatas : false,
            dialog: false,
			dialogDelete: false,
			ChooseFunction : 0,
			ToolArrays:[
				{
					toolname : "Axis",
					toolvalue : 0,
				},
				// {
				// 	toolname : "Thread Milling",
				// 	toolvalue : 1,
				// },
				// {
				// 	toolname : "Rigid Tapping",
				// 	toolvalue : 2,
				// },
				// {
				// 	toolname : "Drilling Cycle",
				// 	toolvalue : 3,
				// },
				// {
				// 	toolname : "Lathe Threading Cycle",
				// 	toolvalue : 4,
				// },
				// {
				// 	toolname : "Gear Hobbing",
				// 	toolvalue : 5,
				// },
				// {
				// 	toolname : "Broaching",
				// 	toolvalue : 6,
				// },
				// {
				// 	toolname : "Power Skiving",
				// 	toolvalue : 7,
				// },
				// {
				// 	toolname : "Circle And Herical",
				// 	toolvalue : 8,
				// },
				// {
				// 	toolname : "Spiral",
				// 	toolvalue : 9,
				// },

			],
		};
		
    },

}
</script>
