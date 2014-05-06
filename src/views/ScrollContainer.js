define(function(require, exports, module) {
  'use strict';
  var Surface          = require('famous/core/Surface');
  var View             = require('famous/core/View');
  var ScrollContainer  = require('famous/views/ScrollContainer');
  var Utility          = require('famous/utilities/Utility');

  function _createScrollContainer() {
    this.container = new ScrollContainer({
      look: {
        size: this.options.scrollSize,
        properties: this.options.scrollProperties
      },
      feel: {
        direction: Utility.Direction.Y,
        itemSpacing: 20
      }
    });
  }

  function _populateArticles() {
    this.container.sequenceFrom(this.surfaces);

    for (var i = 0; i < 200; i++) {
      var temp = new Surface({
        content: 'Surface: ' + (i + 1),
        size: this.options.elementSize,
        properties: {
          backgroundColor: 'hsl(' + (i * 360 / 20) + ', 100%, 50%)',
          lineHeight: this.options.elementSize[1] + 'px',
          textAlign: 'center',
          borderRadius: '0px 5px 5px 0px'
        }
      });

      temp.pipe(this.container);
      this.surfaces.push(temp);
    }
  }

  function ArticleContainer() {
    View.apply(this, arguments);
    this.surfaces = [];

    _createScrollContainer.call(this);
    _populateArticles.call(this);
  }

  ArticleContainer.prototype = Object.create(View.prototype);
  ArticleContainer.prototype.constructor = ArticleContainer;

  ArticleContainer.DEFAULT_OPTIONS = {
    scrollView: {
      edgePeriod: 800,
      friction: 0.5,
      drag: 0.2,
      speedLimit: 10,
      edgeDamp: 1,
      edgeGrip: 0.5
    },
    scrollSize: [320, undefined],
    scrollProperties: {
      overflow: 'hidden',
      border: '1px solid rgba(255, 255, 255, 0.8)'
    },
    elementSize: [undefined, 80]
  };

  module.exports = ArticleContainer;
});
