(function () {
  'use strict';
  // Playlists controller
  angular
    .module('playlists')
    .controller('PlaylistsController', PlaylistsController);

  PlaylistsController.$inject = ['$scope', '$state', 'Authentication', '$window', 'googleService'];

  function PlaylistsController ($scope, $state, Authentication, $window, googleService) {
    var vm = this;
    var player;

    vm.authentication = Authentication;
    // vm.playlist = playlist;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    $scope.initGapi = function() {
      console.log("initgapi");
      $scope.getChannel();
    };
    /* function loadPlayerApi() {
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
    function onYouTubeIframeAPIReady() {
      console.log("creating player window");
      player = new YT.Player('player', {
        height: '390',
        width: '640',
        playerVars: {
          listType:'playlist',
          list:'PL7BE47BFB4EAA777D'
        },
        events: {
          'onReady': onPlayerReady
        }
      });
    }
    function onPlayerReady(event) {
      event.target.playVideo();
    }*/
    $scope.getChannel = function () {
      console.log("getChannel");
      googleService.googleApiClientReady()
      .then(function (data) {
        $scope.channel = data;
        console.log(data);
      }, function (error) {
        console.log('Failed: ' + error);
      });
    };
    // Remove existing Playlist
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.playlist.$remove($state.go('playlists.list'));
      }
    }
    // Save Playlist
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.playlistForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.playlist._id) {
        vm.playlist.$update(successCallback, errorCallback);
      } else {
        vm.playlist.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('playlists.view', {
          playlistId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
