<template>
	<div>
		<input-dialog :shown.sync="showFilenameDialog" :title="$t('dialog.newFile.title')" :prompt="$t('dialog.newFile.prompt')" @cancelled="cancelled" @confirmed="showEditor"></input-dialog>
		<file-edit-dialog :shown.sync="showEditorDialog" :filename="filename" :value="value"></file-edit-dialog>
	</div>
</template>

<script>
'use strict'

import { mapGetters, mapActions } from 'vuex'

import Path from '../../utils/path.js'

export default {
	props: {
		shown: {
			type: Boolean,
			required: true
		},
		directory: {
			type: String,
			required: true
		},
		value: String,
	},
	computed: mapGetters(['isConnected']),
	data() {
		return {
			showFilenameDialog: this.shown,

			filename: '',
			content: '',
			showEditorDialog: false
		}
	},
	methods: {
		...mapActions('machine', ['upload']),
		cancelled() {
			this.$emit('update:shown', false);
		},
		showEditor(filename) {
			this.filename = Path.combine(this.directory, filename);
			this.content = '';
			this.showEditorDialog = true;
		}
	},
	watch: {
		isConnected(to) {
			if (!to) {
				this.showFilename = false;
				this.showEditorDialog = false;
				this.$emit('update:shown', false);
			}
		},
		showEditorDialog(to) {
			if (this.shown !== to) {
				this.$emit('update:shown', to);
			}
		},
		shown(to) {
			if (to) {
				this.showFilenameDialog = true;
			} else {
				this.showFilenameDialog = false;
				this.showEditorDialog = false;
			}
		}
	}
}
</script>
