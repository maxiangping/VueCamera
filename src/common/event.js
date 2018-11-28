// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue';

const eventHub = new Vue({
	methods: {
		/* eslint-disable prefer-spread */
		on(...args) {
			this.$on.apply(this, args);
		},
		emit(...args) {
			this.$emit.apply(this, args);
		},
		off(...args) {
			this.$off.apply(this, args);
		},
		once(...args) {
			this.$once.apply(this, args);
		},
		/* eslint-disable prefer-spread */
	},
});
export const eventBusPlugin = (V) => Object.defineProperty(V.prototype, '$event', {value: eventHub, writable: true});

export default eventHub;
