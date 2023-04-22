<template>
    <div>
        <v-row>
            <h3 class="mx-3 my-3">M-Codes</h3>
			<v-spacer></v-spacer>
			<v-btn
            class="my-2"
            fab
            dark
            small
            color="primary"
            >
                <v-icon dark v-if="hideSwitchTool == false" @click="hideSwitchTool=true">
                    mdi-minus
                </v-icon>
                <v-icon dark v-else  @click="hideSwitchTool=false">
                    mdi-plus
                </v-icon>
            </v-btn>
        </v-row>
        <template
        v-if="hideSwitchTool == false">
            <v-row>
                <v-col 
                cols="2"
                v-for="(bcl, i) in BtnControl"
                :key="`BtnControl-${i}`">
                    <v-sheet
                    @click = "SetBtnControl(bcl._value,bcl.OnCommd,bcl.OffCommd)"
                    class="pl-3">
                        <v-switch
                        inset
                        :label="bcl.LabelName"
                        v-model="bcl._value"                
                        ></v-switch>
                    </v-sheet>
                </v-col>
            </v-row>
        </template>        
    </div>    
</template>

<script>
'use strict'
import { mapState, mapGetters,mapMutations, mapActions } from 'vuex'
export default {
    computed: {
        ...mapState('settings', ['darkTheme']),
        ...mapGetters(['uiFrozen']),
        ...mapGetters(['isConnected']),
		
    },
	data() {
		return {
            hideSwitchTool : true,
            isLoadDatas : false,
            displayToolPosition: true,
            selectedIndex: -1,
            sheet_turret: false,
            sheet_AxisSetting: false,
            BtnControl:[
                {
                    LabelName:"Coolant On",
                    OnCommd : `M98 P"CoolantOn.g"`,
                    OffCommd : `M98 P"CoolantOff.g"`,
                    _value : false,
                },
                {
                    LabelName:"Headstock Indexer",
                    OnCommd : `M98 P"HeadStockIndexerOn.g"`,
                    OffCommd : `M98 P"HeadStockIndexerOff.g"`,
                    _value : false,
                },
                {
                    LabelName:"TailStock Indexer",
                    OnCommd : `M98 P"TailStockIndexerOn.g"`,
                    OffCommd : `M98 P"TailStockIndexerOff.g"`,
                    _value : false,
                },
                {
                    LabelName:"MPG Button",
                    OnCommd : `M98 P"MPGOn.g"`,
                    OffCommd : `M98 P"MPGOff.g"`,
                    _value : false,
                },
                {
                    LabelName:"Milling Air",
                    OnCommd : `M98 P"MillAirOn.g"`,
                    OffCommd : `M98 P"MillAirOff.g"`,
                    _value : false,
                },
                {
                    LabelName:"Headstock Air",
                    OnCommd : `M98 P"HeadAirOn.g"`,
                    OffCommd : `M98 P"HeadAirOff.g"`,
                    _value : false,
                },
                {
                    LabelName:"Tailstock Air",
                    OnCommd : `M98 P"TailstockAirOn.g"`,
                    OffCommd : `M98 P"TailstockAirOff.g"`,
                    _value : false,
                },
                {
                    LabelName:"Chip Removal",
                    OnCommd : `M98 P"ChipRemovalOn.g"`,
                    OffCommd : `M98 P"ChipRemovalOff.g"`,
                    _value : false,
                },
                {
                    LabelName:"Oil Pump",
                    OnCommd : `M98 P"OilPumpOn.g"`,
                    OffCommd : `M98 P"OilPumpOff.g"`,
                    _value : false,
                },
            ],
        }
	},	
	methods: {
        ...mapActions('machine', ['sendCode','download']),
        ...mapMutations('ToolSettings', ['Add_ToolMillingPathDatas','Add_ToolTurretPathDatas','LoadParameter_Tools']),
        GetTypeName(_oid,_type){
            if(_type == 0) return this.ToolType_Turret[_oid].TypeName;
            else return this.ToolType_Milling[_oid].TypeName;
        },
        GetTypeIMG(_oid,_type){
            if(_type == 0) return this.ToolType_Turret[_oid].IMG;
            else return this.ToolType_Milling[_oid].IMG;
        },
        GetVisible(){
            for(let i=0 ; i<this.AxisData.length ; i++){
                this.AxisData[i].ModelforItems.length = 0;
                for(let j=0 ; j<this.AxisData[i].visible.length ; j++){
                    if(this.AxisData[i].visible[j]){
                        if(this.AxisData[i].ModelforItems.indexOf(this.LetterName[j]) == -1)
                            this.AxisData[i].ModelforItems.push(this.LetterName[j]);
                    }
                }
            }
            this.sheet_AxisSetting = true;
        },
        SetVisiable(){
            let _index = -1;
            for(let i=0 ; i<this.AxisData.length ; i++){
                this.AxisData[i].visible.fill(false)
                for(let j=0 ; j<this.AxisData[i].ModelforItems.length ; j++){
                    _index = this.LetterName.indexOf(this.AxisData[i].ModelforItems[j]);
                    if(_index > -1){
                        this.AxisData[i].visible[_index] = true;
                    }
                }                
            }
            //Save and Leave
            this.sheet_AxisSetting = false;
        },
        getConsole(_value){
            console.log("T" + _value.toString() );
        },
        CancelToolPanel(){
            this.sheet_turret = false;
        },
        displayAxisLetters(_index){
			if(this.LetterName.length > _index)
            {
                if(_index ==0 &&this.machineMode == "Lathe Mode - Diameter") return "Diameter";
                return this.LetterName[_index];
            }
            else return "None";
		},
        displayShowInfo(_index){
            if(this.AxisData[0].visible.length <= _index)return false;
            if(this.machineMode == "Lathe Mode - Diameter" || this.machineMode == "Lathe Mode - Radius"){
                return this.AxisData[1].visible[_index]
			}else if(this.machineMode == "Milling Mode"){
				return this.AxisData[2].visible[_index]
			}else{
                return this.AxisData[0].visible[_index]
            }	
        },
        displayAxisPosition(_index) {
            if(isNaN(this.visibleAxes) == false)return 0;
            if(this.AxisData[0].visible.length <= _index)return 0;
            //
            let _temp = 0;
            for(let i=0 ; i<this.visibleAxes.length ; i++){
                if(this.visibleAxes[i].letter == this.LetterName[_index]){
                    _temp = i;
                    break;
                }
            }
            if(_index ==0 &&this.machineMode == "Lathe Mode - Diameter") 
                return this.displayToolPosition ? (this.visibleAxes[_temp].userPosition * 2).toFixed(3) : (this.visibleAxes[_temp].machinePosition*2).toFixed(3);
		
			return this.displayToolPosition ? this.visibleAxes[_temp].userPosition.toFixed(3) : this.visibleAxes[_temp].machinePosition.toFixed(3);
		},
        SetToolNum(_value){
            console.log(_value);
            this.sheet_turret = false;
            this.sendCode({ code: "T" + _value.toString(), log: false });            
        },
        SetBtnControl(_value , _On , _Off){
            //console.log(_value);
            if(_value){
                //console.log(_On);
                this.sendCode({ code: _On.toString(), log: false });
            }
            else {
                //console.log(_Off);
                this.sendCode({ code: _Off.toString(), log: false });
            }
        },
        initialDatas(){
            while(this.ToolMillingPathDatas.length < this.MillingMax){
                this.Add_ToolMillingPathDatas(JSON.stringify(Object.assign({}, this.ToolDefault)));
            }
            while(this.ToolTurretPathDatas.length < this.TurretMax){
                this.Add_ToolTurretPathDatas(JSON.stringify(Object.assign({}, this.ToolDefault)));
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
        
        updateValueBTN(_idx , _value){
            this.BtnControl[_idx]._value = _value;
        },
    },
    mounted() {
        this.initialDatas();
    },
    watch: {
        
        HeadStockLock(to) {
            this.updateValueBTN(1 , to);
		},
    },
}
</script>