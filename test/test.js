const match = require('../index');
const assert = require('assert');

function runTestCases(tests) {
  for (let test of tests) {
    for (let matchString of test.matchStrings) {
      assert(match(test.pattern, matchString), `Expect ${matchString} to match ${test.pattern}`);
    }
    for (let failString of test.failStrings) {
      assert(!match(test.pattern, failString), `Expect ${failString} not to match ${test.pattern}`);
    }
  }
}

describe('Pattern match', () => {
  
  describe('exact match', () => {
    const testCases = [
      {
        pattern: '/user/1234',
        matchStrings: [
          '/user/1234'
        ],
        failStrings: [
          '*',
          '/user',
          '/user/5678'
        ]
      }
    ];

    it('should return correct match results', () => {
      runTestCases(testCases);
    });
  });

  describe('component extraction', () => {
    const pattern = '/user/:uid/client/:cid/*';
    const url = '/user/386a6ee1-4f25-44c7-97eb-d7e71b805cfe/client/abcde/application';

    it('should return correct components', () => {
      const components = match(pattern, url);
      assert.equal(components.uid, '386a6ee1-4f25-44c7-97eb-d7e71b805cfe');
      assert.equal(components.cid, 'abcde');
      assert(!!components._);
    });
  });

  describe('single component', () => {
    const testCases = [
      {
        pattern: '/user/:uid/*',
        matchStrings: [
          '/user/123/clients'
        ],
        failStrings: [
          '/user/123',
          '/user/abc/',
          '/user/123/client/abcd'
        ]
      }, 
      {
        pattern: '/user/:uid',
        matchStrings: [
          '/user/12345',
          '/user/12345/'
        ],
        failStrings: [
          '/user',
          '/user/',
          '/user/12345/clients'
        ]
      }
    ];

    it('should return correct match results', () => {
      runTestCases(testCases);
    });
  });

  describe('multiple components', () => {
    const testCases = [
      {
        pattern: '/user/:uid/client/:cid',
        matchStrings: [
          '/user/123/client/abcde'
        ],
        failStrings: [
          '/user/123/client',
          '/user/123/client/abcde/application',
          '/user/client/abcde'
        ]
      },
      {
        pattern: '/user/:uid/client/:cid/*',
        matchStrings: [
          '/user/123/client/abcde/application'
        ],
        failStrings: [
          '/user/123/client/abcde',
          '/user/123/client/abcde/',
          '/user/123/client/abcde/application/foo',
        ]
      },
      {
        pattern: '/user/:uid/client/:cid/application/:aid',
        matchStrings: [
          '/user/123/client/abcde/application/foo'
        ],
        failStrings: [
          '/user/123/client/abcde/application',
          '/user/123/client/abcde/application/foo/bar',
        ]
      }
    ];

    it('should return correct match results', () => {
      runTestCases(testCases);
    });
  });

  describe('double starts **', () => {
    const testCases = [
      {
        pattern: '/user/:uid/**',
        matchStrings: [
          '/user/123/clients',
          '/user/123/clients/abcde',
          '/user/123/application',
          '/user/123/application/foo/bar'
        ],
        failStrings: [
          '/user/123',
          '/user/123/'
        ]
      }
    ];

    it('should return correct match results', () => {
      runTestCases(testCases);
    });
  });

});