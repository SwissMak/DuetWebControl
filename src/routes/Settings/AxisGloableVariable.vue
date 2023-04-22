<template>
	<v-row>
		<v-col xs="12" sm="12" md="12" lg="12" xl="12">
			<v-row>
				<v-col sm="12" md=12 lg=12 xl=12>
					<Axis-Gloable-Variable-Panel></Axis-Gloable-Variable-Panel>
				</v-col>
			</v-row>
			<!-- <v-row>
				<v-col sm="12" md=12 lg=12 xl=12>
					<ThreeD-View-Panel></ThreeD-View-Panel>
				</v-col>
			</v-row> -->
		</v-col>
	</v-row>
</template>

<script>

import { mapState } from 'vuex'

import { MachineMode } from '../../store/machine/modelEnums.js'

export default {
	computed: {
		...mapState('machine/model', {
			atxPower: state => state.state.atxPower,
			machineMode: state => state.state.machineMode
		}),
		isFFForUnset() {
			return !this.machineMode || (this.machineMode === MachineMode.fff);
		}
	}
}
</script>