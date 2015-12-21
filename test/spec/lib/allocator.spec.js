import { expect } from 'chai';

import Allocator from '../../../src/lib/allocator';

describe('Allocator', () => {
  let metadata;
  let data;
  let allocator;

  beforeEach(() => {
    metadata = new Buffer(200);
    data = new Buffer(200);
    allocator = new Allocator(metadata, data);
  });

  it('should work', () => {
    const x = { key: 'X', port: 1, mask: 1 };
    const y = { key: 'Y', port: 2, mask: 2 };
    allocator.enable(x);
    allocator.resize(x, 5);
    allocator.enable(y);
    allocator.resize(y, 5);
    expect(allocator.buffer(x)).to.be.an.instanceof(Buffer);
    allocator.buffer(x).write('hello');
    allocator.buffer(y).write('world');
    expect(allocator.buffer(x).toString('utf8', 0, 5)).to.equal('hello');
    expect(allocator.buffer(y).toString('utf8', 0, 5)).to.equal('world');
    allocator.swap();
    expect(allocator.buffer(x).toString('utf8', 0, 5)).to.not.equal('hello');
    allocator.swap();
    expect(allocator.buffer(x).toString('utf8', 0, 5)).to.equal('hello');
  });
});
