const rsynced = require('..');
const assert = require('assert');
const {inspect} = require('util');

describe('Rsynced', () => {
  it('Should create valid command', () => {
    var rsync = rsynced.create({
      relative: process.cwd(),
      ssh: {
        pathType: 'dest',
        user: 'user',
        host: 'localhost',
      },
      dest: '/tmp',
    });

    var args = rsync.args();

    // assert.equal(args[2], '--chown=:www-data', 'chown is set');
    assert.equal(args[3], '.', 'path is set');
    // assert.equal(args[4], 'user@localhost:/tmp', 'destination is set');
  });
});
