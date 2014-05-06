define(function(require, exports, module) {
  var defaultArticles = require('./dummyData').exports;
  var Articles        = require('./Articles');
  var Backbone        = require('backbone');

  // console.log(Backbone.Collection.extend().subcollection)

  module.exports = Backbone.Model.extend({
    initialize: function() {
      // TODO : HOOK THIS UP TO THE SERVER :D
      // this.set('articles', new Articles(this.fetch()));
      this.set('articles', new Articles(defaultArticles));
      this.get('articles').first().set('read', true); // Place one thing in the start
      this.set('nextup', new Articles(this.get('articles')
                                          .filter(function(article) {
        return !article.get('read');
      })));
      this.set('read', new Articles(this.get('articles')
                                          .filter(function(article) {
        return article.get('read');
      })));
    },
    fetch: function() {
    },
    setSubCollections: function() {
      this.set('nextup', new Articles(this.get('articles')
                                          .filter(function(article) {
        return !article.get('read');
      })));
      this.set('read', new Articles(this.get('articles')
                                          .filter(function(article) {
        return article.get('read');
      })));
    }
  });
});
