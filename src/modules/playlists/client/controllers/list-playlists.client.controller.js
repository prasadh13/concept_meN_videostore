(function () {
  'use strict';

  angular
    .module('playlists')
    .controller('PlaylistsListController', PlaylistsListController);

  PlaylistsListController.$inject = ['PlaylistsService'];

  function PlaylistsListController(PlaylistsService) {
    var vm = this;

    vm.playlists = PlaylistsService.query();
  }
}());
