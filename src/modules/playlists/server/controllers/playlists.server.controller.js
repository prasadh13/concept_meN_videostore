'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Playlist = mongoose.model('Playlist'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Playlist
 */
exports.create = function(req, res) {
  var playlist = new Playlist(req.body);
  playlist.user = req.user;

  playlist.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(playlist);
    }
  });
};

/**
 * Show the current Playlist
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var playlist = req.playlist ? req.playlist.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  playlist.isCurrentUserOwner = req.user && playlist.user && playlist.user._id.toString() === req.user._id.toString();

  res.jsonp(playlist);
};

/**
 * Update a Playlist
 */
exports.update = function(req, res) {
  var playlist = req.playlist;

  playlist = _.extend(playlist, req.body);

  playlist.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(playlist);
    }
  });
};

/**
 * Delete an Playlist
 */
exports.delete = function(req, res) {
  var playlist = req.playlist;

  playlist.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(playlist);
    }
  });
};

/**
 * List of Playlists
 */
exports.list = function(req, res) {
  Playlist.find().sort('-created').populate('user', 'displayName').exec(function(err, playlists) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(playlists);
    }
  });
};

/**
 * Playlist middleware
 */
exports.playlistByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Playlist is invalid'
    });
  }

  Playlist.findById(id).populate('user', 'displayName').exec(function (err, playlist) {
    if (err) {
      return next(err);
    } else if (!playlist) {
      return res.status(404).send({
        message: 'No Playlist with that identifier has been found'
      });
    }
    req.playlist = playlist;
    next();
  });
};
