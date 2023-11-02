'use strict';

module.exports.hello = async function(event) {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(
      {
        message: 'Your function executed successfully!',
        params: event.queryStringParameters,
        secret: process.env.A_VARIABLE
      },
      null,
      2
    ),
  };
};

