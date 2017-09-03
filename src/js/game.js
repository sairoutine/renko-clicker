'use strict';
var core = require('./hakurei').core;
var util = require('./hakurei').util;

var SceneMain = require('./scene/main');
var SceneLoading = require('./scene/loading');

var Game = function(canvas) {
	core.apply(this, arguments);
};
util.inherit(Game, core);

Game.prototype.init = function () {
	core.prototype.init.apply(this, arguments);
};
Game.prototype.init = function () {
	core.prototype.init.apply(this, arguments);

	this.addScene("loading", new SceneLoading(this));
	this.addScene("main", new SceneMain(this));

	this.changeScene("loading");
};

module.exports = Game;
