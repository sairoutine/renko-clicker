'use strict';

var base_scene = require('../hakurei').scene.base;

var util = require('../hakurei').util;
var CONSTANT = require('../hakurei').constant;

var SceneStage = function(core) {
	base_scene.apply(this, arguments);
};
util.inherit(SceneStage, base_scene);

SceneStage.prototype.init = function(field_name, is_right){
	base_scene.prototype.init.apply(this, arguments);

};

SceneStage.prototype.beforeDraw = function(){
	base_scene.prototype.beforeDraw.apply(this, arguments);
};

// 画面更新
SceneStage.prototype.draw = function(){
	var ctx = this.core.ctx;
	ctx.save();

	// 背景描画
	var bg = this.core.image_loader.getImage("bg_super");
	ctx.drawImage(bg,
					0,
					0,
					bg.width,
					bg.height,
					0,
					0,
					this.core.width,
					this.core.height);

	var renko_base = this.core.image_loader.getImage("renko_base");
	ctx.drawImage(renko_base,
					0,
					0,
					renko_base.width,
					renko_base.height
	);

	var renko_eye = this.core.image_loader.getImage("renko_eye_00");
	ctx.drawImage(renko_eye,
					0,
					0,
					renko_eye.width,
					renko_eye.height
	);

	var renko_eyebrow = this.core.image_loader.getImage("renko_eyebrow_00");
	ctx.drawImage(renko_eyebrow,
					0,
					0,
					renko_eyebrow.width,
					renko_eyebrow.height
	);

	var renko_mouse = this.core.image_loader.getImage("renko_mouse_00");
	ctx.drawImage(renko_mouse,
					0,
					0,
					renko_mouse.width,
					renko_mouse.height
	);

	ctx.restore();
/*
	// フィールド名 表示
	// TODO: 削除
	ctx.font = "30px 'OradanoGSRR'";
	ctx.textAlign = 'center';
	ctx.textBaseAlign = 'middle';
	ctx.fillStyle = 'rgb( 0, 0, 0 )';
	ctx.fillText(this.field().name, this.width - 100, this.height - 10);

	ctx.restore();

	// こいし／サブシーン描画
	base_scene.prototype.draw.apply(this, arguments);
*/
};


module.exports = SceneStage;
