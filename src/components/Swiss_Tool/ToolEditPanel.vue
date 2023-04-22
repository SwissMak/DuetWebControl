<style scoped>

</style>
<template>
    <div>
    <v-row>
        
        <v-col></v-col>
    </v-row>
    <v-data-table
        :headers="headers"
        :items="ToolsParameter"
        :items-per-page="20"
        class="elevation-1"
    >    
    <template v-slot:top>
        <!-- Edit dialog -->
        <v-dialog v-model="dialog">
            <template v-slot:activator="{ on, attrs }">
                <v-row>
                    <v-col
                    class="ml-4"
                    >
                        <v-btn
                        color="primary"
                        dark
                        class="mb-2"
                        v-bind="attrs"
                        v-on="on"
                        >
                            Create New Tool
                        </v-btn>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col align="end"
                    class="mr-4"
                    >
                        <v-btn
                        color="primary"
                        dark
                        @click="saveToFile"
                        >
                            Save
                        </v-btn>
                    </v-col>
                </v-row>
            </template>
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col
                            cols="12"
                            sm="6"
                            md="4"
                            class="pa-5"
                            >
                                <v-text-field
                                    v-model="editedItem.name"
                                    label="Tool name"
                                ></v-text-field>
                            </v-col>
                            <v-col
                            cols="12"
                            sm="6"
                            md="4"
                            class="pa-5"
                            >
                                <v-text-field
                                    v-model="editedItem.Length"
                                    label="Length(mm)"
                                    type="number"
                                ></v-text-field>
                            </v-col>
                            <v-col
                            cols="12"
                            sm="6"
                            md="4"
                            class="pa-5"
                            >
                                <v-text-field
                                    v-model="editedItem.Diameter"
                                    label="Diameter (mm)"
                                    type="number"
                                ></v-text-field>
                            </v-col>
                            <v-col
                            cols="12"
                            sm="6"
                            md="4"
                            class="pa-5"
                            >
                                <v-text-field
                                    v-model="editedItem.TipRadius"
                                    label="Tip Radius (mm)"
                                    type="number"
                                ></v-text-field>
                            </v-col>
                            <v-col
                            cols="12"
                            sm="6"
                            md="4"
                            class="pa-5"
                            >
                                <v-text-field
                                    v-model="editedItem.XOffset"
                                    label="X Offset (mm)"
                                    type="number"
                                ></v-text-field>
                            </v-col>
                            <v-col
                            cols="12"
                            sm="6"
                            md="4"
                            class="pa-5"
                            >
                                <v-text-field
                                    v-model="editedItem.YOffset"
                                    label="Y Offset (mm)"
                                    type="number"
                                ></v-text-field>
                            </v-col>
                            <v-col
                            cols="12"
                            sm="6"
                            md="4"
                            class="pa-5"
                            >
                                <v-text-field
                                    v-model="editedItem.ZOffset"
                                    label="Z Offset (mm)"
                                    type="number"
                                ></v-text-field>
                            </v-col>
                            <v-col
                            cols="12"
                            sm="6"
                            md="4"
                            class="pa-5"
                            >
                                <v-combobox
                                label="Type"
                                dense 
                                hide-selected 
                                :items="toolKind" 
                                v-model="editedItem.toolKind"
                                ></v-combobox>
                            </v-col>
                            <v-col
                            cols="12"
                            sm="6"
                            md="4"
                            class="pa-5"
                            >
                                <v-combobox
                                label="Type"
                                dense 
                                hide-selected 
                                :items="ToolTypes" 
                                v-model="editedItem.tooltype"
                                ></v-combobox>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                    color="blue darken-1"
                    text
                    @click="close"
                    >
                        Cancel
                    </v-btn>
                    <v-btn
                    color="blue darken-1"
                    text
                    @click="save"
                    >
                        OK
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">Are you sure you want to delete this tool?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
    </template>
    
    <template v-slot:[`item.actions`]="{ item }">
        <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
        >
            mdi-pencil
        </v-icon>
        <v-icon
            small
            @click="deleteItem(item)"
        >
            mdi-delete
        </v-icon>
    </template>
  </v-data-table>
    </div>
</template>



