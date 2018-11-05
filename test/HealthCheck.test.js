const supertest = require('supertest')
const superagent = require('superagent')
const nocker = require('superagent-nock').default
const assert = require('assert')
const sinon = require('sinon')

const app = require('../app')

const { API_URL } = process.env

const nock = nocker(superagent)
const request = supertest(app)

const responseBodyMock = { data: [] };

describe('HealthCheck', () => {
   it('should reach service successfully and return 200', async () => {
      nock(API_URL)
         .get('/words.json/randomWord')
         .reply(200, responseBodyMock);

      return request
         .get('/healthcheck')
         .expect(200)
         .then(({ body }) => assert.deepEqual(body, responseBodyMock));
   })

   it('should return 500 if it fails to reach the service', () => {
      nock(API_URL)
         .get('/words.json/randomWord')
         .reply(404, responseBodyMock);

      return request
         .get('/healthcheck')
         .expect(500)
         .then(({ body }) => assert.deepEqual(body, {
            response: responseBodyMock,
            status: 404
         }));
   })

   describe('when making a call', () => {
      let timeoutStub;
      beforeEach(() => {
         timeoutStub = sinon.stub(superagent.Request.prototype, 'timeout');
      })

      afterEach(() => timeoutStub.restore())

      it('it should call superagent with correct timeout config', () => {
         nock(API_URL)
            .get('/words.json/randomWord')
            .reply(404, responseBodyMock);

         return request
            .get('/healthcheck')
            .expect(500)
            .then(() => assert.deepEqual(timeoutStub.args[0][0], {
               response: 5000,
               deadline: 60000
            }));
      })
   })
})
