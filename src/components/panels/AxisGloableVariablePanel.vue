<style scoped>
.v-btn-toggle {
	display: flex;
}
.v-btn-toggle > button {
	display: flex;
	flex: 1 1 auto;
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

</style>
<template>
	<v-card>
        
		<v-card-title class="pb-0">         
			<v-icon small class="mr-1">mdi-texture</v-icon> Axis Gloable Variable
		</v-card-title>
		<v-img
			src="/axis_3d.png"
		>
			<v-container class="fill-height">
				<div
				style="position:absolute;top:0%;left:90%;width:20%"
				class="ma-2"
				>
					<v-btn
					@click="saveToBoard"
					color="success">
						save
					</v-btn>				
				</div>
				<v-btn
					v-for="(AxisData, i) in AxisDatasStyle"
                    :key="i"
					:max-width="AxisData.maxWidth"
					:style="AxisData.styleObject"
					@click="ShowEditDialog(i)"					
					color="primary"
					>
				{{AxisData.name}}
				</v-btn>
                <v-bottom-sheet v-model="sheet">					
					<v-sheet
						class="text-center"
					>
						<v-btn
						class="mt-3 mr-10"
						text
						color="blue"
						@click="SaveData"
						>
							SAVE
						</v-btn>
						<v-btn
						class="mt-3"
						text
						color="red"
						@click="Cancel"
						>
							Cancel
						</v-btn>
						<!-- endstop -->
						<v-card
						class="ma-3"
						>
							<v-card-title>Endstop</v-card-title>
							<v-card-text  class="d-flex flex-column pb-0">
								<div class="ma-1">
									<v-row>
										<v-col
										cols="12"
										sm="6"
										md="4"
										>
											<v-combobox
											label="Endstop Type" 
											dense 
											hide-selected
											:items="Endstop_Type"
											class="mr-9"
											v-model="EditAxisData.Endstoptype">											
											</v-combobox>
										</v-col>
										<v-col
										cols="12"
										sm="6"
										md="4"
										>
											<v-text-field
												v-model="EditAxisData.Stall_detection_threshold"
												label="Stall detection threshold" 
												type="number"
												class="mr-9"
											></v-text-field>
										</v-col>
									</v-row>
								</div>
							</v-card-text>
						</v-card>
						<!-- calibration -->
						<v-card
						elevation="2"
						class="ma-3"
						>
							<v-card-title>Calibration</v-card-title>
							<v-card-text  class="d-flex flex-column pb-0">
								<div class="ma-1">
									<v-row>
										<v-col
										cols="12"
										sm="6"
										md="4"
										>
											<v-text-field
												v-model="EditAxisData.CalCurrent"
												label="Calibration Current(%)"
												type="number"
												class="mr-9"
											></v-text-field>
										</v-col>
										<v-col
										cols="12"
										sm="6"
										md="4"
										>
											<v-text-field
												v-model="EditAxisData.CalMaxAcceleration"
												label="Calibration Max Acceleration(mm/sec^2)"
												type="number"
												class="mr-9"
											></v-text-field>
										</v-col>
										<v-col
										cols="12"
										sm="6"
										md="4"
										>
											<v-text-field
												v-model="EditAxisData.GoBackDistance"
												label="Go Back Distance(mm)"
												type="number"
												class="mr-9"
											></v-text-field>
										</v-col>
										<v-col
										cols="12"
										sm="6"
										md="4"
										>
											<v-text-field
												v-model="EditAxisData.GoBackFeedrate"
												label="Go Back Feedrate(mm/sec^2)"
												type="number"
												class="mr-9"
											></v-text-field>
										</v-col>
										<v-col
										cols="12"
										sm="6"
										md="4"
										>
											<v-text-field
												v-model="EditAxisData.GoEndstopDistance"
												label="Go Endstop Distance(mm)"
												type="number"
												class="mr-9"
											></v-text-field>
										</v-col>
										<v-col
										cols="12"
										sm="6"
										md="4"
										>
											<v-text-field
												v-model="EditAxisData.GoEndstopFeedrate"
												label="Go Endstop Feedrate(mm/sec^2)"
												type="number"
												class="mr-9"
											></v-text-field>
										</v-col>
										<v-col
										cols="12"
										sm="6"
										md="4"
										>
											<v-text-field
												v-model="EditAxisData.AbsPos"
												label="Absolute Position(mm)"
												type="number"
												class="mr-9"
											></v-text-field>
										</v-col>
										<v-col
										cols="12"
										sm="6"
										md="4"
										>
											<v-text-field
												v-model="EditAxisData.Current"
												label="Current(%)"
												type="number"
												class="mr-9"
											></v-text-field>
										</v-col>
										<v-col
										cols="12"
										sm="6"
										md="4"
										>
											<v-text-field
												v-model="EditAxisData.MaxAcceleration"
												label="Max Acceleration(mm/sec^2)"
												type="number"
												class="mr-9"
											></v-text-field>
										</v-col>
									</v-row>
								</div>
							</v-card-text>							
						</v-card>
						
					</v-sheet>
				</v-bottom-sheet>
				
			</v-container>
		</v-img>
	</v-card>
</template>

<script>
'use strict'
import { mapState,mapGetters,mapMutations,mapActions } from 'vuex'
export default {	
	computed: {
		...mapGetters(['isConnected']),
		...mapState('AxisSettings', {
			AxisDatas: state => state.AxisDatas,
		}),
	},
	data() {
		return {
			AxisParameterFileName : "AxisParameters",
			isLoadDatas : false,
			sendingCode: false,
			selectedIndex : -1,
			sheet:false,
			EditAxisData:{
				CalCurrent:60,
				CalMaxAcceleration:30,
				GoBackDistance:-5,
				GoBackFeedrate:1000,
				GoEndstopDistance:320,
				GoEndstopFeedrate:1000,
				AbsPos:100,
				Current:100,
				MaxAcceleration:200,
				//Endstop
				Endstoptype : "single motor load detection",
				Stall_detection_threshold : 3,
			},
			DefaultMode:["Y","X","W","Z","U"],
			LatheMode : ["Y","U","W","Z","X"],
			MillingMode  : ["Z","Y","W","X","U"],
			Endstop_Type:["microswitch","Z probe","single motor load detection","multiple motor load detection"],
			AxisDatasStyle:[
                {
                    name: "Milling Vertical Home Setting",
					styleObject: {
						position: "absolute",
						top:"0%",
						left:"35%",
					},
				},
				{
					name: "Milling Travel Home Setting",
					styleObject: {
						position: "absolute",
						top:"50%",
						left:"25%",
					},
                },
				{
					name: "Tailstock Travel Home Setting",
					styleObject: {
						position: "absolute",
						top:"30%",
						left:"70%",
					},
				},
				{
					name: "Headstock Travel Home Setting",
					styleObject: {
						position: "absolute",
						top:"72%",
						left:"8%",
					},
				},
				{
					name: "Turret Travel Home Setting",
					styleObject: {
						position: "absolute",
						top:"90%",
						left:"65%",
					},
				},				
			],			
		}
	},	
	methods: {
		...mapMutations('AxisSettings', ['AddAxisDatas','SaveDataJS','LoadAllParameter']),
		...mapActions('machine', ['download','upload']),
		ShowEditDialog(_index){
			this.sheet = true;
			while(this.AxisDatas.length<5){
				this.EditAxisData = Object.assign({}, this.EditAxisData);
				this.AddAxisDatas(this.EditAxisData);
            }
			this.EditAxisData = Object.assign({}, this.AxisDatas[_index]);
			this.selectedIndex = _index;
		},
		SaveData(){
			let getdatas = JSON.stringify(Object.assign({}, this.EditAxisData));
            this.SaveDataJS(JSON.stringify({ index: this.selectedIndex, datas: getdatas}));
			this.selectedIndex = -1;
			this.sheet = false;			
		},
		Cancel(){
			this.selectedIndex = -1;
			this.sheet = false;	
		},
		async saveToBoard(){
			//M321 Default mode
			let _totalContext = "";
			_totalContext += "M453\n";
			_totalContext += this.EditGFile_Init(this.DefaultMode);
			let i;
			for(i=0 ; i < this.DefaultMode.length ; i++){
				_totalContext = _totalContext + this.EditGFile(i,this.DefaultMode[i]);
			}
			//console.log(_totalContext);
			await this.saveFile("M321",_totalContext);
			//322 Lathe mode
			_totalContext = "";
			_totalContext += "M454\n";
			_totalContext += this.EditGFile_Init(this.LatheMode);
			for(i=0 ; i < this.LatheMode.length ; i++){
				_totalContext = _totalContext + this.EditGFile(i,this.LatheMode[i]);
			}
			await this.saveFile("M322",_totalContext);
			//console.log(_totalContext);
			//323 Milling mode
			_totalContext = "";
			_totalContext += "M455\n";
			_totalContext += this.EditGFile_Init(this.MillingMode);
			for(i=0 ; i < this.MillingMode.length ; i++){
				_totalContext = _totalContext + this.EditGFile(i,this.MillingMode[i]);
			}
			await this.saveFile("M323",_totalContext);
			//			
			await this.saveFile(this.AxisParameterFileName,JSON.stringify(this.AxisDatas));
		},
		EditGFile_Init(_modeDatas){
			if(this.AxisDatas.length<=0)return "";
			let i=0;
			let gcode = ";Init" + "\n";
			//home other axises
			gcode += "G28 V A B C D" + "\n";
			//set driver
			gcode = gcode + "M584";
			for(i=0 ; i < this.AxisDatas.length ; i++){
				gcode = gcode + " "+ _modeDatas[i] + this.MapAxisDriver(i);
			}
			gcode = gcode + "\n";
			//configure microstepping with interpolation
			gcode = gcode + "M350";
			for(i=0 ; i < this.AxisDatas.length ; i++){
				gcode = gcode + " "+ _modeDatas[i] + "16";
			}
			gcode = gcode + " I1 ";
			gcode = gcode + "\n";
			//set steps per mm
			gcode = gcode + "M92";
			for(i=0 ; i < this.AxisDatas.length ; i++){
				gcode = gcode + " "+ _modeDatas[i] + "640";
			}
			gcode = gcode + "\n";
			//set maximum instantaneous speed changes (mm/min)
			gcode = gcode + "M566";
			for(i=0 ; i < this.AxisDatas.length ; i++){
				gcode = gcode + " "+ _modeDatas[i] + "800";
			}
			gcode = gcode + "\n";
			//set maximum speeds (mm/min)
			gcode = gcode + "M203";
			for(i=0 ; i < this.AxisDatas.length ; i++){
				gcode = gcode + " "+ _modeDatas[i] + "1000";
			}
			gcode = gcode + "\n";
			//set accelerations (mm/s^2)
			gcode = gcode + "M201";
			for(i=0 ; i < this.AxisDatas.length ; i++){
				gcode = gcode + " "+ _modeDatas[i] + "200";
			}
			gcode = gcode + "\n";
			//set motor currents (mA) and motor idle factor in per cent
			gcode = gcode + "M906";
			for(i=0 ; i < this.AxisDatas.length ; i++){
				gcode = gcode + " "+ _modeDatas[i] + "4000";
			}
			gcode = gcode + " I30 ";
			gcode = gcode + "\n";
			//idle timeout
			gcode = gcode + "M84 S2 \n";
			//axis limits min
			gcode = gcode + "M208";
			for(i=0 ; i < this.AxisDatas.length ; i++){
				gcode = gcode + " "+ _modeDatas[i] + "-1000";
			}
			gcode = gcode + " S1 ";
			gcode = gcode + "\n";
			//axis limits max
			gcode = gcode + "M208";
			for(i=0 ; i < this.AxisDatas.length ; i++){
				gcode = gcode + " "+ _modeDatas[i] + "1000";
			}
			gcode = gcode + " S0 ";
			gcode = gcode + "\n";			
			//final
			gcode = gcode + "\n";
			return gcode;
		},
		EditGFile(_index,_axisLetter){
			if(this.AxisDatas.length<=_index)return "";
			let gcode = ";Axis:"+_axisLetter + "\n";	
			//set endstop
			let _temp = this.Endstop_Type.findIndex(x => x === this.AxisDatas[_index].Endstoptype) + 1;
			//
			gcode = gcode + "M574 " + _axisLetter + "1 S" + _temp;
			if(_index==0)gcode = gcode + ' P"io4.in" ';
			gcode = gcode + "\n";
			//
			gcode = gcode + "M915 " + _axisLetter + " S" + this.AxisDatas[_index].Stall_detection_threshold + " R0 F0 H200" + "\n";
			//calibration
			gcode = gcode + "M913 " + this.AxisDatas[_index].CalCurrent + "\n";
			gcode = gcode + "M201 " + this.AxisDatas[_index].CalMaxAcceleration + "\n";
			gcode = gcode + "G91 " + "\n";
			gcode = gcode + "G1 H2 "+ _axisLetter + this.AxisDatas[_index].GoBackDistance + " F"+ this.AxisDatas[_index].GoBackFeedrate + "\n";
			gcode = gcode + "G1 H1 "+ _axisLetter + this.AxisDatas[_index].GoEndstopDistance + " F"+ this.AxisDatas[_index].GoEndstopFeedrate + "\n";
			gcode = gcode + "G92 " + _axisLetter + this.AxisDatas[_index].AbsPos + "\n";
			gcode = gcode + "G90 " + "\n";
			gcode = gcode + "M913 " + this.AxisDatas[_index].Current + "\n";
			gcode = gcode + "M201 " + this.AxisDatas[_index].MaxAcceleration + "\n";
			gcode = gcode + "M400 " + "\n";
			gcode = gcode + "\n";
			//console.log(gcode);
			return gcode;
		},
		MapAxisDriver(_path){
			switch(_path){
				case 0:
					return "0.1";
				case 1:
					return "0.0";
				case 2:
					return "0.5";
				case 3:
					return "0.2";
				case 4:
					return "0.3";
			}
			return "";
		},
		async saveFile(filename,_context) {			
			const content = new Blob([_context]);
			try {
                await this.upload({ filename: "0:/sys/"+ filename +".g", content, showSuccess: false });
			} catch (e) {
				alert(e);
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
				let getvalue = await this.loadFile(this.AxisParameterFileName);
				this.LoadAllParameter(getvalue);
			} catch (e) {
				alert(e);
			}
		},
		getconsole(_value=999){
			console.log(_value);
			console.log(this.Endstop_Type.findIndex(findth => findth === this.EditAxisData.Endstoptype) );
		}
	},
	// mounted() {
    //     this.initialize();
    // },
	watch: {
		isConnected(to) {
			if (to) {
				// connet is true
				if(this.isLoadDatas == false){
					this.initialize();
					this.isLoadDatas = true;
				}
			}
		}
	}

}
</script>