<script>
'use strict'
import { mapState,mapGetters,mapActions,mapMutations } from 'vuex'
//import ToolParameters from '../store/ToolSettings.js'
export default {
	computed: {
        ...mapGetters(['uiFrozen','isConnected', 'isLocal']),
        ...mapState('ToolSettings', {
			ToolsParameter: state => state.Tools_turrent,
        }),
        formTitle () {
            return this.editedIndex === -1 ? 'Create New Tool' : 'Edit Tool'
        },
    },    
	methods:{
        ...mapActions('machine', ['sendCode']),
        ...mapMutations('ToolSettings', ['AddTool_turrent','EditTool_turrent','LoadParameter_Tools_turrent','LoadParameter_Tools_Path_turrent','updateToolAllparas']),
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
        editItem (item) {
            this.editedIndex = this.ToolsParameter.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialog = true;
        },

        deleteItem (item) {
            this.editedIndex = this.ToolsParameter.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialogDelete = true;
        },

        deleteItemConfirm () {
            this.ToolsParameter.splice(this.editedIndex, 1);
            this.closeDelete();
        },

        close () {
            this.dialog = false;
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
                })
        },

        closeDelete () {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
            })
        },
        save () {
            if (this.editedIndex > -1) {
                this.editedItem.Length= parseFloat(this.editedItem.Length);
                this.editedItem.Diameter= parseFloat(this.editedItem.Diameter);
                this.editedItem.TipRadius= parseFloat(this.editedItem.TipRadius);
                this.editedItem.XOffset= parseFloat(this.editedItem.XOffset);
                this.editedItem.YOffset= parseFloat(this.editedItem.YOffset);
                this.editedItem.ZOffset= parseFloat(this.editedItem.ZOffset);
                let getdatas = JSON.stringify(Object.assign({}, this.editedItem));
                this.EditTool_turrent(JSON.stringify({ index: this.editedIndex, datas: getdatas}));
            } else {
                this.editedItem.oid = this.highestToolNumber();
                this.AddTool_turrent(JSON.stringify(this.editedItem));
            }
            this.close();
        },
        highestToolNumber(){
            if (this.ToolsParameter.length == 0) return 
            let _nowMaxOid = this.ToolsParameter.reduce((a,b) => Number(a.oid) > Number(b.oid) ? a : b);
            return _nowMaxOid.oid+1;
        },
        GetConsole () {
            //console.log(this.isConnected());
            // ToolParameters test = new ToolParameters();
            // console.log(test);
        },
        async saveToFile() {
            if(this.isConnected == false)return;
            await this.saveFile(this.ToolParameterFileName,JSON.stringify(this.ToolsParameter));			
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
            ToolParameterFileNamePath : "Tools_Path_turrent",
            ToolParameterFileName : "ToolsParameters",
			isLoadDatas : false,
            dialog: false,
            dialogDelete: false,
            headers: [
                {
                    text: 'Tool Name',
                    align: 'start',
                    sortable: false,
                    value: 'name',
                },
                { text: 'Gauge Length (mm)', value: 'Length' },
                { text: 'Diameter (mm)', value: 'Diameter' },
                { text: 'Tip Radius (mm)', value: 'TipRadius' },
                { text: 'X (mm)', value: 'XOffset' },
                { text: 'Y (mm)', value: 'YOffset' },
                { text: 'Z (mm)', value: 'ZOffset' },
                { text: 'Type', value: 'tooltype' },
                { text: 'Actions', value: 'actions', sortable: false },
            ],            
            editedIndex: -1,
            editedItem: {
                oid: 1,
                name: 'unnamed',
                Length: 0,
                Diameter: 0,
                TipRadius: 0,
                XOffset: 0,
                YOffset: 0,
                ZOffset: 0,
                toolKind: "Turret",
                tooltype: "Radial",
            },
            defaultItem: {
                oid: 1,
                name: 'unnamed',
                Length: 0,
                Diameter: 0,
                TipRadius: 0,
                XOffset: 0,
                YOffset: 0,
                ZOffset: 0,
                toolKind: "Turret",
                tooltype: "Radial",
            },
            ToolTypes : [
                "Radial","Axial"
            ],
            toolKind : [
                "Turret","Milling"
            ],
		};
		
    },
    watch: {
        dialog (val) {
            val || this.close()
        },
        dialogDelete (val) {
            val || this.closeDelete()
        },
    },

}
</script>