<style scoped>

</style>
<template>
    <v-container fluid>
        <v-row>
            <v-col
            align="start">
                {{MessageInfo.MillingName}}
            </v-col>
        </v-row>
        <v-row>
            <v-col
            v-for="(tmp,index) in ToolMillingPathDatas"
            :key="`Axial-${index}`"
            cols="6"
            sm="4"
            md="2"
            class="pa-5"
            @click="EditMillingTool(index)"
            >
                <v-card
                    v-if="tmp.tooltypeID >-1"
                    class="mx-auto"
                    max-width="200"
                >
                    <v-img
                    :src="GetTypeIMG(tmp.tooltypeID)"
                    ></v-img>

                    <v-card-title
                    class="justify-center">
                        Tool {{index+TurretMax}} <br/>{{ tmp.toolName }}
                        <!-- {{ GetTypeName(tmp.tooltypeID) }} -->
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
        <v-dialog
        v-model="sheet_MillingToolEdit"
        @click="UnsaveAndLeave"
        @close="UnsaveAndLeave"
        >
            <v-card>
                <v-card-title>
                    <span class="headline">Edit Tool</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col
                            v-for="(ttm, i) in ToolType_Milling"
                            :key="`ttm-${i}`"
                            align="center"
                            sm="4"
                            md="4">
                                <v-card
                                    class="mx-auto"
                                    max-width="200"
                                    :color="(toolTypeIndex == i)?'light-blue lighten-5':''"
                                    @click="DlgSelectTool(i)"
                                >
                                    <v-img
                                    :src="ttm.IMG"
                                    ></v-img>
                                    <v-card-title
                                    class="justify-center">
                                    {{ttm.TypeName}}
                                    </v-card-title>
                                </v-card>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col
                            v-for="(edg, i) in Editdata_dialog"
                            :key="`edg-${i}`"
                            sm="6"
                            md="3"
                            class="ma-6"
                            >
                                <v-text-field
                                    :label="edg.label"
                                    :type="edg.type"
                                    v-model="edg.value"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                    color="blue darken-1"
                    text
                    @click="SaveAndLeave()"
                    >
                        Save and Leave
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>   
</template>

