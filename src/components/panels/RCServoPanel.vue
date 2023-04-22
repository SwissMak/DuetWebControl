<style scoped>
.v-btn-toggle {
	display: flex;
}
.v-btn-toggle > button {
	display: flex;
	flex: 1 1 auto;
}

</style>
<template>
	<v-card>
        
		<v-card-title class="pb-0">         
			<v-icon small class="mr-1">mdi-texture</v-icon> RC Servo Switch			
		</v-card-title>
		<v-img
			src="/front view png.png"			
			@click="ShowMouse($event)"
		>
			<v-container class="fill-height">	
				<!-- <div 
				v-for="(ImgData, i) in ImgDatas"
                :key="i">			
					<v-img					
						:src="ImgData.src"
						:max-width="ImgData.maxWidth"
						:style="ImgData.styleObject"
						@click="rotateRight(i)"
						@mousedown="startDrag" 
						@mousemove="doDrag"
						@mouseup="stopDrag"
						@mouseover="stopDrag"
					/>
				</div> -->
				<v-img
					:src="ImgDatas[0].src"
					:max-width="ImgDatas[0].maxWidth"
					:style="ImgDatas[0].styleObject"
					@click="rotateRight(0)"
				/>
				<v-img
					:src="ImgDatas[1].src"
					:max-width="ImgDatas[1].maxWidth"
					:style="MillingstockPos()"
				/>
				<v-img
					:src="ImgDatas[2].src"
					:max-width="ImgDatas[2].maxWidth"
					:style="ImgDatas[2].styleObject"
				/>
				<v-img
					:src="ImgDatas[3].src"
					:max-width="ImgDatas[3].maxWidth"
					:style="TailstockPos()"
				/>
				<v-img
					:src="ImgDatas[4].src"
					:max-width="ImgDatas[4].maxWidth"
					:style="HeadstockPos()"
				/>
				<div style="position:absolute;top:80%;left:10%;width:40%;">
					<slider :value=170 						
						max="170"
						min="0"
					/>
					<v-subheader>Headstock Position</v-subheader>
				</div>
				<div style="position:absolute;top:80%;left:50%;width:40%;">
					<slider :value=0 
						:max="BLDC_Tail_Max"
						inverse-label
						label="Inverse label"
						/>
				</div>
				
			</v-container>
		</v-img>
	</v-card>
</template>

<script>
'use strict'
import { mapState,mapGetters, mapActions } from 'vuex'
export default {	
	computed: {
		...mapGetters(['uiFrozen']),
		...mapState('machine/model', {
			move: state => state.move
		})
	},
	data() {
		return {
			sendingCode: false,
			notes:[],
			rotation: 0,
			mouseEventX:0,
			mouseEventy:0,
			mouseMoveUnit:0,
			ImgDatas:[
                {
                    src: "/chuckfront1test.png",
					maxWidth: 200,
					TopLimit:{min:0,max:0},
					Leftimit:{min:10,max:10},
					styleObject: {
						position: "absolute",
						top:"0%",
						left:"10%",
						transform: "rotate(0deg)"
					},
					dragging: false
				},
				{
					//milling
                    src: "/milling head yb.png",
					maxWidth: 300,
					TopLimit:{min:10,max:37},
					Leftimit:{min:37,max:37},
					styleObject: {
						position: "absolute",
						top:"37%",
						left:"37%",
						transform: ""
					},
					dragging: false
                },
				{
                    src: "/chuckfront1test.png",
					maxWidth: 200,
					TopLimit:{min:0,max:0},
					Leftimit:{min:70,max:70},
					styleObject: {
						position: "absolute",
						top:"0%",
						left:"70%",
						transform: "rotate(0deg)"
					},
					dragging: false
				},
				{
					//tail
                    src: "/headstock image2.png",
					maxWidth: 350,
					TopLimit:{min:52,max:52},
					Leftimit:{min:50,max:65},
					styleObject: {
						position: "absolute",
						top:"52%",
						left:"65%",
						transform: ""
					},
					dragging: false
				},
				{
					//head
                    src: "/headstock image1.png",
					maxWidth: 350,
					TopLimit:{min:52,max:52},
					Leftimit:{min:6,max:21},
					styleObject: {
						position: "absolute",
						top:"52%",
						left:"6%",
						transform: ""
					},					
					dragging: false
                }
            ]
		}
	},	
	methods: {
		HeadstockPos() {
			//170 - 0
			if(this.move == null)return;
			let gap = (170 - this.move.axes[2].machinePosition)/10;
			return "position:absolute;top:52%;left:"+(6+gap).toString()+"%";
		},
		TailstockPos() {
			//-200 - 0
			if(this.move == null)return;
			let gap = (this.move.axes.length >5 )? (200 + this.move.axes[5].machinePosition)/10 : 0;
			return "position:absolute;top:52%;left:"+(65-gap).toString()+"%";
		},
		MillingstockPos() {
			//225.5 - 0
			if(this.move == null)return;
			let gap = (225.5 - this.move.axes[1].machinePosition)/8.35;
			return "position:absolute;top:"+(10+gap).toString()+"%;left:37%";
		},
		ShowMouse(){
			//console.log(event);
			//alert(event.offsetX + "," + event.offsetY);
		},		
		...mapActions('machine', ['sendCode']),
		setSpindleSpeed(spindle_num, value) {
			value = Math.round(value * 0.01745329);
			this.sendCode(`M118 S"M84${spindle_num} S${value}"`);
		},
		togglePower(rcServo,state){
			if(state){
				rcServo=1;
			}
		},
		rotateRight(_index) {
			//console.log(this.ImgDatas[0].styleObject.transform);
			console.log(this.move.axes[0].machinePosition);
			if(_index==0)
			{
				this.rotation += 10;
				this.ImgDatas[0].styleObject.transform="rotate("+this.rotation+"deg)";
				this.ImgDatas[2].styleObject.transform="rotate("+this.rotation+"deg)";
			}
		},
		startDrag() {
			console.log("startDrag");
			this.ImgDatas[0].dragging = true;
			// this.mouseEventX = event.clientX;
			// this.mouseEvennY = event.clientY;
		},
		stopDrag() {
			console.log("stopDrag");
			this.ImgDatas[0].dragging = false;
		},
		doDrag(event) {
			
			if (this.ImgDatas[0].dragging) {
				console.log(event.offsetX);
				console.log(event.layerX/2);
				if(event.offsetX <= 0)
					this.ImgDatas[0].styleObject.left = event.offsetX;
				else if(event.offsetX > (event.layerX/2)){
					this.ImgDatas[0].styleObject.left = event.layerX/2;
				}else{
					this.ImgDatas[0].styleObject.left = event.offsetX;
				}
				//this.mouseMoveUnit = (100*(event.clientX-this.mouseEventX))
				//this.ImgDatas[0].styleObject.left = parseInt(this.ImgDatas[0].styleObject.left) + ((event.clientX-this.mouseEventX)%2)+ "%";
				// this.x = event.clientX;
				// this.y = event.clientY;
			}
		}
	},
	mounted() {		
		
		//window.addEventListener("mouseup", this.stopDrag);
		//setTimeout(this.UpdateErrorCode_BLDC, 5000);
	}
}
</script>