/**
 * Various data for QuantifiedSelf pr0n exhibit
 */

let api = {
  host: 'http://quantifiedselfbackend.local:6060',
  path: '/pr0n_processor',
  socket: 'http://localhost:3000'
};
api.root = api.host + api.path;

module.exports = {
  api: api,
  rfid: require('query-string').parse(location.search).rfid,
  fbImageUrl: 'http://graph.facebook.com',
  login: 'http://localhost:8000'
};
