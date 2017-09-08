'use strict';

var AssetsConfig = {};
AssetsConfig.images = {
	// from http://mangatop.info/sozai/comicline/952/
	bg_super: "./image/bg_super.png",
	// https://rare25.github.io/5000choyen/
	super_logo: "./image/super_logo.png",
	renko_base: "./image/renko/base/00.png",
	renko_eye_00: "./image/renko/eye/00.png",
	renko_eyebrow_00: "./image/renko/eyebrow/00.png",
	renko_mouse_00: "./image/renko/mouse/00.png",

	merry_base: "./image/merry/base/00.png",
	merry_eye_00: "./image/merry/eye/00.png",
	merry_eyebrow_00: "./image/merry/eyebrow/00.png",
	merry_mouse_00: "./image/merry/mouse/00.png",
};

// sound ファイルはogg と m4a の二種類を用意してください
AssetsConfig.sounds = {
	// https://sounddictionary.info/
	// シャキーン4
	flash: {
		path: "./sound/flash",
		volume: 1.0,
	},
	// 多分 魔王魂
	got: {
		path: "./sound/got",
		volume: 1.0,
	},

};

AssetsConfig.bgms = {
};


module.exports = AssetsConfig;
