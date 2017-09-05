const expect = require('chai').expect;
const create = require('../src/create');

const config = {
  source: '/home/lil/Desktop/dir0',
  dest: '/home/lil/Desktop/dir1',
  flags: 'dra',
};

describe('Create rsync Object', () => {
  it('using config', () => {
    var goodConfig = config;
    goodConfig.cwd = process.cwd();
    expect(create(goodConfig).command())
      .to.have.string(`rsync -dra ${goodConfig.source}`);
  });
});
