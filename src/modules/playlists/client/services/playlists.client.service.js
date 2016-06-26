
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
    .factory('youtubeApiLoaderService', youtubeApiLoaderService);

  youtubeApiLoaderService.$inject = ['$http', '$q', '$window'];

  function youtubeApiLoaderService($http, $q, $window) {
    var defer = $q.defer();

    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    var loaded = false;

    $window.init = function() {
      gapi.client.load('youtube', 'v3', function() {
        gapi.client.setApiKey('AIzaSyA9cnBo_sdxDxlewKghDL55hReLOS0P3CQ');
        defer.resolve();
      });
    };
    $window.onYouTubeIframeAPIReady = function() {
      var tag2 = document.createElement('script');
      tag2.src = "https://apis.google.com/js/client.js?onload=init";
      var firstScriptTag2 = document.getElementsByTagName('script')[0];
      firstScriptTag2.parentNode.insertBefore(tag2, firstScriptTag2);
    };
    return {
      ready: defer.promise
    };
  }
}());

