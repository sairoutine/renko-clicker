'use strict';

var base_scene = require('../hakurei').scene.base;

var util = require('../hakurei').util;
var CONSTANT = require('../hakurei').constant;

var UIParts = require('../hakurei').object.ui_parts;

// スコア閾値ゲージの最大値
var GAUGE_MAX = 100;


/* TODO:
スコアが閾値を超えると、スーパー蓮子ちゃんタイムになる
→ 背景変更／ロゴがにゅいんと出て来る
クリックすると蓮子が回転する
→ 大小／回転／表情変更

蓮子をメリーの前へ
画面外オブジェクトの削除
*/

var SceneStage = function(core) {
	base_scene.apply(this, arguments);
	var self = this;
	self.ui_parts = [];

	self.renko_canvas = null;

	// 蓮子
	self.renko = new UIParts(self, this.width/2, this.height/2, 400, 320, function draw () {
		var ctx = this.core.ctx;
		ctx.save();
		ctx.translate(this.x(), this.y());
		if (false) { // 反転
			ctx.transform(-1, 0, 0, 1, 0, 0);
		}
		ctx.drawImage(self.renko_canvas, -self.renko_canvas.width/2, -self.renko_canvas.height/2);

		ctx.restore();
	});

};
util.inherit(SceneStage, base_scene);

SceneStage.prototype.init = function(field_name, is_right){
	base_scene.prototype.init.apply(this, arguments);

	this.renko_canvas = this._createRenko("00", "00", "00");

	this.removeAllObject();
	this.addObject(this.renko); // 蓮子

	this.score = 0;
	this._renko_chan_score = 0;
	this._renko_chan_time  = 0;
	this.is_renko_chan_time  = false;
};

SceneStage.prototype.beforeDraw = function(){
	base_scene.prototype.beforeDraw.apply(this, arguments);

	if(this.core.input_manager.isLeftClickPush()) {
		// 左クリックしたところを取得
		var x = this.core.input_manager.mousePositionX();
		var y = this.core.input_manager.mousePositionY();

		if(this.renko.checkCollisionWithPosition(x, y)) {
			if (!this.is_renko_chan_time) {
				// メリー生成
				this.addObject(this._createMerry());

				this.score += 1;
				this._renko_chan_score += 1;
			}
			else { // スーパー蓮子ちゃんタイム
				var num = 25;

				for (var i = 0, len = num; i < len; i++) {
					// メリー生成
					this.addObject(this._createMerry());
				}
				this.score += num;
			}
		}
	}
};

// 画面更新
SceneStage.prototype.draw = function(){
	var ctx = this.core.ctx;


	// 背景描画
	if (!this.is_renko_chan_time) {
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, this.width, this.height);

	}
	else {
		// スーパー蓮子ちゃんタイム
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
	}

	base_scene.prototype.draw.apply(this, arguments);

	// スコア表示
	ctx.font = "48px 'Comic Sans MS'";
	ctx.textAlign = 'right';
	ctx.textBaseAlign = 'middle';
	ctx.fillStyle = 'rgb( 0, 0, 0 )';
	ctx.fillText("Score: " + this.score, this.width - 10, this.height - 10);

	// スコア閾値ゲージ表示
	this._showGauge();

	ctx.restore();
};


SceneStage.prototype._createRenko = function(){
	// create canvas
	var canvas = window.document.createElement('canvas');
	canvas.width  = 400;
	canvas.height = 320;
	var ctx2 = canvas.getContext('2d');

	var renko_base = this.core.image_loader.getImage("renko_base");
	ctx2.drawImage(renko_base,
					0,
					0,
					renko_base.width,
					renko_base.height
	);

	var renko_eye = this.core.image_loader.getImage("renko_eye_00");
	ctx2.drawImage(renko_eye,
					0,
					0,
					renko_eye.width,
					renko_eye.height
	);

	var renko_eyebrow = this.core.image_loader.getImage("renko_eyebrow_00");
	ctx2.drawImage(renko_eyebrow,
					0,
					0,
					renko_eyebrow.width,
					renko_eyebrow.height
	);

	var renko_mouse = this.core.image_loader.getImage("renko_mouse_00");
	ctx2.drawImage(renko_mouse,
					0,
					0,
					renko_mouse.width,
					renko_mouse.height
	);

	return canvas;
};

SceneStage.prototype._createMerry = function(){
	// create canvas
	var canvas = window.document.createElement('canvas');
	canvas.width  = 400;
	canvas.height = 320;
	var ctx2 = canvas.getContext('2d');

	var merry_base = this.core.image_loader.getImage("merry_base");
	ctx2.drawImage(merry_base,
					0,
					0,
					merry_base.width,
					merry_base.height
	);

	var merry_eye = this.core.image_loader.getImage("merry_eye_00");
	ctx2.drawImage(merry_eye,
					0,
					0,
					merry_eye.width,
					merry_eye.height
	);

	var merry_eyebrow = this.core.image_loader.getImage("merry_eyebrow_00");
	ctx2.drawImage(merry_eyebrow,
					0,
					0,
					merry_eyebrow.width,
					merry_eyebrow.height
	);

	var merry_mouse = this.core.image_loader.getImage("merry_mouse_00");
	ctx2.drawImage(merry_mouse,
					0,
					0,
					merry_mouse.width,
					merry_mouse.height
	);

	// 出現位置(ランダム)
	var x = Math.floor(Math.random() * this.width);
	var y = -60;
	// メリーの角度
	var rotate = Math.floor(Math.random() * 360);
	var speed = 10 + Math.floor(Math.random() * 5);

	return new UIParts(this, x, y, 0, 0, function draw () {
		this.y(this.y() + speed);

		var ctx = this.core.ctx;
		ctx.save();
		ctx.translate(this.x(), this.y());
		ctx.rotate(rotate);
		ctx.drawImage(canvas, -canvas.width/2, -canvas.height/2, canvas.width*0.5, canvas.height*0.5);

		ctx.restore();
	});


};

var VITAL_OUTLINE_MARGIN = 5;
// スコア閾値ゲージ
SceneStage.prototype._showGauge = function(){
	var ctx = this.core.ctx;
	ctx.save();

	ctx.fillStyle = 'red';
	ctx.fillRect(
		VITAL_OUTLINE_MARGIN,
		VITAL_OUTLINE_MARGIN,
		this._renko_chan_score / GAUGE_MAX * (this.width - VITAL_OUTLINE_MARGIN * 2),
		VITAL_OUTLINE_MARGIN * 4
	);

	ctx.restore();
};










module.exports = SceneStage;
