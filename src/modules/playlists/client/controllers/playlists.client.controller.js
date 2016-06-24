(function () {
  'use strict';

  // Playlists controller
  angular
    .module('playlists')
    .controller('PlaylistsController', PlaylistsController);

  PlaylistsController.$inject = ['$scope', '$state', 'Authentication', 'playlistResolve'];

  function PlaylistsController ($scope, $state, Authentication, playlist) {
    var vm = this;

    vm.authentication = Authentication;
    vm.playlist = playlist;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

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
