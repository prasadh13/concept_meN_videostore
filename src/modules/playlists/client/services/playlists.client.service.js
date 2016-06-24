// Playlists service used to communicate Playlists REST endpoints
(function () {
  'use strict';

  angular
    .module('playlists')
    .factory('PlaylistsService', PlaylistsService);

  PlaylistsService.$inject = ['$resource'];

  function PlaylistsService($resource) {
    return $resource('api/playlists/:playlistId', {
      playlistId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

