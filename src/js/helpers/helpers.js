let { api, fbImageUrl } = require('../data/data');
let socketio            = require('socket.io-client');
let $                   = require('jquery');
let _                   = require('lodash');
let socketInited        = false;

const QSEvents = {
  leftClick:  'leftclick',
  rightClick: 'rightclick'
};

module.exports = {

  /**
   * Stub for checking environment.
   * @return {Boolean} If environment is production.
   */
  isProduction: function() {
    return false;
  },

  initSocket: function() {
    if (socketInited) return null;
    if (this.isProduction()) {
      let socket = socketio(api.socket);
      socket.on(QSEvents.leftClick, function() {
        $('#left-button').click();
      });
      socket.on(QSEvents.rightClick, function() {
        $('#right-button').click();
      });
    }
  },

  getFbImageURL: function(id) {
    return `${fbImageUrl}/${id}/picture?type=square&height=180`;
  },

  getDisplayAreaEndHTML: function(data) {
    let compiled = _.template(this.endHTMLTemplate);
    return compiled({
      data: data,
      getFbImageURL: this.getFbImageURL
    });
  },

  endHTMLTemplate:
`<div id="friends-container"><% _.forEach(data, function(friend) { %><div class="friend-container" data-id="<%= friend.id %>"><img src="<%= getFbImageURL(friend.fbid) %>" class="friend-image"></img><h2 class="friend-name"><%= friend.name %></h2></div><% }); %></div>`
};
