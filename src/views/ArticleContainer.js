define(function(require, exports, module) {
  'use strict';
  var Surface          = require('famous/core/Surface');
  var Transform        = require('famous/core/Transform');
  var View             = require('famous/core/View');
  var Modifier         = require('famous/core/Modifier');
  var ContainerSurface = require('famous/surfaces/ContainerSurface');
  var ViewSequence     = require('famous/core/ViewSequence');
  var Scrollview       = require('famous/views/Scrollview');
  var EventHandler     = require('famous/core/EventHandler');
  var Transitionable   = require('famous/transitions/Transitionable');

  var OptionsManager   = require('famous/core/OptionsManager');

  var ArticleTab       = require('./ArticleTab');

  function _createBackground() {
    this.background = new Surface({
      size: [325, undefined],
      properties: {
        backgroundColor: '#8B0000'
      }
    });

    this.backgroundMod = new Modifier({
      transform: Transform.translate(0, 0, -1)
    });
    this._add(this.backgroundMod).add(this.background);
  }

  function _createHeader(name) {
    this.header = new Surface({
      size: [325, 50],
      content: name,
      properties: {
        backgroundColor: '#000',
        color: '#fff',
        textAlign: 'center',
        fontSize: '30px',
        paddingTop: '5px'
      }
    });

    this.headerMod = new Modifier({
      transform: Transform.translate(0, 0, 1)
    });

    this._add(this.headerMod).add(this.header);
  }

  function ArticleContainer(options) {
    View.apply(this, arguments);

    this.options = Object.create(ArticleContainer.DEFAULT_OPTIONS);
    this._optionsManager = new OptionsManager(this.options);
    if (options) this.setOptions(options);

    this.collection = options.data;

    this.container = new ContainerSurface(this.options.container);
    this.scrollview = new Scrollview(this.options.scrollview);

    this.containerMod = new Modifier({
      transform: Transform.translate(0, 50, 0)
    });

    this.articleTabs = [];
    this.viewSequence = new ViewSequence(this.articleTabs);
    this.scrollview.sequenceFrom(this.viewSequence);

    this.collection.each(function(article, i) {
      article.set('color', 'hsl(' + (i * 360 / 12) + ', 86%, 50%)');
      var temp = new ArticleTab(article, options);

      temp.pipe(this.scrollview);
      temp.pipe(this._eventInput);
      this.articleTabs.push(temp);
    }, this);

    this._eventInput.on('surfaceClick', function(model) {
      this._eventOutput.emit('surfaceClick', model);
    }.bind(this.scrollview));

    this.collection.on('remove', function(article, collection, removalData) {
        this.articleTabs[removalData.index].delete(function() {
          this.viewSequence.splice(removalData.index, 1);
        }.bind(this));
    }.bind(this));

    this.collection.on('add', function(article) {
      var temp = new ArticleTab(article, options);
      temp.transform = new Transitionable([-400, 0, 0]);
      temp.pipe(this.scrollview);
      temp.pipe(this._eventInput);
      this.articleTabs.unshift(temp);
      temp.add();
      // this.taskViews[removalData.index].delete(function() {
      //   this.viewSequence.splice(removalData.index, 1);
      // }.bind(this));
    }.bind(this));

    _createBackground.call(this);
    _createHeader.call(this, this.options.name);
    this.container.add(this.scrollview);
    this._add(this.containerMod).add(this.container);

    EventHandler.setInputHandler(this, this.scrollview);
    EventHandler.setOutputHandler(this, this.scrollview);
    this.scrollview.subscribe(this.container);
  }

  ArticleContainer.prototype = Object.create(View.prototype);
  ArticleContainer.prototype.constructor = ArticleContainer;

  ArticleContainer.DEFAULT_OPTIONS = {
    scrollview: {
      edgePeriod: 800,
      friction: 0.5,
      drag: 0.2,
      speedLimit: 10,
      edgeDamp: 1,
      edgeGrip: 0.5
    },
    container: {
      size: [320, undefined],
      properties: {
        overflow: 'hidden'
      }
    },
    backgroundPosition: [0, 0],
    start: [0, 0, 0],
    name: 'Read'
  };

  ArticleContainer.prototype.setOptions = function(options) {
    return this._optionsManager.setOptions(options);
  };

  // ArticleContainer.prototype.removeTab = function() {

  // };

  module.exports = ArticleContainer;
});
