<template>
	<div class="component">
		<v-toolbar>
			<!-- <directory-breadcrumbs v-model="directory"></directory-breadcrumbs> 
            Load file
            show list
            run stop pause            
            -->
            Job
			<v-spacer></v-spacer>
            
			<v-btn class="hidden-sm-and-down mr-3" @click="openFile">
				<v-icon class="mr-1">mdi-folder-plus</v-icon> Load File
			</v-btn>
            <v-btn class="hidden-sm-and-down mr-3" color="info" :disabled="!bLoadfile" @click="Play">
				<v-icon class="mr-1">mdi-arrow-right-drop-circle</v-icon> Start
			</v-btn>
			<v-btn class="hidden-sm-and-down mr-3" color="info" :disabled="!bLoadfile" @click="Pause">
				<v-icon class="mr-1">mdi-pause-circle</v-icon> Pause
			</v-btn>
			<v-btn class="hidden-sm-and-down mr-3" color="info" :disabled="!bLoadfile" @click="Stop">
				<v-icon class="mr-1">mdi-stop-circle</v-icon> Stop
			</v-btn>
		</v-toolbar>
        <v-list>
             <v-list-item
                v-for="item in items"
                :key="item.title"
            >
                <v-list-item-icon>
                <v-icon
                    v-if="item.icon"
                    color="pink"
                >
                    mdi-run-fast
                </v-icon>
                </v-list-item-icon>   
                <v-list-item-content>                    
                    <v-list-item-title v-text="item.title"></v-list-item-title>
                </v-list-item-content>

                <v-list-item-avatar>
                    {{item.oid}}
                </v-list-item-avatar>
            </v-list-item>       
        </v-list>
        
        <v-row>
            <v-col>
                <input type="file" ref="fileInput" @change="ListToJobItems" style="display: none">
            </v-col>
            <v-col>
                
            </v-col>
        </v-row>
	</div>
</template>

<script>
'use strict'

import { mapActions } from 'vuex'
export default {
	computed: {		
	},
	data() {
		return {			
            items: [
                // { icon: true, oid:1, title: 'Jason Oner' },
                // { icon: false, oid:2, title: 'Travis Howard' },
                // { icon: false, oid:3, title: 'Ali Connors'},
                // { icon: false, oid:4, title: 'Cindy Baker' },
            ],
            bLoadfile : false,
            iNowPos : -1,
            threadJob : null,
            //0 :stop  1:play  2:pause
            JobStatus : 0,
		}
	},
	methods: {
		...mapActions('machine', ['sendCode']),
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
            let contentBuffer = await this.fileSelected(file);
            contentBuffer = contentBuffer.split("\n");
            let semicolonPos = -1;
            console.log(contentBuffer.length);
            this.items = [];
            for( let i = 0 ; i < contentBuffer.length ; i++ ){
                let _arr = contentBuffer[i];
                if(_arr.length<=0)continue;
                semicolonPos = _arr.indexOf(";");
                if(semicolonPos==0)continue;
                else if(semicolonPos>0){
                    _arr = _arr.substring(0,semicolonPos);
                }
                _arr = _arr.replace(/^\s*|\s*$/g,"");
                if(_arr.length<=0)continue;
                this.items.push({ icon: false, oid:(this.items.length+1), title:_arr });
            }
            this.bLoadfile = true;
            this.iNowPos = 0;
        },
        openFile() {
            this.$refs.fileInput.click();
        },
		Play() {
            this.JobStatus = 1;
            if(!this.threadJob){
                this.threadJob = setInterval(() => {
                    this.play_backg();
                }, 100);
            }            
        },
        async play_backg() {
            if(this.items.length<=this.iNowPos){
                console.log("clearTimeout close...");
                clearTimeout(this.threadJob);
                this.threadJob = null;
                return;
            }
            if(this.iNowPos!=0){
                if(this.items[this.iNowPos-1].icon == true){
                    this.items[this.iNowPos-1].icon = false;
                    return;
                }                
            }            
            if(this.items[this.iNowPos].icon == false){
                this.items[this.iNowPos].icon = true;
                return;
            }
            if(this.JobStatus != 1){
                console.log("JobStatus change...JobStatus="+this.JobStatus );
                clearTimeout(this.threadJob);
                this.threadJob = null;
                return;
            }      
            //
            if(this.iNowPos<this.items.length-1){
                this.items[this.iNowPos+1].icon = true;
            }            
            await this.sendCode({ code: this.items[this.iNowPos].title, log: false });  
            console.log("command:"+this.items[this.iNowPos].title);
            //this.sleep(1000);                
            this.iNowPos++;
        },
        Stop() {
            this.JobStatus = 0;
            this.iNowPos = 0;
            clearTimeout(this.threadJob);
            this.threadJob = null;
            for( let i = 0 ; i < this.items.length ; i++ ){
                this.items[i].icon = false;
            }
        },
        Pause() {
            this.JobStatus = 2;
            //clearTimeout(this.threadJob);  
        },
        sleep(milliseconds) {
            var start = new Date().getTime();
            for (var i = 0; i < 1e7; i++) {
                if ((new Date().getTime() - start) > milliseconds){
                    break;
                }
            }
        },
	}
}
</script>

