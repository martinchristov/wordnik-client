const supertest = require('supertest')
const superagent = require('superagent')
const nocker = require('superagent-nock').default
const assert = require('assert')
const sinon = require('sinon')
const app = require('../app')

const { API_URL } = process.env

const nock = nocker(superagent)
const request = supertest(app)

const responseBodyMock = [{ sourceDictionary: 'wikitionary' }];

describe('FetchWord', () => {
   it('should fetch word definitions', async () => {
      nock(API_URL)
         .get('/word.json/alumni/definitions')
         .reply(200, responseBodyMock);

      return request
         .get('/word/alumni')
         .expect(200)
         .then(({ body }) => assert.deepEqual(body, responseBodyMock));
   })
   it('should return 404', async () => {
      nock(API_URL)
         .get('/word.json/non-existing-word/definitions')
         .reply(200, [])
      return request
         .get('/word/non-existing-word')
         .expect(404)
   })
})

describe('when making a call', () => {
   let timeoutStub;
   beforeEach(() => {
      timeoutStub = sinon.stub(superagent.Request.prototype, 'timeout');
   })

   afterEach(() => timeoutStub.restore())

   it('should return 404', () => {
      nock(API_URL)
         .get('/word.json/non-existing-word/definitions')
         .reply(200, [])
      return request
         .get('/word/non-existing-word')
         .expect(500)
         .then(() => assert.deepEqual(timeoutStub.args[0][0], {
            response: 5000,
            deadline: 60000
         }))
   })
})
