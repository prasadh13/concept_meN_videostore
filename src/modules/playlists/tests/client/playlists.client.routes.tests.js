(function () {
  'use strict';

  describe('Playlists Route Tests', function () {
    // Initialize global variables
    var $scope,
      PlaylistsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PlaylistsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PlaylistsService = _PlaylistsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('playlists');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/playlists');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          PlaylistsController,
          mockPlaylist;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('playlists.view');
          $templateCache.put('modules/playlists/client/views/view-playlist.client.view.html', '');

          // create mock Playlist
          mockPlaylist = new PlaylistsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Playlist Name'
          });

          // Initialize Controller
          PlaylistsController = $controller('PlaylistsController as vm', {
            $scope: $scope,
            playlistResolve: mockPlaylist
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:playlistId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.playlistResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            playlistId: 1
          })).toEqual('/playlists/1');
        }));

        it('should attach an Playlist to the controller scope', function () {
          expect($scope.vm.playlist._id).toBe(mockPlaylist._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/playlists/client/views/view-playlist.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PlaylistsController,
          mockPlaylist;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('playlists.create');
          $templateCache.put('modules/playlists/client/views/form-playlist.client.view.html', '');

          // create mock Playlist
          mockPlaylist = new PlaylistsService();

          // Initialize Controller
          PlaylistsController = $controller('PlaylistsController as vm', {
            $scope: $scope,
            playlistResolve: mockPlaylist
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.playlistResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/playlists/create');
        }));

        it('should attach an Playlist to the controller scope', function () {
          expect($scope.vm.playlist._id).toBe(mockPlaylist._id);
          expect($scope.vm.playlist._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/playlists/client/views/form-playlist.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PlaylistsController,
          mockPlaylist;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('playlists.edit');
          $templateCache.put('modules/playlists/client/views/form-playlist.client.view.html', '');

          // create mock Playlist
          mockPlaylist = new PlaylistsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Playlist Name'
          });

          // Initialize Controller
          PlaylistsController = $controller('PlaylistsController as vm', {
            $scope: $scope,
            playlistResolve: mockPlaylist
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:playlistId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.playlistResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            playlistId: 1
          })).toEqual('/playlists/1/edit');
        }));

        it('should attach an Playlist to the controller scope', function () {
          expect($scope.vm.playlist._id).toBe(mockPlaylist._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/playlists/client/views/form-playlist.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
