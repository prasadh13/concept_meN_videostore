
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

  angular
    .module('playlists')
    .service('googleService', googleService);

  googleService.$inject = ['$http', '$q'];

  function googleService($http, $q) {
    var deferred = $q.defer();
    this.googleApiClientReady = function () {
      console.log("googleApiClientReady");
      if (typeof gapi.client == undefined) {
        setTimeout({}, 3000);
      }
      gapi.client.setApiKey('AIzaSyA9cnBo_sdxDxlewKghDL55hReLOS0P3CQ');
      gapi.client.load('youtube', 'v3', function() {
        var request = gapi.client.youtube.playlistItems.list({
          part: 'snippet',
          playlistId: 'PL7BE47BFB4EAA777D',
          maxResults: 8
        });
        request.execute(function(response) {
          deferred.resolve(response.result);
        });
      });
      return deferred.promise;
    };
  }
}());

