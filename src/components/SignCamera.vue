<template>
  <div class="seg-content">
    <div class="lt-flexbox justify">
      <div class="half-line">
        <camera :option="carInsuranceFront"
                :is_readonly="false" :history="history" :queue="queue"></camera>
      </div>
      <div class="half-line">
        <camera :option="carInsuranceBack"
                :is_readonly="false" :history="history" :queue="queue"></camera>
      </div>
    </div>
    <div class="btn" @click="saveInsurancePic">
      提交
    </div>

  </div>
  
</template>

<script>
import Camera from '@/components/public/Camera';
import _ from '@/common/common';
export default {
  name: 'HelloCamera',
  data () {
    return {
      carInsuranceFront: {
					image: '/static/imgs/insurance_1.jpg',
					name: '请上传图片1',
					id: 'insurance_img_1',
					img_data: '',
					img_url: '',
				},
				carInsuranceBack: {
					image: '/static/imgs/insurance_2.jpg',
					name: '请上传图片2',
					id: 'insurance_img_2',
					img_data: '',
					img_url: '',
        },
        history: [],
				queue: {
					line: ['insurance_img_1', 'insurance_img_1'],
					tip: {
						id_card_front: '请先上传图片1',
					},
				},
    }
  },
  components: {
    camera: Camera,
  },
  methods: {
    saveInsurancePic: function() {
      var self = this;
      // 判断是否上传了图片
          if (_.isNull(this.carInsuranceFront.img_data) && _.isNull(this.carInsuranceFront.img_url)) {
            alert('请上传图片1');
            return;
          }
          if (_.isNull(this.carInsuranceBack.img_data) && _.isNull(this.carInsuranceBack.img_url)) {
            alert('请上传图片2');
            return;
          }
  
          // 上传图片
          let imageData = (this.carInsuranceFront.img_data || this.carInsuranceFront.img_url) + ',' +
            (this.carInsuranceBack.img_data || this.carInsuranceBack.img_url);
          this.$xhr
            .post('上传多个图片url', {image: imageData}, {loading: '图片上传中...'})
            .then((res) => {
              if (res.result === 0) {
                this.saveData(res.data.image[0], res.data.image[1]);
              } else {
                alert(res.info);
              }
            })
            .catch(function(err){
              console.error(err);
            });

    },
    // 保存信息
			saveData(carInsuranceFrontImg, carInsuranceBackImg) {
				// 组装数据
				let paramData = {
					insurance_img_1: carInsuranceFrontImg,
					insurance_img_2: carInsuranceBackImg,
				};
				if (this.car_id) paramData.car_id = this.car_id;

				// 保存图片
				console.log(paramData);
			},
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.seg-content {
  padding : 0 15px 20px;
}

.half-line {
  display : inline-block;

  width : 48%;
}
.btn {
  margin-top: 50px;
  height: 40px;
  line-height: 40px;
  color: #fff;
  background: #00f000;
  border-radius: 5px;
}

</style>
