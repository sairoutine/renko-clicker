'use strict';

var base_scene = require('../hakurei').scene.base;

var util = require('../hakurei').util;
var CONSTANT = require('../hakurei').constant;

var UIParts = require('../hakurei').object.ui_parts;

// スコア閾値ゲージの最大値
var GAUGE_MAX = 100;
// スコア閾値ゲージ余白
var VITAL_OUTLINE_MARGIN = 5;
// スーパー蓮子ちゃんタイム時間
var SUPER_RENKOCHAN_TIME_COUNT = 60 * 20;



/* TODO:
OGP
アツマール
ゆっくりの人に許可を取る
謝辞と遊び方を書く
いらない素材の削除
*/

var SceneStage = function(core) {
	base_scene.apply(this, arguments);
	var self = this;
	self.ui_parts = [];

	self.renko_canvas = null;

	// 蓮子
	self.renko = new UIParts(self, this.width/2, this.height/2, 400, 320, function draw () {

		// 蓮子を押下すると収縮する
		if(this.core.input_manager.isLeftClickDown()) {
			if (this.size > 0.5) this.size-=0.05;
		}
		else {
			if (1.0 > this.size) this.size+=0.05;
		}


		var ctx = this.core.ctx;
		ctx.save();
		ctx.translate(this.x(), this.y());
		if (false) { // 反転
			ctx.transform(-1, 0, 0, 1, 0, 0);
		}
		ctx.drawImage(self.renko_canvas,
			-self.renko_canvas.width/2  * this.size,
			-self.renko_canvas.height/2 * this.size,
			self.renko_canvas.width  * this.size,
			self.renko_canvas.height * this.size
		);

		ctx.restore();
	});
	self.renko.setVariable("size", 1);
};
util.inherit(SceneStage, base_scene);

SceneStage.prototype.init = function(field_name, is_right){
	base_scene.prototype.init.apply(this, arguments);
	this.removeAllObject();

	this.renko_canvas = this._createRenko("00", "00", "00");

	this.renko.init(); // 蓮子

	this.score = 0;
	this._renko_chan_score = 0;
	this._renko_chan_time  = 0;
	this.is_renko_chan_time  = false;
	this._renko_chan_time_logo  = 0;
};

SceneStage.prototype.beforeDraw = function(){
	base_scene.prototype.beforeDraw.apply(this, arguments);

	this.renko.beforeDraw(); // 蓮子

	// 画面外に出たメリーの削除
	this.removeOutOfStageObjects();

	// 左クリックが発生したときの処理
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
				var num = 10;

				for (var i = 0, len = num; i < len; i++) {
					// メリー生成
					this.addObject(this._createMerry());
				}
				this.score += num;
			}

			this.core.audio_loader.playSound("got");
		}
	}

	// スーパー蓮子ちゃんタイム 発生判定
	if (!this.is_renko_chan_time && this._renko_chan_score >= GAUGE_MAX) {
		this.is_renko_chan_time = true;
		this._renko_chan_score = 0;
		this._renko_chan_time  = SUPER_RENKOCHAN_TIME_COUNT;
		this._renko_chan_time_logo  = 0;

		this.core.audio_loader.playSound("flash");
	}
	else if (this.is_renko_chan_time) {
		// スーパー蓮子ちゃんタイム 終了判定
		if (this._renko_chan_time <= 0) {
			this.is_renko_chan_time = false;
			this._renko_chan_time  = 0;
		}
		else {
			this._renko_chan_time--;
			if (this._renko_chan_time_logo < 100) {
				this._renko_chan_time_logo+=2;
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

	// メリー達を表示
	base_scene.prototype.draw.apply(this, arguments);

	this.renko.draw(); // 蓮子

	// スコア表示
	ctx.font = "48px 'Comic Sans MS'";
	ctx.textAlign = 'right';
	ctx.textBaseAlign = 'middle';
	ctx.fillStyle = 'rgb( 0, 0, 0 )';
	ctx.fillText("Score: " + this.score, this.width - 10, this.height - 10);

	// スコア閾値ゲージ表示
	this._showGauge();

	// スーパー蓮子ちゃんタイムロゴ表示
	this._showLogo();



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

// スーパー蓮子ちゃんタイム ロゴ
SceneStage.prototype._showLogo = function(){
	if (this.is_renko_chan_time) {
		var ctx = this.core.ctx;
		ctx.save();

		// スーパー蓮子ちゃんタイム
		var logo = this.core.image_loader.getImage("super_logo");
		ctx.translate(this.width/2 + 50, 80);

		var width = logo.width  * this._renko_chan_time_logo/100 * 0.5;
		var height = logo.height * this._renko_chan_time_logo/100 * 1.0;

		ctx.drawImage(logo,
			-width/2,
			-height/2,
			width,
			height
		);

		ctx.restore();
	}
};
var EXTRA_OUT_OF_SIZE = 100;
// 画面外に出たオブジェクトを消去する
SceneStage.prototype.removeOutOfStageObjects = function() {
	var new_objects = [];

	// オブジェクトが画面外に出たかどうか判定
	for(var i = 0, len = this.objects.length; i<len; i++) {
		var object = this.objects[i];
		if(object.x() + EXTRA_OUT_OF_SIZE < 0 ||
		   object.y() + EXTRA_OUT_OF_SIZE < 0 ||
		   object.x() > this.width  + EXTRA_OUT_OF_SIZE ||
		   object.y() > this.height + EXTRA_OUT_OF_SIZE
		  ) {
			  // 削除するので何もしない
		}
		else {
			new_objects.push(object);
		}
	}

	this.objects = new_objects;
};











module.exports = SceneStage;
