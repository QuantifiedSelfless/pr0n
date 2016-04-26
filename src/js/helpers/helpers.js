/*eslint no-console: "off"*/ 
let { api, fbImageUrl, login, env } = require('../data/data');
let $                               = require('jquery');
let forEach                         = require('lodash._arrayeach');
let socketio                        = require('socket.io-client');
let template                        = require('lodash.template');
let socketInited                    = false;
let processing                      = false;

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
  isProduction: function(cb) {
    env(data => {
      if (data.env === 'production') {
        cb();
      }
    });
  },

  initSocket: function() {
    if (socketInited) return null;
    this.isProduction(() => {
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
    });
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
    `<h2 class="end-heading">Based on your preferences, DesignCraft Algorithms recommends the following from your friends network to ignite your lusts!</h2><div id="matches-container"><% forEach(data, function(friend) { %><div class="match-container" data-id="<%= friend.fbid %>"><div class="friend-container"><p class="friend-name"><%= friend.name %></p><div style="background-image: url(<%= getFbImageURL(friend.fbid) %>);" class="friend-image"></div></div><div class="porn-image-container"><div style="background-image: url(<%= friend.url %>);" class="porn-image"></div></div></div><% }); %></div>`
};
