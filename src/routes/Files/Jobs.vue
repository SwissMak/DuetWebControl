<template>
	<v-row v-if="SettingMode">
		<v-col>
			<job-file-list></job-file-list>
		</v-col>
	</v-row>
</template>
<script>
'use strict'
import { mapState } from 'vuex'
export default {
	computed: {
		...mapState('machine/model', {
			fans: state => state.fans,
		}),
		SettingMode(){
            return (this.fans[13] != undefined) && this.fans[13].actualValue;
        },
    },	
}
</script>