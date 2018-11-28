

/**
 * Created by ling on 2017/7/6.
 */

let canvas, canvas_ctx, tcanvas, tcanvas_ctx;
const create_canvas = function() {
	return document.createElement('canvas');
};
const get_canvas = function() {
	if (!canvas) canvas = create_canvas();
	if (!tcanvas) tcanvas = create_canvas();
	if (!canvas_ctx) canvas_ctx = canvas.getContext('2d');

	if (!tcanvas_ctx) tcanvas_ctx = tcanvas.getContext('2d');
	return {canvas, canvas_ctx, tcanvas, tcanvas_ctx};
};

const img_compress = function(img, format, zip) {
	let base_width = img.width;
	let zoom = base_width < 512 ? Math.floor(512.0 / base_width) : 1;
	let {canvas, canvas_ctx, tcanvas, tcanvas_ctx} = get_canvas(),
		width = img.width * zoom,
		height = img.height * zoom,
		ratio = 1; // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下

	if ((ratio = width * height / 4000000) > 1) {
		ratio = Math.sqrt(ratio);
		width /= ratio;
		height /= ratio;
	} else {
		ratio = 1;
	}
	canvas.width = width;
	canvas.height = height;

	//        铺底色
	canvas_ctx.fillStyle = '#fff';
	canvas_ctx.fillRect(0, 0, width, height);

	// 如果图片像素大于100万则使用瓦片绘制
	let count;
	if ((count = width * height / 1000000) > 1) {
		count = ~~(Math.sqrt(count) + 1); // 计算要分成多少块瓦片

		// 计算每块瓦片的宽和高
		let nw = ~~(width / count);
		let nh = ~~(height / count);

		tcanvas.width = nw;
		tcanvas.height = nh;

		for (let i = 0; i < count; i++) {
			for (let j = 0; j < count; j++) {
				tcanvas_ctx.drawImage(
					img,
					~~(i * nw * ratio),
					~~(j * nh * ratio),
					~~(nw * ratio),
					~~(nh * ratio),
					0,
					0,
					nw,
					nh
				);

				canvas_ctx.drawImage(tcanvas, ~~(i * nw), ~~(j * nh), nw, nh);
			}
		}
	} else {
		canvas_ctx.drawImage(img, 0, 0, width, height);
	}

	// 进行最小压缩
	let ndata = canvas.toDataURL(format || 'image/jpeg', zip || 0.1);
	tcanvas.width = tcanvas.height = canvas.width = canvas.height = 0;

	return ndata;
};

export default img_compress;

