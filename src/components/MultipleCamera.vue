<template>
	<div>
		<p class="uix-tx tc-ac"></p>
		<div class="segment">
			<div class="seg-header">
				<span>请上传4-6张真实图片</span>
			</div>
			<div class="seg-content">
				<dynamic-camera :options="dcamera_option"
				                :is_readonly="is_readonly"></dynamic-camera>
			</div>
		</div>
		<div class="bn-wrapper">
			<!-- 提交审核  保存信息 -->
			<div class="uix-bn normal large"
			     @click="saveMoreOfCar"
			     v-text="more_of_car_btn"></div>
		</div>

	</div>
</template>


<script>
	import DynamicCamera from '@/components/public/DynamicCamera';
	export default {
		name: 'MoreOfCar',
		props: {
			car_id: {required: false, default: ''},
			base_info: {type: Object, required: false},
			completeness: {type: Object, required: false},
			is_readonly: {type: Boolean, required: false},
		},
		data() {
			return {
				upload_img: [],
				insurance_status: false,
				driver_status: false,
				more_of_car_btn: '保存信息',
				dcamera_option: {
					max_size: 6,
					img_data: '',
					img_urls: [],
				},
				car_mark: '',
			};
		},

		watch: {
			base_info: {
				handler(params) {
					if (this.car_id !== '') {
						this.dcamera_option.img_urls = params.car_img;
						this.car_mark = params.car_mark;
					}
				},
				deep: true,
			},
			completeness: {
				handler(completeness) {
					if (completeness.base_status && completeness.driver_status && completeness.insurance_status) {
						this.more_of_car_btn = '提交审核';
					}
				},
				deep: true,
			},
		},
		components: {
			'dynamic-camera': DynamicCamera,
		},
		beforeRouteEnter(to, from, next) {
			next((vm) => {
				// 通过 `vm` 访问组件实例
				if (['CarDetail', 'Parameter'].includes(from.name) && vm.car_id !== '') {
					vm.$parent.refresh();
				}
			});
		},
		methods: {
			// 点击保存按钮
			saveMoreOfCar: function() {
				// 如果不是待提交审核状态不可再编辑
				if (this.is_readonly) {
					this.$router.push({
						name: 'CarDetail',
						params: {car_id: this.car_id},
					});
					return;
				}

				// 上传图片
				this.upload_img = this.dcamera_option.img_data.split(',');
				if ((this.dcamera_option.img_urls.length + this.upload_img.length) < 4) {
          alert('请上传图片4到6张');
          return;
					// return this.$dialog.toast('请上传车辆图片4到6张');
				}
				// 单张上传

				// 批量上传
				if (this.upload_img.length > 0) {
					this.batchUploadImg();
				}
			},
			// 保存信息
			saveData: function(urlString) {
				// 组装数据
				let paramData = {
					car_id: this.car_id,
					car_img: urlString,
					car_mark: this.car_mark,
				};
				// 保存图片
				this.$xhr
					.post('保存图片url', paramData, {
						loading: '保存中...',
					})
					.then((res) => {
						if (res.result === 0) {
							let car_id = res.data.car_id;

							if (this.car_id === '') {
								// 先replace一次路由，防止返回后数据有问题
								this.$router.replace({name: 'MoreOfCar', params: {car_id: car_id}});
							}
							this.$router.push({name: 'CarDetail', params: {car_id: car_id}});
							return;
            }
            alert(res.info);
						// this.$dialog.toast(res.info);
					})
					.catch(function(err){
            console.error(err);
          });
			},
			batchUploadImg: function() {
				this.$xhr
					.post(
						'批量上传图片',
						{image: this.dcamera_option.img_data},
						{loading: '图片上传中...'}
					)
					.then((res) => {
						if (res.result === 0) {
							let data = res.data;
							this.saveData([].concat(data.image?data.image:[], this.dcamera_option.img_urls).join('||'));
						} else {
              // this.$dialog.toast(res.info);
              alert(res.info);
						}
					})
					.catch(function(err){
            console.error(err);
          });
			},
		},
	};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
	.seg-header {
		padding : 20px 15px 0;

		color : #666;

		font-size : 14px;
		line-height : 22px;
	}

	.seg-content {
		padding : 0 15px;
	}

	.half-line {
		display : inline-block;

		width : 48%;
	}

	.txarea {
		width : 100%;
		height : 108px;
		margin-top : 5px;
		padding : 5px 10px;

		resize : none;

		border : 1px solid #D7D7D7;

		font-size : 14px;
	}

	.bn-wrapper {
		padding : 20px 15px 40px;
	}

	.bn-offset {
		padding : 10px 0;
	}

</style>


