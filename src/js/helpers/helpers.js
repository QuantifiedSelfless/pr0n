let { api, fbImageUrl, login } = require('../data/data');
let socketio                   = require('socket.io-client');
let $                          = require('jquery');
let template                   = require('lodash.template');
let forEach                    = require('lodash._arrayeach');
let socketInited               = false;
let processing                 = false;

const MAX_TRIES = 3;
const QSEvents = {
  leftClick:  'button1',
  rightClick: 'button2',
  RFID: 'rfid'
};
const TIMEOUT = 1000;

module.exports = {

  /**
   * Stub for checking environment.
   * @return {Boolean} bool If environment is production.
   */
  isProduction: function() {
    return true;
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

  redirectToLogin: () => window.location = login,

  fetchQSPayload: function fetchQSPayload(url, cb) {
    let counter = 0;
    let tryUrl = () => {
      let promise = $.get({
        timeout: TIMEOUT,
        url: url
      });
      promise.then(payload => {
        counter = 0;
        processing = false;
        cb(payload);
      }, err => {
        if (counter >= MAX_TRIES) this.redirectToLogin();
        counter += 1;
        console.log(err);
        setTimeout(tryUrl, Math.pow(2, counter) * 1000);
      });
    };
    if (!processing) tryUrl();
  },

  getFbImageURL: function(fbid) {
    return `${fbImageUrl}/${fbid}/picture?type=square&height=180`;
  },

  getDisplayAreaEndHTML: function(data) {
    let compiled = template(this.endHTMLTemplate);
    return compiled({
      data: data,
      getFbImageURL: this.getFbImageURL,
      forEach: forEach
    });
  },

  endHTMLTemplate:
`<div id="friends-container"><% forEach(data, function(friend) { %><div class="friend-container" data-id="<%= friend.fbid %>"><img src="<%= getFbImageURL(friend.fbid) %>" class="friend-image"></img><img src="<%= friend.url %>" class="porn-image"></img><h2 class="friend-name"><%= friend.name %></h2></div><% }); %></div>`
};
