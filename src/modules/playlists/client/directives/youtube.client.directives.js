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
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      var tag2 = document.createElement('script');
      tag2.src = "https://apis.google.com/js/client.js?onload=init";
      var firstScriptTag2 = document.getElementsByTagName('script')[0];
      firstScriptTag2.parentNode.insertBefore(tag2, firstScriptTag2);

      var player;
      $window.init = function() {
        console.log("init");
        gapi.client.load('youtube', 'v3', function() {
          gapi.client.setApiKey('AIzaSyA9cnBo_sdxDxlewKghDL55hReLOS0P3CQ');
          loadPlaylist();
        });
      };
      scope.video_link = function(v_id) {
        var v_link = 'https://www.youtube.com/v/' + v_id;
        return $sce.trustAsResourceUrl(v_link);
      };
      function loadPlaylist() {
        var request = gapi.client.youtube.playlistItems.list({
          part: 'snippet, contentDetails',
          playlistId: 'PL7BE47BFB4EAA777D',
          maxResults: 2
        });
        request.execute(function(response) {
          scope.$apply(function() {
            console.log(response);
            scope.playlist_videos = response;
          });
        });
      }
      /* $window.onYouTubeIframeAPIReady = function() {
        console.log("loading player");
        player = new YT.Player(element.children()[0], {
          playerVars: {
            autoplay: 0,
            html5: 1,
            theme: "light",
            modesbranding: 0,
            color: "white",
            iv_load_policy: 3,
            showinfo: 1,
            controls: 1,
            listType: 'playlist',
            list: scope.videoid
          },
          height: scope.height,
          width: scope.width
        });
      };*/
    }
  }
}());
