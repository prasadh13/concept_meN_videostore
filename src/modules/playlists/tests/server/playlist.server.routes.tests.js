'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Playlist = mongoose.model('Playlist'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  playlist;

/**
 * Playlist routes tests
 */
describe('Playlist CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Playlist
    user.save(function () {
      playlist = {
        name: 'Playlist name'
      };

      done();
    });
  });

  it('should be able to save a Playlist if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Playlist
        agent.post('/api/playlists')
          .send(playlist)
          .expect(200)
          .end(function (playlistSaveErr, playlistSaveRes) {
            // Handle Playlist save error
            if (playlistSaveErr) {
              return done(playlistSaveErr);
            }

            // Get a list of Playlists
            agent.get('/api/playlists')
              .end(function (playlistsGetErr, playlistsGetRes) {
                // Handle Playlist save error
                if (playlistsGetErr) {
                  return done(playlistsGetErr);
                }

                // Get Playlists list
                var playlists = playlistsGetRes.body;

                // Set assertions
                (playlists[0].user._id).should.equal(userId);
                (playlists[0].name).should.match('Playlist name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Playlist if not logged in', function (done) {
    agent.post('/api/playlists')
      .send(playlist)
      .expect(403)
      .end(function (playlistSaveErr, playlistSaveRes) {
        // Call the assertion callback
        done(playlistSaveErr);
      });
  });

  it('should not be able to save an Playlist if no name is provided', function (done) {
    // Invalidate name field
    playlist.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Playlist
        agent.post('/api/playlists')
          .send(playlist)
          .expect(400)
          .end(function (playlistSaveErr, playlistSaveRes) {
            // Set message assertion
            (playlistSaveRes.body.message).should.match('Please fill Playlist name');

            // Handle Playlist save error
            done(playlistSaveErr);
          });
      });
  });

  it('should be able to update an Playlist if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Playlist
        agent.post('/api/playlists')
          .send(playlist)
          .expect(200)
          .end(function (playlistSaveErr, playlistSaveRes) {
            // Handle Playlist save error
            if (playlistSaveErr) {
              return done(playlistSaveErr);
            }

            // Update Playlist name
            playlist.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Playlist
            agent.put('/api/playlists/' + playlistSaveRes.body._id)
              .send(playlist)
              .expect(200)
              .end(function (playlistUpdateErr, playlistUpdateRes) {
                // Handle Playlist update error
                if (playlistUpdateErr) {
                  return done(playlistUpdateErr);
                }

                // Set assertions
                (playlistUpdateRes.body._id).should.equal(playlistSaveRes.body._id);
                (playlistUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Playlists if not signed in', function (done) {
    // Create new Playlist model instance
    var playlistObj = new Playlist(playlist);

    // Save the playlist
    playlistObj.save(function () {
      // Request Playlists
      request(app).get('/api/playlists')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Playlist if not signed in', function (done) {
    // Create new Playlist model instance
    var playlistObj = new Playlist(playlist);

    // Save the Playlist
    playlistObj.save(function () {
      request(app).get('/api/playlists/' + playlistObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', playlist.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Playlist with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/playlists/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Playlist is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Playlist which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Playlist
    request(app).get('/api/playlists/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Playlist with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Playlist if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Playlist
        agent.post('/api/playlists')
          .send(playlist)
          .expect(200)
          .end(function (playlistSaveErr, playlistSaveRes) {
            // Handle Playlist save error
            if (playlistSaveErr) {
              return done(playlistSaveErr);
            }

            // Delete an existing Playlist
            agent.delete('/api/playlists/' + playlistSaveRes.body._id)
              .send(playlist)
              .expect(200)
              .end(function (playlistDeleteErr, playlistDeleteRes) {
                // Handle playlist error error
                if (playlistDeleteErr) {
                  return done(playlistDeleteErr);
                }

                // Set assertions
                (playlistDeleteRes.body._id).should.equal(playlistSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Playlist if not signed in', function (done) {
    // Set Playlist user
    playlist.user = user;

    // Create new Playlist model instance
    var playlistObj = new Playlist(playlist);

    // Save the Playlist
    playlistObj.save(function () {
      // Try deleting Playlist
      request(app).delete('/api/playlists/' + playlistObj._id)
        .expect(403)
        .end(function (playlistDeleteErr, playlistDeleteRes) {
          // Set message assertion
          (playlistDeleteRes.body.message).should.match('User is not authorized');

          // Handle Playlist error error
          done(playlistDeleteErr);
        });

    });
  });

  it('should be able to get a single Playlist that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Playlist
          agent.post('/api/playlists')
            .send(playlist)
            .expect(200)
            .end(function (playlistSaveErr, playlistSaveRes) {
              // Handle Playlist save error
              if (playlistSaveErr) {
                return done(playlistSaveErr);
              }

              // Set assertions on new Playlist
              (playlistSaveRes.body.name).should.equal(playlist.name);
              should.exist(playlistSaveRes.body.user);
              should.equal(playlistSaveRes.body.user._id, orphanId);

              // force the Playlist to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Playlist
                    agent.get('/api/playlists/' + playlistSaveRes.body._id)
                      .expect(200)
                      .end(function (playlistInfoErr, playlistInfoRes) {
                        // Handle Playlist error
                        if (playlistInfoErr) {
                          return done(playlistInfoErr);
                        }

                        // Set assertions
                        (playlistInfoRes.body._id).should.equal(playlistSaveRes.body._id);
                        (playlistInfoRes.body.name).should.equal(playlist.name);
                        should.equal(playlistInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Playlist.remove().exec(done);
    });
  });
});
