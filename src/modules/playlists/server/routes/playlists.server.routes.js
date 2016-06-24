'use strict';

/**
 * Module dependencies
 */
var playlistsPolicy = require('../policies/playlists.server.policy'),
  playlists = require('../controllers/playlists.server.controller');

module.exports = function(app) {
  // Playlists Routes
  app.route('/api/playlists').all(playlistsPolicy.isAllowed)
    .get(playlists.list)
    .post(playlists.create);

  app.route('/api/playlists/:playlistId').all(playlistsPolicy.isAllowed)
    .get(playlists.read)
    .put(playlists.update)
    .delete(playlists.delete);

  // Finish by binding the Playlist middleware
  app.param('playlistId', playlists.playlistByID);
};
