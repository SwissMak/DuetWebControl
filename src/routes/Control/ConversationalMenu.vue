
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
				<v-expansion-panels>
					<v-expansion-panel
					v-for="(item,i) in CannedClassArrays"
					:key="i"
					>
					<v-expansion-panel-header>{{item.CannedClassName}}</v-expansion-panel-header>
					<v-expansion-panel-content>
						<v-btn 
							v-for="(_tool, i) in item.CannedArray"
							:key="i"
							text
							:color="_tool.toolvalue==ChooseFunction?'primary':''"
							@click="SwitchFuction(_tool.toolvalue)">
							{{_tool.toolname}}
						</v-btn>
					</v-expansion-panel-content>
					</v-expansion-panel>
				</v-expansion-panels>
			</v-col>	
			<v-col xs="12" sm="12" md="10" lg="10" xl="10">
				<v-row>
					<v-col sm="12" md=12 lg=8 xl=8>					
						<v-row v-if="ChooseFunction==0">
							<v-col sm="12" md=12 lg=12 xl=12>
								<CS-Helical-Pocket-Panel></CS-Helical-Pocket-Panel>
							</v-col>
						</v-row>
						<v-row v-else-if="ChooseFunction==1">
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
						</v-row>
						<v-row v-else-if="ChooseFunction==10">
							<v-col sm="12" md=12 lg=12 xl=12>
								<CS-Turning-Cycle-Panel></CS-Turning-Cycle-Panel>
							</v-col>
						</v-row>
						<v-row v-else-if="ChooseFunction==11">
							<v-col sm="12" md=12 lg=12 xl=12>
								<CS-MBasic-Code-Panel></CS-MBasic-Code-Panel>
							</v-col>
						</v-row>
						<v-row v-else-if="ChooseFunction==12">
							<v-col sm="12" md=12 lg=12 xl=12>
								<CS-Milling-Polygon-Panel></CS-Milling-Polygon-Panel>
							</v-col>
						</v-row>
						<v-row v-else-if="ChooseFunction==13">
							<v-col sm="12" md=12 lg=12 xl=12>
								<CS-Facing-Cycle-Panel></CS-Facing-Cycle-Panel>
							</v-col>
						</v-row>
						<v-row v-else-if="ChooseFunction==14">
							<v-col sm="12" md=12 lg=12 xl=12>
								<CS-Milling-Polygon-Facing-Panel></CS-Milling-Polygon-Facing-Panel>
							</v-col>
						</v-row>
						<v-row v-else-if="ChooseFunction==15">
							<v-col sm="12" md=12 lg=12 xl=12>
								<CS-Milling-Polygon-Repeat-Panel></CS-Milling-Polygon-Repeat-Panel>
							</v-col>
						</v-row>
						<v-row v-else-if="ChooseFunction==16">
							<v-col sm="12" md=12 lg=12 xl=12>
								<CS-Boring-Panel></CS-Boring-Panel>
							</v-col>
						</v-row>
						<v-row v-else-if="ChooseFunction==17">
							<v-col sm="12" md=12 lg=12 xl=12>
								<CS-Grooving-Lathe-Panel></CS-Grooving-Lathe-Panel>
							</v-col>
						</v-row>
						<v-row v-else-if="ChooseFunction==18">
							<v-col sm="12" md=12 lg=12 xl=12>
								<CS-Drilling-Cycle-Lathe-Panel></CS-Drilling-Cycle-Lathe-Panel>
							</v-col>
						</v-row>
					</v-col>
					<v-col sm="12" md=12 lg=4 xl=4>
						<Codes-Edit-Panel></Codes-Edit-Panel>
					</v-col>
					
				</v-row>
			</v-col>
		</v-row>
	</div>
</template>


<script>
'use strict'
export default {
	computed: {
		CannedClassArrays(){
			return [
				{
					CannedClassName : "Normal",
					CannedArray : [
						{
							toolname : "G/M basic code",
							toolvalue : 11,
						},
					],
				},
				{
					CannedClassName : "Milling Mode",
					CannedArray : [
						{
							toolname : "Helical Pocket",
							toolvalue : 0,
						},
						{
							toolname : "Thread Milling",
							toolvalue : 1,
						},
						{
							toolname : "Rigid Tapping",
							toolvalue : 2,
						},
						{
							toolname : "Drilling Cycle",
							toolvalue : 3,
						},
						{
							toolname : "Circle And Herical",
							toolvalue : 8,
						},
						{
							toolname : "Spiral",
							toolvalue : 9,
						},
						{
							toolname : "Polygon(Side)",
							toolvalue : 12,
						},
						{
							toolname : "Polygon(Facing)",
							toolvalue : 14,
						},
						{
							toolname : "Polygon Repeat",
							toolvalue : 15,
						},
					],
				},
				{
					CannedClassName : "Lathe Mode",
					CannedArray : [
						{
							toolname : "Threading Cycle",
							toolvalue : 4,
						},
						{
							toolname : "Turning Cycle",
							toolvalue : 10,
						},
						{
							toolname : "Facing Cycle",
							toolvalue : 13,
						},
						{
							toolname : "Boring",
							toolvalue : 16,
						},
						{
							toolname : "Grooving",
							toolvalue : 17,
						},
						{
							toolname : "Drilling",
							toolvalue : 18,
						},
					],
				},
			];
		},
    },    
	methods:{
		SwitchFuction(_value){   
            this.ChooseFunction = _value;
        },        
    },    
	data(){
		return {
			ChooseFunction : 0,
		};
		
    },

}
</script>
