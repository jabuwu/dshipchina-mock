import 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import * as dship from '../src/dship';
const parseQuery = function(query: string, options?: dship.ParseQueryOptions) {
  return dship.parseQuery({ url: 'http://localhost/' + query } as any, options);
}

describe('dship.ts', function() {
  describe('parseQuery', function() {
    it('should return empty object if no query params', async function() {
      expect(parseQuery('')).to.eql({});
    });
    it('should ignore options with no value', async function() {
      expect(parseQuery('?a&b&C')).to.eql({});
    });
    it('should ignore parse options with value', async function() {
      expect(parseQuery('?key=abc&waybill_id=123')).to.eql({
        key: 'abc',
        waybill_id: '123'
      });
    });
    it('should parse map values', async function() {
      expect(parseQuery('?key=abc&product_id[0]=123&product_id[1]=321')).to.eql({
        key: 'abc',
        product_id: { '0': '123', '1': '321' }
      });
      expect(parseQuery('?key=abc&product_id=123&product_id[1]=321')).to.eql({
        key: 'abc',
        product_id: { '1': '321' }
      });
      expect(parseQuery('?key=abc&product_id[0]=123&product_id[1]=321')).to.eql({
        key: 'abc',
        product_id: { '0': '123', '1': '321' }
      });
      expect(parseQuery('?key=abc&product_id[abc]=123&product_id[cba]=321')).to.eql({
        key: 'abc',
        product_id: { 'abc': '123', 'cba': '321' }
      });
    });
    it('should drop map values if overridden later in the chain', async function() {
      expect(parseQuery('?key=abc&product_id[0]=123&product_id[1]=321&product_id=5')).to.eql({
        key: 'abc',
        product_id: '5'
      });
    });
    it('should force map values when specified', async function() {
      expect(parseQuery('?key=abc&product_id=123', { maps: [ 'product_id' ] })).to.eql({
        key: 'abc',
        product_id: {}
      });
      expect(parseQuery('?key=abc&product_id[0]=123&product_id=321', { maps: [ 'product_id' ] })).to.eql({
        key: 'abc',
        product_id: {}
      });
      expect(parseQuery('?key=abc&product_id=123&product_id[1]=321', { maps: [ 'product_id' ] })).to.eql({
        key: 'abc',
        product_id: { '1': '321' }
      });
    });
  });
});