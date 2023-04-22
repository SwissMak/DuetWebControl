<style scoped>
.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  max-width: 300px;
  margin: auto;
  text-align: center;
}

.title {
  color: grey;
  font-size: 18px;
}

button {
  border: none;
  outline: 0;
  display: inline-block;
  padding: 8px;
  color: white;
  background-color: #000;
  text-align: center;
  cursor: pointer;
  width: 100%;
  font-size: 18px;
}

a {
  text-decoration: none;
  font-size: 22px;
  color: black;
}

button:hover, a:hover {
  opacity: 0.7;
}
</style>
<template>
    
	<v-card>
        
		<v-card-title class="pb-0">
            
			<v-icon small class="mr-1">mdi-account</v-icon> About US<!--{{ $t('panel.extrusionFactors.caption') }}-->
			
		</v-card-title>
		
		<v-card-text  class="d-flex flex-column pb-0"> 
			<v-row>
				<v-col>
					<div class="card">
						<img src="/Perry.png" alt="Perry" style="width:100%">
						<h1>Perry</h1>
						<p class="title">CEO & Founder</p>
						<p><button>Contact</button></p>
					</div>  
				</v-col>
				<v-col>
					<div class="card">
						<img src="/Joy.png" alt="Joy" style="width:100%">
						<h1>Joy</h1>
						<p class="title">CFO & CMO</p>
						<p><button>Contact</button></p>
					</div>  
				</v-col>
				<v-col>
					<div class="card">
						<img src="/Gary.png" alt="Gary" style="width:100%">
						<h1>Gary</h1>
						<p class="title">Chief Operating Officer</p>
						<p><button>Contact</button></p>
					</div>  
				</v-col>
				<v-col>
					<div class="card">
						<img src="/Steven.png" alt="Steven" style="width:100%">
						<h1>Steven</h1>
						<p class="title">Chief Mechanism Officer</p>
						<p><button>Contact</button></p>
					</div>  
				</v-col>
			</v-row>
			<v-row>
				<v-col>
					<div class="card">
						<img src="/NumberWang.png" alt="JimmyWang" style="width:100%">
						<h1>Jimmy Wang</h1>
						<p class="title">Chief Technology Officer</p>
						<p><button>Contact</button></p>
					</div>  
				</v-col>
				<v-col>
					<div class="card">
						<img src="/Erric.png" alt="Erric" style="width:100%">
						<h1>Erric</h1>
						<p class="title">Chief Assembling Officer</p>
						<p><button>Contact</button></p>
					</div>  
				</v-col>
				<v-col>
					<div class="card">
						<img src="/JimmyChiu.png" alt="JimmyChiu" style="width:100%">
						<h1>Jimmy Chiu</h1>
						<p class="title">Staff</p>
						<p><button>Contact</button></p>
					</div>  
				</v-col>
				<v-col>					
				</v-col>
			</v-row>
		</v-card-text>
	</v-card>
</template>

<script>
'use strict'
import { mapGetters } from 'vuex'
export default {
	computed: {
		...mapGetters(['uiFrozen'])
	}
}
</script>