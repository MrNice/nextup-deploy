/*globals define*/
define(function(require, exports, module) {
  var View           = require('famous/core/View');
  var Surface        = require('famous/core/Surface');
  var Transform      = require('famous/core/Transform');
  var Modifier       = require('famous/core/Modifier');
  var OptionsManager = require('famous/core/OptionsManager');
  var Transitionable = require('famous/transitions/Transitionable');
  var Easing         = require('famous/transitions/Easing');

  function ArticleTab(model, options) {
    View.apply(this, arguments);

    this.options = Object.create(ArticleTab.DEFAULT_OPTIONS);
    this._optionsManager = new OptionsManager(this.options);
    if (options) this.setOptions(options);

    this.article = model;

    this.transform = new Transitionable(this.options.start);
    this.size = new Transitionable([0, 0, 0]);

    this.surfaceModifier = new Modifier();
    this.surfaceModifier.transformFrom(function() {
      var currentValue = this.transform.get();
      return Transform.translate(currentValue[0], currentValue[1], currentValue[2]);
    }.bind(this));

    this.surfaceModifier.sizeFrom(this.getSize());

    var title = this.article.get('title');

    if (title.length > 40) title = title.slice(0, 40) + '...';

    this.surface = new Surface({
      content: title,
      size: this.options.size,
      properties: {
        backgroundColor: this.article.get('color') || this.color,
        lineHeight: this.options.size[1] + 'px',
        borderRadius: this.options.borderRadius,
        paddingLeft: '20px'
      }
    });

    this.surface.pipe(this._eventOutput);

    // hookup event inputs outputs
    this.surface.on('click', function() {
      this._eventOutput.emit('surfaceClick', this.article);
    }.bind(this));

    this._add(this.surfaceModifier).add(this.surface);
  }

  ArticleTab.prototype = Object.create(View.prototype);
  ArticleTab.prototype.constructor = ArticleTab;

  ArticleTab.DEFAULT_OPTIONS = {
    size: [undefined, 80],
    borderRadius: '0px 5px 5px 0px',
    color: '#ccddff',
    start: [0, 0, 0]
  };

  ArticleTab.prototype.delete = function(cb) {
    this.transform.set([400, 0, 0], {duration: 300, curve: Easing.inOutCirc}, function() {
        cb();
    }.bind(this));
  };

  ArticleTab.prototype.add = function() {
    this.transform.set([0, 0, 0], {duration: 300, curve: Easing.inOutCirc}, function() {
    }.bind(this));
  };

  module.exports = ArticleTab;
});
