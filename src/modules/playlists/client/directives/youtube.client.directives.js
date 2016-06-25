(function () {
  'use strict';

  angular.module('playlists')
    .directive('youtube', youtube);

  youtube.$inject = ['$rootScope', '$timeout', '$interpolate', '$state', '$window', '$sce'];

  function youtube($rootScope, $timeout, $interpolate, $state, $window, $sce) {
    var directive = {
      restrict: 'E',
      scope: {
        height: "@",
        width: "@",
        videoid: "@"
      },
      templateUrl: 'modules/playlists/client/views/templates/player.html',
      link: link
    };

    return directive;
    function link(scope, element, attrs) {
      console.log("linking api");

      var tag2 = document.createElement('script');
      tag2.src = "https://apis.google.com/js/client.js?onload=init";
      var firstScriptTag2 = document.getElementsByTagName('script')[0];
      firstScriptTag2.parentNode.insertBefore(tag2, firstScriptTag2);

      var player;
      var videos = [];
      var next_token,
        prev_token;
      scope.global_list = {};
      $window.init = function() {
        console.log("init");
        gapi.client.load('youtube', 'v3', function() {
          gapi.client.setApiKey('AIzaSyA9cnBo_sdxDxlewKghDL55hReLOS0P3CQ');
          loadPlaylist();
        });
      };
      scope.video_link = function(v_id) {
        var v_link = 'https://www.youtube.com/embed/' + v_id + '?enablejsapi=1';
        return $sce.trustAsResourceUrl(v_link);
      };
      function YouTubePlayList(playlistId, videos, next_token) {
        this.videoid = playlistId;
        this.videos = videos;
        this.currently_playing = 0;
        this.nextpage = next_token;
      }
      function loadPlaylist() {
        var request = gapi.client.youtube.playlistItems.list({
          part: 'snippet, contentDetails',
          playlistId: 'PL7BE47BFB4EAA777D',
          maxResults: 2
        });
        request.execute(function(response) {
          console.log(response);
          if (response.result.nextPageToken) {
            next_token = response.result.nextPageToken;
          }
          angular.forEach(response.items, function(value, key) {
            var entry = {};
            entry.videoid = value.snippet.resourceId.videoId;
            entry.title = value.snippet.title;
            entry.img_src = value.snippet.thumbnails.default;
            videos.push(entry);
          });
          console.log(videos);
          scope.global_list[scope.videoid] = new YouTubePlayList(scope.videoid, videos, next_token);
          console.log(scope.global_list);
          scope.$apply(function() {
            scope.playlist_videos = response;
          });
        });
        console.log("loading iframe api");
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
      $window.onYouTubeIframeAPIReady = function() {
        console.log("loading player");
        player = new YT.Player("player_id_video", {
          playerVars: {
            'autoplay': 0,
            'html5': 1,
            'theme': "light",
            'modesbranding': 0,
            'color': "white",
            'iv_load_policy': 3,
            'showinfo': 1,
            'controls': 1
          },
          events: {
            'onStateChange': onPlayerStateChange
          }
        });
      };
      $window.onPlayerStateChange = function(event) {
        console.log(player.getVideoUrl());
        console.log(event.target);
      };
    }
  }
}());
