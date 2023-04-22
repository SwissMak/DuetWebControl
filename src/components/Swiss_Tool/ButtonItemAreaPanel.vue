<template>
    <div>
        <v-row>
            <v-card width="100%">
                <v-card-text>
                    <div v-show="visibleAxes.length">
                        <template v-if="visibleAxes.length">
                            <v-row no-gutters class="flex-nowrap">
                                <v-col tag="strong" class="category-header">
                                    <a href="javascript:void(0)" @click="displayToolPosition = !displayToolPosition">
                                        {{ $t(displayToolPosition ? 'panel.status.toolPosition' : 'panel.status.machinePosition') }}
                                    </a>
                                </v-col>
                            </v-row>
                            <v-row
                            v-for="(axis, index) in visibleAxes" :key="index" 
                            no-gutters 
                            class="text-no-wrap content">
                                <v-col class="align-center"
                                v-if="displayShowInfo(index)"
                                >
                                    <v-row>
                                        <v-col 
                                        justify="start">
                                            <strong>
                                                <!-- {{ displayAxisLetters(axis.letter) }} -->
                                                {{ displayAxisLetters(index) }}
                                            </strong>
                                        </v-col>
                                        <v-col
                                        justify="end">
                                            <h1>
                                                <!-- {{ displayAxisPosition(axis, index) }}  -->
                                                {{ displayAxisPosition(index) }}
                                            </h1>
                                        </v-col>                                        
                                    </v-row>
                                </v-col>
                            </v-row>
                        </template>
                    </div>
                    <div class="pt-4">
                        <v-btn
                        color="primary"
                        block
                        @click="GetVisible()"
                        >
                        Display Axes
                        </v-btn>
                    </div>
                    <v-row tag="strong"
                    class="pt-5" 
                    justify="start" >
                        Current Tool
                    </v-row>
                    <div class="text-center">
                        <v-btn
                        v-if="state.currentTool>-1"
                        color="primary"
                        block
                        @click="sheet_turret = true"
                        >
                        {{state.currentTool}}
                        </v-btn>
                        <v-btn
                        v-else
                        block
                        color="primary"
                        @click="sheet_turret = true"
                        >
                        {{MessageInfo.NoneSetting}}
                        </v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-row>
        <v-dialog 
        v-model="sheet_turret"
        @click="sheet_turret = false"
        >
            <v-card>
                <v-card-title>
                    <span class="headline">{{formTitle}}</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col>
                                <h1>{{MessageInfo.TurretName}}</h1>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col
                            v-for="(tmp,index) in ToolTurretPathDatas"
                            :key="`ToolTurretPathDatas-${index}`"
                            cols="6"
                            sm="4"
                            md="2"
                            class="pa-5"
                            >
                                <v-card
                                    v-if="tmp.tooltypeID >-1"
                                    class="mx-auto"
                                    max-width="200"
                                    :color="(state.currentTool == index)?'light-blue lighten-5':''"
                                    @click="SetToolNum(index)"
                                >
                                    <v-img
                                    :src="GetTypeIMG(tmp.tooltypeID,0)"
                                    ></v-img>

                                    <v-card-title
                                    class="justify-center">
                                    Tool {{index}} <br/> {{ tmp.toolName }}
                                    </v-card-title>
                                </v-card>

                                <v-card
                                    v-else
                                    class="mx-auto"
                                    max-width="200"
                                >
                                    <v-card-title
                                    class="justify-center">
                                    Tool {{index}} {{MessageInfo.NoneSetting}}
                                    </v-card-title>
                                </v-card>
                            </v-col>
                        </v-row>
                        <v-divider></v-divider>
                        <v-row>
                            <v-col>
                                <h1>{{MessageInfo.MillingName}}</h1>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col
                            v-for="(tmp,index) in ToolMillingPathDatas"
                            :key="`Milling-${index}`"
                            cols="6"
                            sm="4"
                            md="2"
                            class="pa-5"
                            >
                                <v-card
                                    v-if="tmp.tooltypeID >-1"
                                    class="mx-auto"
                                    max-width="200"
                                    :color="(state.currentTool == index+TurretMax)?'light-blue lighten-5':''"
                                    @click="SetToolNum(index+ TurretMax)"
                                >
                                    <v-img
                                    :src="GetTypeIMG(tmp.tooltypeID,1)"
                                    ></v-img>

                                    <v-card-title
                                    class="justify-center">
                                        Tool {{index + TurretMax}} <br/> {{ tmp.toolName }}
                                    </v-card-title>
                                </v-card>

                                <v-card
                                    v-else
                                    class="mx-auto"
                                    max-width="200"
                                >
                                    <v-card-title
                                    class="justify-center">
                                    Tool {{index+TurretMax}} {{MessageInfo.NoneSetting}}
                                    </v-card-title>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                    color="blue darken-1"
                    text
                    @click="CancelToolPanel"
                    >
                        Cancel
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog 
        v-model="sheet_AxisSetting"
        @click="sheet_AxisSetting = false"
        >
            <v-card>
                <v-card-title>
                    <span class="headline">{{formTitle}}</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col
                            v-for="(axis, i) in AxisData"
                            :key="`AxisData-${i}`"
                            align="center"
                            sm="4"
                            md="4">
                                <div>
                                    <strong>{{axis.NameMode}}</strong>
                                </div>
                                <div>
                                    <v-list shaped>
                                        <v-list-item-group
                                            v-model="axis.ModelforItems"
                                            multiple
                                        >
                                            <template v-for="(item, i) in LetterName">
                                                <v-list-item
                                                    :key="`item-${i}`"
                                                    :value="item"
                                                    active-class="deep-purple--text text--accent-4"
                                                >
                                                    <template v-slot:default="{ active }">
                                                        <v-list-item-content>
                                                            <v-list-item-title v-text="item"></v-list-item-title>
                                                        </v-list-item-content>

                                                        <v-list-item-action>
                                                            <v-checkbox
                                                            color="deep-purple accent-4"
                                                            :input-value="active"
                                                            ></v-checkbox>
                                                        </v-list-item-action>
                                                    </template>
                                                </v-list-item>
                                            </template>
                                        </v-list-item-group>
                                    </v-list>
                                </div>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                    color="blue darken-1"
                    text
                    @click="SetVisiable()"
                    >
                        Save and Leave
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- <v-row>
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
        </v-row> -->
        <!-- <template
        v-if="hideSwitchTool == false">
            <v-row
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
            </v-row>
        </template> -->
        
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
		...mapState('machine/model', {
			boards: state => state.boards,
			fans: state => state.fans,
			move: state => state.move,
			machineMode: state => state.state.machineMode,
			sensors: state => state.sensors,
			state: state => state.state,
			tools: state => state.tools,
		}),
        ...mapState('ToolSettings', {
            Tool_All_Group :state => state.Tool_All_Group,
            ToolMillingPathDatas: state => state.ToolMillingPathDatas,
            ToolTurretPathDatas: state => state.ToolTurretPathDatas,
            MessageInfo :state => state.MessageInfo,
            ToolType_Milling :state => state.ToolType_Milling,
            ToolType_Turret :state => state.ToolType_Turret,
            ToolDefault :state => state.ToolDefault,
            TurretMax :state => state.TurretMax,
            MillingMax :state => state.MillingMax,
        }),
        formTitle () {
            return this.selectedIndex === -1 ? 'Select Tool' : 'Select Tool'
        },
        visibleAxes() {
			return this.move.axes.filter(axis => axis.visible);
		},
        HeadStockLock(){
            return (this.fans[8] != undefined) && this.fans[8].actualValue;
        },
        LetterName(){
            return ["X","Y","Z","U","V","W","A","B","C","D"];
        },
        ToolParameterFileName(){
            return "Tools_Path_turrent";
        },

    },
	data() {
		return {
            hideSwitchTool : true,
            isLoadDatas : false,
            displayToolPosition: true,
            selectedIndex: -1,
            sheet_turret: false,
            sheet_AxisSetting: false,
            AxisData:[
                {
                    //DefMode
                    NameMode:"Default Mode",
                    visible:[true,true,true,false,false,false,true,true,false,false],
                    valueIdx:[0,1,2,3,4,5,6,7,8,9],
                    ModelforItems:[],
                },
                {
                    //LatheMode
                    NameMode:"Lathe Mode",
                    visible:[true,false,true,false,false,false,false,false,false,false],
                    valueIdx:[0,1,2,3,4,5,6,7,8,9],
                    ModelforItems:[],
                },
                {
                    //MillingMode
                    NameMode:"Milling Mode",
                    visible:[true,true,true,false,false,false,true,true,false,false],
                    valueIdx:[0,1,2,3,4,5,6,7,8,9],
                    ModelforItems:[],
                },
            ],
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
        // SetBtnControl(_value , _On , _Off){
        //     //console.log(_value);
        //     if(_value){
        //         //console.log(_On);
        //         this.sendCode({ code: _On.toString(), log: false });
        //     }
        //     else {
        //         //console.log(_Off);
        //         this.sendCode({ code: _Off.toString(), log: false });
        //     }
        // },
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
        async initialize() {
            try {
                let getvalue = await this.loadFile(this.ToolParameterFileName);
                if(getvalue == "getvalue")return;
                await this.LoadParameter_Tools(getvalue);
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
        isConnected(to) {
			if (to) {
				// connet is true
				if(this.isLoadDatas == false){
					this.initialize();
					this.isLoadDatas = true;
				}
			}
		},
        HeadStockLock(to) {
            this.updateValueBTN(1 , to);
		},
    },
}
</script>