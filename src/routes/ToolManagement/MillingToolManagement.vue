<template>
	<v-row>
		<v-col xs="12" sm="12" md="12" lg="12" xl="12">
			<v-row>
				<!-- <v-col 
				v-if="machineMode == 'Milling Mode'"
				sm="12" md=12 lg=12 xl=12>
					<Tool-Position-Milling-Panel></Tool-Position-Milling-Panel>
				</v-col>
				<v-col
				v-else
				sm="12" md=12 lg=12 xl=12>
					Need Setting 4 Axis Mode
				</v-col> -->
				<v-col
				v-if="machineMode == 'Lathe Mode - Diameter' || machineMode == 'Lathe Mode - Radius'"
				sm="12" md=12 lg=12 xl=12>
					<Tool-Position-Turret-Panel></Tool-Position-Turret-Panel>
				</v-col>
				<v-col
				v-else
				sm="12" md=12 lg=12 xl=12>
					<Tool-Position-Milling-Panel></Tool-Position-Milling-Panel>
				</v-col>
			</v-row>
		</v-col>
	</v-row>
</template>

<script>
'use strict'
import { mapState } from 'vuex'
export default {
	computed: {
		...mapState('machine/model', {
			machineMode: state => state.state.machineMode,
		}),
	},
}
</script>
