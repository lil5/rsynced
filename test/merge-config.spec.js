const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;
chai.should();

const mergeConfig = require('../src/merge-config');

var localConfig = './example/rsynced.json';


describe('Read file', function () {
  it('with flags prop', function () {
    expect(mergeConfig.readFiles(localConfig))
      .to.eventually.have.property('flags');
  });
  it('with bad json', function() {
    expect(mergeConfig.readFiles('./test/bad.json'))
      .to.eventually.be.rejectedWith(
        'Unexpected token s in JSON at position 43'
      );
  });
  it('false path throw err', function () {
    expect(mergeConfig.readFiles('/bad/file/path.json'))
      .to.eventually.be.rejectedWith(
        'no such file or directory, open \'/bad/file/path.json\''
      );
  });
});

describe('Merge', function () {
  it('with config supiriority above defaults', function () {
    var defaults = {flags: 'dr', source: '/fee'};
    var config = {
      flags: 'adr',
      destination: '/foo',
    };
    var equal = {
      flags: 'adrz',
      source: '/fee',
      destination: '/foo',
    };

    expect(mergeConfig.merge(defaults, config))
      .to.deep.equal(equal);
  });
});

describe('Read and merge configs to one object', function () {
  it('and return an Array', function () {
    expect(mergeConfig(localConfig))
    // .to.be.an.instanceof(Object);
      .to.eventually.have.property('flags');
  });
});
