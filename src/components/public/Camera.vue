<template>
	<div :style="option.style">
		<div class="camera"
		     :class="option.theme">
			<div class="back">
				<div class="lt-flexbox vertical horizontal bg-wrapper">
					<img :width="option.img_size&&option.img_size.width"
					     :height="option.img_size&&option.img_size.height"
					     v-if="option['image']"
					     :class="{bg:!option.img_size}"
					     :src="option.image">
				</div>
			</div>
			<div class="layer canvas"
			     ref="canvas"></div>
			<div class="layer option">
				<label class="magic-bn"
				       :for="option.id">
					<input :id="option.id"
					       type="file"
					       accept="image/*"
					       :disabled="is_readonly"
					       @click="queue && pre_handler($event)"
					       @change="img_ready($event)"
					       style="display:none;">
				</label>
			</div>
		</div>
		<div v-if="!option.no_tab"
		     class="lt-flexbox vertical horizontal jaw">
			<img height="13"
			     src="/static/icon/icon_camera.svg">
			<label>&nbsp;{{option.name}}</label>
		</div>
	</div>
</template>

<script>
	import img_compress from '@/common/zipimg';
	import _ from '@/common/common';
	export default {
		name: 'Camera',
		props: {
			option: {type: Object, required: true},
			history: {type: Array, required: false},
			queue: {type: Object, required: false},
			is_readonly: {type: Boolean, default: false},
		},
		data() {
			return {};
		},
		watch: {
			option: {
				handler(item) {
					if (item.img_data === '') {
						this.remove_history();
					}

					if (item.img_url !== '' && item.img_data === '') {
						this.setup_img_from_url(item.img_url);
					}
				},
				deep: true,
			},
		},
		methods: {
			remove_history() {
				let history = this.history;
				if (history instanceof Array) {
					let index = history.indexOf(this.option.id);
					if (index !== -1) {
						history.splice(index, 1);
					}
				}
			},
			push_history() {
				let history = this.history;
				if (history instanceof Array) {
					let index = history.indexOf(this.option.id);
					if (index === -1) {
						history.push(this.option.id);
					}
				}
			},
			thumbnail_handler(thumbnail, cvns) {
				let self = this;
				const base64 = thumbnail.replace(/data:image\/(jpeg|png|jpg|bmp);base64,/, '');
				this.option.img_data = base64;

				_.expr(this.option.upload && this.option.img_url)
					.match(() => {
						this.$xhr
							.post('上传图片url', {image: base64}, {loading: '上传中...'})
							.then((res) => {
								let oss_url = res.data.image;
								this.option.img_url = oss_url;
								// 发送事件出去
								this.$event.emit('camera_ready', {
									id: this.option.id,
									data: base64,
									url: oss_url,
								});
								// this.$store.dispatch('destroy_loading');
							})
							.catch(() => {
								// this.$store.dispatch('destroy_loading');
								this.$dialog.error('上传图片错误！');
							});
					})
					.unwrap(() => {
						// 发送事件出去
						this.$event.emit('camera_ready', {
							id: this.option.id,
							data: base64,
						});
						// this.$store.dispatch('destroy_loading');
					});

				self.push_history();
			},
			pre_handler(e) {
				let self = this,
					queue = this.queue,
					queue_line = queue.line,
					queue_tip = queue.tip;
				if (Array.isArray(queue_line)) {
					let index = queue_line.indexOf(this.option.id);
					let not_match_id = queue_line.slice(0, index).find((req) => {
						return !self.history.includes(req);
					});

					if (not_match_id) {
						e.preventDefault();
						e.stopPropagation();
						alert(queue_tip[not_match_id] || '请按步聚上传图片');
						// this.$dialog.toast(queue_tip[not_match_id] || '请按步聚上传图片');
					}
				}
			},
			setup_img_from_url(img_url) {
				_.expr(img_url).match(() => {
					// this.$store.dispatch('open_loading', {msg: '图片加载中'});
					let wrapper = this.$refs.canvas,
						img = new Image();
					img.crossOrigin = 'anonymous';
					img.setAttribute('class', 'thumbnail-img');
					img.onload = () => {
						wrapper.innerHTML='';
						wrapper.appendChild(img);
						// this.$store.dispatch('destroy_loading');
					};
					img.onerror = () => {
						// this.$store.dispatch('destroy_loading');
					};
					img.src = img_url;
				});
			},
			img_ready(e) {
				// this.$store.dispatch('open_loading', {msg: '图片处理中'});
				let file = e.target.files[0],
					mb = 1e6,
					size = file ? file.size : 0,
					wrapper = this.$refs.canvas;

				const err_handle = () => {
					// this.$store.dispatch('destroy_loading');
					this.$dialog.error('上传图片错误！');
				};
				let img = new Image(),
					bold_url = URL.createObjectURL(file);
				img.crossOrigin = 'Anonymous'; // 启用CORS
				img.setAttribute('class', 'thumbnail-img');
				img.onload = () => {
					wrapper.innerHTML='';
					wrapper.appendChild(img);
					let compress_scale = (size <= mb ? 0.9 : mb / size).toFixed(1);
					let img_compress_result = img_compress(img, 'image/jpeg', compress_scale);
					this.thumbnail_handler(img_compress_result);
					URL.revokeObjectURL(bold_url);
				};
				img.onerror = err_handle;
				img.src = bold_url;
			},
		},
		mounted() {
			this.setup_img_from_url(this.option.img_url);
		},
	};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
	.camera {
		position : relative;

		height : inherit;

		font-size : 0;
	}

	.bg-wrapper {
		width : 100%;
		height : 100%;

		text-align : center;

		background : #E5E5E5;
		.bg {
			width : auto;
			max-width : 100%;
			height : auto;
			max-height : 100%;
		}
	}

	.dynamic {
		.bg-wrapper {
			background : #F5F5F5;
		}

		.back {
			border : 1px solid #D7D7D7;
			border-radius : 3px;
		}

		.mirror {
			border-radius : 3px;
		}
	}

	.back {
		height : 100%;
	}

	.layer {
		position : absolute;
		top : 0;

		width : 100%;
		height : 100%;

		&.canvas {
			z-index : 1;

			overflow : hidden;
		}
		&.option {
			z-index : 2;
		}
	}

	.mirror {
		width : 100%;
		height : 100%;
	}

	.magic-bn {
		display : block;

		height : 100%;

		cursor : pointer;

		widows : 100%;
	}

	.jaw {
		height : 26px;

		color : #FFF;
		background : #1DCE74;

		font-size : 13px;
	}
	

</style>
