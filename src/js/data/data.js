/**
 * Mock data for QuantifiedSelf pr0n exhibit
 */
let api, clickHandler, eventBus, isProduction,
    _        = require('lodash'),
    $        = require('jquery'),
    $main    = $('#main'),
    socketio = require('socket.io-client');

/**
 * Fill this function in with an environment test.
 * @param {Function} cb1 Execute if production.
 * @param {Function} cb2 Execute if development.
 */
isProduction = (cb1, cb2) => {
  return cb2();
};

eventBus = isProduction(
  // Production
  () => {
    let socket = socketio(api.root);
    return socket.on.bind(socket);
  },

  // Development
  () => { return $main.on.bind($main); }
);

clickHandler = _.curry(eventBus)('click');

api = {
  host: 'http://iamadatapoint.com:6060',
  path: '/pr0n_processor'
};
api.root = api.host + api.path;

module.exports = {
  api: api,
  events: {
    click: clickHandler
  },
  userid: 'ad501648-0f86-4be3-b0a8-57df1ddc24b1'
};
