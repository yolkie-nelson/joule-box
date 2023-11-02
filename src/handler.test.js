'use strict';

const mod = require('./handler');

const jestPlugin = require('serverless-jest-plugin');
const lambdaWrapper = jestPlugin.lambdaWrapper;
const wrapped = lambdaWrapper.wrap(mod, { handler: 'hello' });

describe('hello', () => {
  it('returns parameters in the body', () => {
    return wrapped.run({queryStringParameters: { a: 'b'}}).then((response) => {
      expect(response.statusCode).toEqual(200);
      expect(JSON.parse(response.body).message).toEqual("Your function executed successfully!")
      expect(JSON.parse(response.body).params).toEqual({"a": "b"})
    });
  });

  it('references an environment variable', ()=> {
    let originalEnv = process.env.A_VARIABLE
    process.env.A_VARIABLE = 'Test'
    return wrapped.run({}).then((response) => {
      expect(JSON.parse(response.body).secret).toEqual("Test")
    })
  })
});
