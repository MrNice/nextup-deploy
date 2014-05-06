define(function(require, exports, module) {
  var Article = require('./Article');
  var Backbone = require('backbone');

  module.exports = Backbone.Collection.extend({
    model: Article
  });
});
