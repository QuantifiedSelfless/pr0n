let { api, fbImageUrl, login } = require('../data/data');
let socketio            = require('socket.io-client');
let $                   = require('jquery');
let _                   = require('lodash');
let socketInited        = false;

const QSEvents = {
  leftClick:  'button1',
  rightClick: 'button2',
  RFID: 'rfid'
};

module.exports = {

  /**
   * Stub for checking environment.
   * @return {Boolean} bool If environment is production.
   */
  isProduction: function() {
    return false;
  },

  initSocket: function() {
    if (socketInited) return null;
    if (this.isProduction()) {
      let socket = socketio(api.socket);
      socket.on(QSEvents.leftClick, () => {
        $('#left-button').click();
      });
      socket.on(QSEvents.rightClick, () => {
        $('#right-button').click();
      });
      socket.on(QSEvents.RFID, () => {
        window.location = login;
      });
    }
  },

  getFbImageURL: function(fbid) {
    return `${fbImageUrl}/${fbid}/picture?type=square&height=180`;
  },

  getDisplayAreaEndHTML: function(data) {
    let compiled = _.template(this.endHTMLTemplate);
    return compiled({
      data: data,
      getFbImageURL: this.getFbImageURL
    });
  },

  endHTMLTemplate:
`<div id="friends-container"><% _.forEach(data, function(friend) { %><div class="friend-container" data-id="<%= friend.fbid %>"><img src="<%= getFbImageURL(friend.fbid) %>" class="friend-image"></img><h2 class="friend-name"><%= friend.name %></h2></div><% }); %></div>`
};
