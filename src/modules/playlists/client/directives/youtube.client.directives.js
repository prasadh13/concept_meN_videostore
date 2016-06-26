/* eslint no-loop-func:0*/
(function () {
  'use strict';

  angular.module('playlists')
    .directive('youtube', youtube);

  youtube.$inject = ['$rootScope', '$timeout', '$interpolate', '$state', '$window', '$sce', 'youtubeApiLoaderService'];

  function youtube($rootScope, $timeout, $interpolate, $state, $window, $sce, youtubeApiLoaderService) {
    var directive = {
      restrict: 'E',
      scope: {
        height: "@",
        width: "@",
        videoid: "@",
        playNextVideo: "&",
        playPreviousVideo: "&",
        click: "&"
      },
      templateUrl: 'modules/playlists/client/views/templates/player.html',
      link: link
    };

    return directive;
    function link(scope, element, attrs) {
      var player;
      var videos = [];
      var next_token,
        prev_token,
        request;
      scope.playlist_response = [];
      scope.global_list = {};
      scope.previousButton = true;
      scope.nextButton = false;
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
      function loadPlaylist(next_token, counter, playlist_response) {
        if (typeof next_token !== 'undefined') {
          request = gapi.client.youtube.playlistItems.list({
            part: 'snippet, contentDetails',
            playlistId: 'PL7BE47BFB4EAA777D',
            maxResults: 50,
            pageToken: next_token
          });
        } else {
          request = gapi.client.youtube.playlistItems.list({
            part: 'snippet, contentDetails',
            playlistId: 'PL7BE47BFB4EAA777D',
            maxResults: 50
          });
        }
        request.execute(function(response) {
          console.log(response.items);
          console.log(response.result.nextPageToken);
          scope.playlist_response = scope.playlist_response.concat(response.items);
          next_token = response.result.nextPageToken;
          if (typeof response.result.nextPageToken !== 'undefined') {
            counter++;
            loadPlaylist(response.result.nextPageToken, counter, scope.playlist_response);
          } else {
            console.log(scope.playlist_response);
            angular.forEach(scope.playlist_response, function(value, key) {
              var entry = {};
              entry.videoid = value.snippet.resourceId.videoId;
              entry.title = value.snippet.title;
              entry.img_src = value.snippet.thumbnails.default;
              videos.push(entry);
            });
            scope.global_list[scope.videoid] = new YouTubePlayList(scope.videoid, videos, next_token);
            console.log(scope.global_list);
            scope.$apply(function() {
              scope.playlist_videos = scope.playlist_response;
            });
          }
        });
      }
      youtubeApiLoaderService.ready.then(function() {
        player = new YT.Player("player_id", {
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
            'onReady': function(event) {
              console.log(player);
            },
            'onStateChange': function(event) {
              scope.onPlayerStateChange(event);
            }
          }
        });
        loadPlaylist();
      });
      scope.onPlayerStateChange = function(event) {
        if (event.data === 0 && scope.global_list[scope.videoid].currently_playing < scope.global_list[scope.videoid].videos.length) {
          loadNextVideo(scope.videoid);
        }
      };
      scope.click = function(videoid) {
        alert(videoid);
      };
      function loadNextVideo(playlistId) {
        if (scope.global_list[playlistId].currently_playing < scope.global_list[playlistId].videos.length - 1) {
          scope.global_list[playlistId].currently_playing++;
          console.log(scope.global_list[playlistId].currently_playing);
          loadVideoToPlayer(scope.global_list[playlistId].videos[scope.global_list[playlistId].currently_playing].videoid);
        }
      }
      scope.playNextVideo = function() {
        if (scope.global_list[scope.videoid].currently_playing < scope.global_list[scope.videoid].videos.length - 1) {
          scope.global_list[scope.videoid].currently_playing++;
          console.log(scope.global_list[scope.videoid].currently_playing);
          loadVideoToPlayer(scope.global_list[scope.videoid].videos[scope.global_list[scope.videoid].currently_playing].videoid);
        }
      };
      scope.playPreviousVideo = function() {
        if (scope.global_list[scope.videoid].currently_playing <= scope.global_list[scope.videoid].videos.length - 1) {
          scope.global_list[scope.videoid].currently_playing--;
          console.log(scope.global_list[scope.videoid].currently_playing);
          loadVideoToPlayer(scope.global_list[scope.videoid].videos[scope.global_list[scope.videoid].currently_playing].videoid);
        }
      };
      function loadVideoToPlayer(videoid) {
        if (scope.global_list[scope.videoid].currently_playing === scope.global_list[scope.videoid].videos.length - 1) {
          console.log("end of array");
          scope.nextButton = true;
          scope.previousButton = false;
        } else if (scope.global_list[scope.videoid].currently_playing === 0) {
          console.log("beginning of array");
          scope.nextButton = false;
          scope.previousButton = true;
        } else {
          scope.previousButton = false;
          scope.nextButton = false;
        }
        player.loadVideoById(videoid, 0, "default");
      }
    }
  }
}());
