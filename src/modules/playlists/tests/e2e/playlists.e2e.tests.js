'use strict';

describe('Playlists E2E Tests:', function () {
  describe('Test Playlists page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/playlists');
      expect(element.all(by.repeater('playlist in playlists')).count()).toEqual(0);
    });
  });
});
