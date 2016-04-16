let { api, fbImageUrl } = require('../data/data');
let socketio            = require('socket.io-client');
let $                   = require('jquery');
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
    return true;
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

  getFbImageTagFromID: function(id) {
    let url = `${fbImageUrl}/${id}/picture?type=square&height=300`;
    return $('<img>').attr('src', url);
  }
};
