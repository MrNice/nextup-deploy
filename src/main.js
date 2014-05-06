/*globals define*/
define(function(require) {
    'use strict';
    // import dependencies
    var Engine    = require('famous/core/Engine');
    var App       = require('./models/App');
    var AppView   = require('./views/AppView');

    var appView = new AppView(new App());
    var mainContext = Engine.createContext();

    mainContext.add(appView);
});
