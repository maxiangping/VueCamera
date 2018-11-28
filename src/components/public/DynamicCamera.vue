<template>
	<div>
		<div class="lt-flexbox flex-wrap vertical justify"
		     ref="container">
			<div class="cam-wrapper"
			     :style="camera_style"
			     v-for="(camera,index) in cameras"
			     :key="camera.id">
				<div v-show="(camera.img_data !== '' || camera.img_url !== '') && !is_readonly"
				     @click="remove_camera(index)"
				     class="bn">
					<img width="20"
					     height="20"
					     src="/static/icon/ic_close.svg">
				</div>
				<camera class="camera"
				        :option="camera"
				        :is_readonly="is_readonly"></camera>
			</div>
			<div class="cam-wrapper"></div>
		</div>
	</div>
</template>

<script>
	import Camera from '@/components/public/Camera';
	import _ from '@/common/common';
	export default {
		name: 'DynamicCamera',
		props: {
			options: {type: Object, required: true},
			is_readonly: {type: Boolean, default: true},
		},
		components: {
			camera: Camera,
		},
		data() {
			return {
				camera_style: 'height:100px;',
				cameras: [],
				counter: 0,
			};
		},
		watch: {
			'options.img_urls'(img_urls) {
				let self = this;
				this.cameras = [];
				_.expr(img_urls instanceof Array)
					.match(() => {
						img_urls.forEach((url, index) => {
							self.create_new_camera(url);
						});

						if (!this.is_readonly) {
							if (this.cameras.length < this.options.max_size) {
								this.create_new_camera();
							}
						}
					})
					.unwrap(() => {
						self.create_new_camera();
					});
			},
		},
		methods: {
			create_new_camera(img_url) {
				if (this.cameras.length >= this.options.max_size) return;
				this.cameras.push({
					image: '/static/icon/ic_add.svg',
					img_size: {width: 44, height: 44},
					name: '',
					id: `dynamic_camera_${_.now()}`,
					img_data: '',
					no_tab: true,
					img_url: img_url ? img_url : '',
					theme: 'dynamic',
				});
				++this.counter;
			},
			remove_camera(index) {
				this.cameras.splice(index, 1);
				this.data_handle();
			},
			data_handle() {
				let cameras = this.cameras,
					last = cameras[cameras.length - 1];
				if (last.img_data !== '' || last.img_url !== '') {
					this.create_new_camera();
				}

				let img_data = [];
				cameras.forEach((item) => {
					if (item && item.img_data) {
						img_data.push(item.img_data);
					}
				});
				this.options.img_data = img_data.join(',');
				// this.options.img_urls = img_urls;
			},
			set_camera_size() {
				let container = this.$refs.container.getBoundingClientRect();
				this.camera_style = `height:${container.width * 0.3}px;margin:${container.width * 0.02}px 0;`;
			},
		},
		mounted() {
			let urls = this.options.img_urls;
			// 精准计算
			this.set_camera_size();

			_.expr(urls instanceof Array && urls.length > 0)
				.match(() => {
					urls.forEach((url, index) => this.create_new_camera(url));

					if (!this.is_readonly) {
						if (this.cameras.length < this.options.max_size) {
							this.create_new_camera();
						}
					}
				})
				.unwrap(this.create_new_camera);

			// 监听相机完成事件
			this.$event.on('camera_ready', () => {
				_.expr(this.cameras.length <= this.options.max_size).match(() => {
					this.data_handle();
				});
			});
		},
		destroy() {
			this.$event.off('camera_ready');
		},
	};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
	.cam-wrapper {
		position: relative;

		width: 30%;
	}
	.camera {
		width: 100%;
		height: 100%;
	}

	.bn {
		position: absolute;
		z-index: 10;
		top: -18px;
		right: -18px;

		width: 40px;
		height: 40px;
		padding: 10px;

		cursor: pointer;
	}
</style>
