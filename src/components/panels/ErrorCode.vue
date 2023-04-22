
<template>
	<v-card>
        
		<v-card-title class="pb-0">
            
			<v-icon small class="mr-1">mdi-texture</v-icon> BLDC Error<!--{{ $t('panel.extrusionFactors.caption') }}-->
			<v-spacer></v-spacer>
			<v-menu offset-y right auto>
				<template #activator="{ on }">
                    <!---->
					<a v-show="!uiFrozen && move.extruders.length" v-on="on" href="javascript:void(0)" class="subtitle-2">
						<!--{{ $t('panel.extrusionFactors.changeVisibility') }}-->
					</a>
				</template>

				<v-list>
					<v-list-item v-for="(extruder, index) in move.extruders" :key="index" @click="toggleExtruderVisibility(index)">
						<v-icon class="mr-1">
							{{ (displayedExtruders.indexOf(index) !== -1) ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank' }}
						</v-icon>
						<!--{{ $t('panel.extrusionFactors.extruder', [index]) }}-->
					</v-list-item>
				</v-list>
			</v-menu>
		</v-card-title>
		
		<v-card-text  class="d-flex flex-column pb-0">            
			<div class="d-inline-flex">
				Milling Spindle(RPM)
				<v-spacer></v-spacer>
				<!-- <v-btn-toggle :value="false" mandatory>
					<v-btn text :value="true" @click="togglePower(0,true)" >
						ON
					</v-btn>
					<v-btn text :value="false" @click="togglePower(0,false)">
						OFF
					</v-btn>
				</v-btn-toggle> -->
			</div>
			<!-- <slider :value=0 @input="setSpindleSpeed(0, $event)" :max=3600 ></slider> -->

			<v-spacer class="mb-10"></v-spacer>
			<v-spacer></v-spacer>

			<div class="d-inline-flex">
				Headstock Spindle(RPM)
				<v-spacer></v-spacer>
				<!-- <v-btn-toggle :value="false" mandatory>
					<v-btn text :value="true" @click="togglePower(1,true)" >
						ON
					</v-btn>
					<v-btn text :value="false" @click="togglePower(1,false)">
						OFF
					</v-btn>
				</v-btn-toggle> -->
			</div>
			<!-- <slider :value=0 @input="setSpindleSpeed(1, $event)" :max=3600 ></slider> -->

			<v-spacer class="mb-10"></v-spacer>
			<v-spacer></v-spacer>

			<div class="d-inline-flex">
				Tailstock Spindle(RPM)
				<v-spacer></v-spacer>
				<!-- <v-btn-toggle :value="false" mandatory>
					<v-btn text :value="true" @click="togglePower(2,true)" >
						ON
					</v-btn>
					<v-btn text :value="false" @click="togglePower(2,false)">
						OFF
					</v-btn>
				</v-btn-toggle> -->
			</div>
			<!-- <slider :value=0 @input="setSpindleSpeed(2, $event)" :max=3600 ></slider> -->

		</v-card-text>

		<v-alert type="error" v-for="(axis, axisIndex) in BLDC_Alarm" :key="axisIndex" dense class="mb-0">
			{{axis}}
		</v-alert>


	</v-card>
</template>

<script>
'use strict'


import { mapState, mapGetters } from 'vuex'

export default {
	computed: {
		...mapGetters(['uiFrozen']),
		...mapState('machine/model', ['move']),
		...mapState('machine/settings', ['displayedExtruders']),
		visibleExtruders() {
			return this.displayedExtruders.filter(drive => drive < this.move.extruders.length, this);
		}
	},
	data() {
		return {
			sendingCode: true,
			BLDC_Alarm: ["Axis.Error：","Motor Error：","Controller Error：","Encoder Error："]
		}
	}
}
</script>