import Axios from 'axios';
import qs from 'qs';
import {shim} from 'promise.prototype.finally';

// import dialog from '@/common/plugin/dialog';

shim();

let store = {};
const axios = Axios.create();
const requestMap = {};

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

axios.interceptors.request.use((config) => {
	if (config.loading) {
		// store.dispatch('open_loading', typeof config.loading === 'string' ? {msg: config.loading} : undefined);
	}

	if (config.mock && process.env.NODE_ENV === 'development') {
		config.adapter = (cfg) =>
			new Promise((resolve) => {
				setTimeout(
					() =>
						resolve({
							data: config.mock,
							status: 200,
							statusText: 'mock ok',
							config: cfg,
							headers: '',
						}),
					cfg.mockTimeout || 0
				);
			});
	}

	config.cancelToken = config.cancelToken || Axios.CancelToken.source().token;

	if (config.successive) {
		const cancelToken = requestMap[config.url];
		if (cancelToken !== undefined) {
			cancelToken.reason = new Axios.Cancel('Canceled by successive request.');
		}
		requestMap[config.url] = config.cancelToken;
	} else if (config.single) {
		if (requestMap[config.url]) {
			config.cancelToken.reason = new Axios.Cancel('Canceled by singleton.');
		} else {
			requestMap[config.url] = config.cancelToken;
		}
	}

	if (config.method === 'post') {
		config.data = qs.stringify(config.data);
	}

	return config;
});

// Add a response interceptor
axios.interceptors.response.use(
	(response) => {
		if (response.config.loading) {
			alert(response.config.loading)
			// store.dispatch('destroy_loading');
		}
		if (response.config.successive || response.config.single) {
			delete requestMap[response.config.url];
		}
		// Do something with response data
		let data = response.data;
		response.info = data.hasOwnProperty('info') ? data.info : data.msg;
		response.data = data.data;
		response.result = data.hasOwnProperty('result') ? data.result : data.code;

		return response;
	},
	(error) => {
		if (error.config) {
			if (error.config.successive) {
				if (requestMap[error.config.url] === error.config.cancelToken) {
					delete requestMap[resp.config.url];
				}
			} else if (error.config.single) {
				delete requestMap[resp.config.url];
			}
			if (error.config.loading) {
				// store.dispatch('destroy_loading');
			}
		}
		if (!Axios.isCancel(error)) {
			if (error.config && error.config.dialogError) {
				// dialog.error();
				console.log('错误');
			}
			try {
				console.log(JSON.stringify(error, null, 2));
			} catch (_err) {
				console.log(String(error));
			}
		}
		// Do something with response error
		return Promise.reject(error);
	}
);

axios.setStore = (_store) => (store = _store);

export default axios;
export const axiosPlugin = (Vue) => Object.defineProperty(Vue.prototype, '$xhr', {value: axios, writable: true});