<script>
'use strict'
import { mapState,mapGetters,mapActions,mapMutations } from 'vuex'
export default {
	computed: {
        ...mapGetters(['isConnected']),
        ...mapGetters(['uiFrozen']),
        ...mapState('ToolSettings', {
            Tool_All_Group :state => state.Tool_All_Group,
            ToolMillingPathDatas: state => state.ToolMillingPathDatas,
            MessageInfo :state => state.MessageInfo,
            ToolType_Milling :state => state.ToolType_Milling,
            TurretMax :state => state.TurretMax,
            MillingMax :state => state.MillingMax,
            
        }),
        ToolParameterFileName() {
			return "Tools_Path_turrent";
        },
        ToolSettingFileName() {
			return "M1005";
        },
    },    
	methods:{
        ...mapMutations('ToolSettings', ['Add_ToolMillingPathDatas','Edit_ToolMillingPathDatas','SaveParameter_Tools']),
       ...mapActions('machine', ['sendCode','download','upload']),
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
        GetConsole () {
            console.log("");
        },
        GetG10Command(_index,_datas){
            let _totalContext = "";
            _totalContext += "M563";
            _totalContext += " P" + String(_index);
            _totalContext += " Z" + String(-_datas.ToolLength);
            _totalContext += ' S"Tool ' + String(_index) + '"\n';
            _totalContext += "G10";
            _totalContext += " P" + String(_index);
            _totalContext += " Z" + String(-_datas.ToolLength);
            _totalContext += "\n";
            //console.log(_totalContext);
            return _totalContext;
        },
        GetAllG10Command(){
            let _totalContext = "";
            this.SaveParameter_Tools();
            if(this.Tool_All_Group.length <= 0)return;
            let getArr;
            // getArr = this.Tool_All_Group[0];            
            // for(let i=0 ; i< getArr.length ; i++){
            //    _totalContext += this.GetG10Command(i,getArr[i]);
            // }
            getArr = this.Tool_All_Group[1];     
            for(let i=0 ; i< getArr.length ; i++){
               _totalContext += this.GetG10Command(i + this.TurretMax,getArr[i]);
            }
            //console.log(_totalContext);
            return _totalContext;
        },
        initialDatas(){
            while(this.ToolMillingPathDatas.length < this.MillingMax){
                this.Add_ToolMillingPathDatas(JSON.stringify(Object.assign({}, this.ToolMillingDefault)));
            }
        },
        EditMillingTool(index){
            if(this.ToolMillingPathDatas[index].tooltypeID > -1){
                this.toolTypeIndex = this.ToolMillingPathDatas[index].tooltypeID;
                this.Editdata_dialog[0].value = this.ValueCheck(this.ToolMillingPathDatas[index].ToolLength , 0);
                this.Editdata_dialog[1].value = this.ValueCheck(this.ToolMillingPathDatas[index].toolName , "");
                this.Editdata_dialog[2].value = this.ValueCheck(this.ToolMillingPathDatas[index].Diameter , 0);
                this.Editdata_dialog[3].value = this.ValueCheck(this.ToolMillingPathDatas[index].WidthOfCut , 0);
                this.Editdata_dialog[4].value = this.ValueCheck(this.ToolMillingPathDatas[index].flutes , 0);

                // this.Editdata_dialog[2].value = this.ToolMillingPathDatas[index].TipRadius;
                // this.Editdata_dialog[3].value = this.ToolMillingPathDatas[index].XOffset;
                // this.Editdata_dialog[4].value = this.ToolMillingPathDatas[index].ZOffset;
                
            }else{
                for(let i=0 ; i< this.Editdata_dialog.length ; i++){
                    if( i == 6) this.Editdata_dialog[i].value = "";
                    else this.Editdata_dialog[i].value = 0;
                }
            }
            this.selectIndex = index;
            this.sheet_MillingToolEdit = true;
        },
        ValueCheck(_inputvalue , _replace){
            if(_inputvalue== "" || _inputvalue === undefined)return _replace;
            return _inputvalue;
        },
        async SaveAndLeave(){
            if(this.toolTypeIndex == -1 ){
                alert("ToolType is required!");
                return ;
            }
            this.ToolMillingDefault.tooltypeID = this.ValueCheck(this.toolTypeIndex , 0);
            this.ToolMillingDefault.ToolLength = this.ValueCheck(this.Editdata_dialog[0].value , 0);
            this.ToolMillingDefault.toolName = this.ValueCheck(this.Editdata_dialog[1].value , "");
            this.ToolMillingDefault.Diameter = this.ValueCheck(this.Editdata_dialog[2].value , 0);
            this.ToolMillingDefault.WidthOfCut = this.ValueCheck(this.Editdata_dialog[3].value , 0);
            this.ToolMillingDefault.flutes = this.ValueCheck(this.Editdata_dialog[4].value , 0);
            // this.ToolMillingDefault.TipRadius = this.Editdata_dialog[2].value;
            // this.ToolMillingDefault.XOffset = this.Editdata_dialog[3].value;
            // this.ToolMillingDefault.ZOffset = this.Editdata_dialog[4].value;
            let getdatas = JSON.stringify(Object.assign({}, this.ToolMillingDefault));
            this.Edit_ToolMillingPathDatas(JSON.stringify({ index: this.selectIndex, datas: getdatas}));   
            //
            await this.saveToFile();             
            //
            this.sheet_MillingToolEdit = false;
            this.selectIndex = -1;
            this.toolTypeIndex = -1;
                    
        },
        UnsaveAndLeave(){
            this.selectIndex = -1;
            this.toolTypeIndex = -1;
            this.sheet_MillingToolEdit = false;
        },
        GetTypeName(_oid){
            return this.ToolType_Milling[_oid].TypeName;
        },
        GetTypeIMG(_oid){
            return this.ToolType_Milling[_oid].IMG;
        },
        DlgSelectTool(_index){
            this.toolTypeIndex = _index;
        },
        async saveToFile() {
            if(this.isConnected == false)return;
            await this.saveToFile_parameter();
            await this.saveToFile_G10();
            //await this._SendCode("M41");
            await this._SendCode(this.GetG10Command(this.selectIndex + this.TurretMax,this.ToolMillingDefault));
        },
        async saveToFile_parameter() {
            if(this.isConnected == false)return;
            await this.saveFile(this.ToolParameterFileName,JSON.stringify(this.Tool_All_Group));			
        },
        async saveToFile_G10() {
            if(this.isConnected == false)return;
            await this.saveFile(this.ToolSettingFileName,this.GetAllG10Command());			
        },
        async saveFile(filename,_context) {			
			const content = new Blob([_context]);
			try {
                await this.upload({ filename: "0:/sys/"+ filename +".g", content, showSuccess: false });
			} catch (e) {
				alert(e);
			}
        },
    },
	data(){
		return {
			isLoadDatas : false,
            ToolMillingDefault :{
                ToolLength: 0,
                Diameter: 0,
                TipRadius: 0,
                XOffset: 0,
                ZOffset: 0,
                tooltypeID: -1,
                toolName:"",
                WidthOfCut: 0,
                flutes: 2,
            },
            sheet_MillingToolEdit: false,
            selectIndex : -1,
            toolTypeIndex: -1,
            Editdata_dialog:[                
                {
                    value:0,
                    label:"Gauge Length (mm)",
                    type:"number",
                },
                // {
                //     value:0,
                //     label:"Tip Radius (mm)",
                //     type:"number",
                // },
                // {
                //     value:0,
                //     label:"XOffset (mm)",
                //     type:"number",
                // },
                // {
                //     value:0,
                //     label:"ZOffset (mm)",
                //     type:"number",
                // },
                {
                    value:"",
                    label:"Name",
                    type:"text",
                },
                {
                    value:0,
                    label:"Diameter (mm)",
                    type:"number",
                },
                {
                    value:0,
                    label:"Width Of Cut (mm)",
                    type:"number",
                },
                {
                    value:0,
                    label:"Flutes (Number of teeth in the cutter)",
                    type:"number",
                },
            ],
		};
    },
    mounted() {
        this.initialDatas();
    },
    watch: {
        sheet_MillingToolEdit(to) {
            if (to == false) {
                this.toolTypeIndex = -1;
			}
        },
		isConnected(to) {
			if (to) {
				if(this.isLoadDatas == false){
					this.initialDatas();
					this.isLoadDatas = true;
				}
			}
        },
	}

}
</script>