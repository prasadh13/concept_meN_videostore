(function () {
  'use strict';

  angular
    .module('playlists')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('playlists', {
         url: '/playlists',
        templateUrl: 'modules/playlists/client/views/home-playlists.client.view.html',
        controller: 'PlaylistsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Playlists Home'
        }
      })
      .state('playlists.list', {
        url: '',
        templateUrl: 'modules/playlists/client/views/list-playlists.client.view.html',
        controller: 'PlaylistsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Playlists List'
        }
      })
      .state('playlists.create', {
        url: '/create',
        templateUrl: 'modules/playlists/client/views/form-playlist.client.view.html',
        controller: 'PlaylistsController',
        controllerAs: 'vm',
        resolve: {
          playlistResolve: newPlaylist
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Playlists Create'
        }
      })
      .state('playlists.edit', {
        url: '/:playlistId/edit',
        templateUrl: 'modules/playlists/client/views/form-playlist.client.view.html',
        controller: 'PlaylistsController',
        controllerAs: 'vm',
        resolve: {
          playlistResolve: getPlaylist
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Playlist {{ playlistResolve.name }}'
        }
      })
      .state('playlists.view', {
        url: '/:playlistId',
        templateUrl: 'modules/playlists/client/views/view-playlist.client.view.html',
        controller: 'PlaylistsController',
        controllerAs: 'vm',
        resolve: {
          playlistResolve: getPlaylist
        },
        data: {
          pageTitle: 'Playlist {{ articleResolve.name }}'
        }
      });
  }

  getPlaylist.$inject = ['$stateParams', 'PlaylistsService'];

  function getPlaylist($stateParams, PlaylistsService) {
    return PlaylistsService.get({
      playlistId: $stateParams.playlistId
    }).$promise;
  }

  newPlaylist.$inject = ['PlaylistsService'];

  function newPlaylist(PlaylistsService) {
    return new PlaylistsService();
  }
}());
