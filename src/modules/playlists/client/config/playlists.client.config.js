(function () {
  'use strict';

  angular
    .module('playlists')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Playlists',
      state: 'playlists'
      /*
      type: 'dropdown',
      roles: ['*']*/
    });

    // Add the dropdown list item
    /*
    menuService.addSubMenuItem('topbar', 'playlists', {
      title: 'List Playlists',
      state: 'playlists.list'
    });*/

    // Add the dropdown create item
    /*
    menuService.addSubMenuItem('topbar', 'playlists', {
      title: 'Create Playlist',
      state: 'playlists.create',
      roles: ['user']
    });*/
  }
}());
