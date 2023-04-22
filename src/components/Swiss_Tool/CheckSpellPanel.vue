<template>
    <div>
        Job
        <v-spacer></v-spacer>
        
        <v-btn class="hidden-sm-and-down mr-3" @click="openFile">
            <v-icon class="mr-1">mdi-folder-plus</v-icon> Load File
        </v-btn>    
        <v-row>
            <v-col>
                <input type="file" ref="fileInput" @change="ListToJobItems" style="display: none">
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-textarea
                    outlined
                    label="G codes"
                    :value="innerValue"
                    filled
                    auto-grow
                ></v-textarea>
            </v-col>
        </v-row>
    </div>
</template>

<script>
'use strict'

export default {
    computed: {
        formTitle () {
            return this.selectedIndex === -1 ? 'Select Turret Tool' : 'Select Milling Tool'
        },
    },
	data() {
		return {   
            innerValue : "",
            selectedIndex: -1,
            sheet_turret: false,
            GcodeArr : [0,1,2,3,4,10,11,17,18,19,20,21,28,29,30,31,32,38,53,54,55,56,57,58,59,60,76,80,83,84,90,91,92,233,234,235],
            McodeArr : [0,1,3,4,5,18,19,20,21,22,23,24,25,26,27,28,29,30,32,36,37,38,39,42,80,81,83,84,85,92,98,99,101,102,103,104,105,106,107,108,109,226,310,321,600,601],
		}
	},	
	methods: {
        fileSelected(_file) {
            return new Promise((resolve, reject) => {
                let reader = new FileReader();

                reader.onload = () => {
                resolve(reader.result);
                };
                reader.onerror = reject;
                reader.readAsText(_file);
            })            
        },
        async ListToJobItems(e){            
            let file = e.target.files[0];
            this.innerValue = await this.fileSelected(file);
            //console.log(this.innerValue );
            this.innerValue = this.CheckSpellWords(this.innerValue);
            //console.log(this.innerValue );
        },
        openFile() {
            this.$refs.fileInput.click();
        },
        CheckSpellWords(str){
            //splite string \n
            //let str = "% O0011\n N10 G98 G18\n N11 G21\n N12 G50 S6000\n N13 G28 U0.";
            let array_str = str.split("\n");
            let _finalStr = "";
            array_str = array_str.map(x =>x.trim());
            //
            for(let i=0 ; i< array_str.length ; i++){
                str = this.DealLine(array_str[i]);
                if(str != ""){
                    if(_finalStr.length>0)_finalStr+="\n";
                    _finalStr += str;
                }
            }
            return _finalStr;
            //console.log(_finalStr);
        },
        DealLine(_str){
            //search M or G
            let _MinIndex = -1;
            _str = _str.toUpperCase();
            _MinIndex = _str.search("M");
            _MinIndex = (_MinIndex < 0 || _str.search("G") < _MinIndex ) ? _str.search("G") : _MinIndex;

            if(_MinIndex < 0)return "";
            _str = _str.substring(_MinIndex);
            let _arrayData =  _str.split(" ");
            _arrayData = _arrayData.map(x =>x.trim());
            _arrayData = _arrayData.filter(function(str) {return /\S/.test(str);});
            //console.log(_arrayData);
            return this.AnalysisLineCode(_arrayData);
        },
        AnalysisLineCode(_arrCode){
            let _returnStr = "";
            let _datavalue;
            let _bFlag = false;
            for(let i=0 ; i< _arrCode.length ; i++){
                //value is number
                _datavalue = parseInt(this.GetSeenValue(_arrCode[i]));
                if (isNaN(_datavalue)) {
                    continue;
                }
                //check M or G code
                if( this.GetSeen(_arrCode[i]) == "G"){
                    //check G code
                    if(this.GcodeArr.includes(_datavalue)){
                        if(_returnStr.length>0)_returnStr+="\n";
                        _returnStr+=_arrCode[i];
                        _bFlag = true;
                    }
                }else if( this.GetSeen(_arrCode[i]) == "M"){
                    //check M code
                    if(this.McodeArr.includes(_datavalue)){
                        if(_returnStr.length>0)_returnStr+="\n";
                        _returnStr+=_arrCode[i];
                        _bFlag = true;
                    }
                }else if( this.GetSeen(_arrCode[i]) == "X"){
                    if(_returnStr.length>0)_returnStr+="\n";
                    _returnStr+=_arrCode[i];
                }else if( this.GetSeen(_arrCode[i]) == "Y"){
                    if(_returnStr.length>0)_returnStr+="\n";
                    _returnStr+=_arrCode[i];
                }else if(_bFlag){
                    //value is number
                    _datavalue = parseInt(this.GetSeenValue(_arrCode[i]));
                    if (isNaN(_datavalue)) {
                        continue;
                    }
                    _returnStr+= " " + this.GetSeen(_arrCode[i]) + _datavalue.toString();
                }
            }
            //console.log(_returnStr);
            return _returnStr;
        },
        GetSeen(_str){
            return _str.substring(0,1).trim();
        },
        GetSeenValue(_str){
            return _str.substring(1,_str.length).trim();
        },
    },


}
</script>