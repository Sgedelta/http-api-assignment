const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);

// generic response, not JSON specifically.
const respond = (request, response, status, content, type) => {
  response.writeHead(status, {
    'Content-Type': type,
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });

  if (request.method !== 'HEAD' && status !== 204) {
    response.write(content);
  }

  response.end();
};

// gets the index page
const getIndex = (request, response) => {
  respond(request, response, 200, index, 'text/html');
};
module.exports.getIndex = getIndex;

// loads and returns the css for the page
const getStyle = (request, response) => {
  respond(request, response, 200, fs.readFileSync(`${__dirname}/../client/style.css`), 'text/css');
};
module.exports.getStyle = getStyle;

// returns a successful response of the accepted type, defaults to JSON
const successfulRequest = (request, response) => {
  const responseJSON = {
    message: 'Successful Response!',
  };

  if (request.acceptedTypes[0] === 'text/xml') {
    let responseXML = '<response>';
    responseXML = `${responseXML} <message>${responseJSON.message}</message>`;
    responseXML = `${responseXML} </response>`;

    // return the xml we just made
    return respond(request, response, 200, responseXML, 'text/xml');
  }

  const responseString = JSON.stringify(responseJSON);

  // return response passing json and content type
  return respond(request, response, 200, responseString, 'application/json');
};
module.exports.successfulRequest = successfulRequest;

const badRequest = (request, response) => {
  const responseJSON = {
    message: 'This request has the required parameters',
  };
  let status = 200;

  // if the request is not valid, make the response invalid
  if (!request.query.valid || request.query.valid !== 'true') {
    responseJSON.message = 'Missing valid query parameter set to true';
    responseJSON.id = 'badRequest';
    status = 400;
  }

  // respond block, seeing if they ask for xml, and otherwise returning JSON
  if (request.acceptedTypes[0] === 'text/xml') {
    let responseXML = '<response>';
    responseXML = `${responseXML} <message>${responseJSON.message}</message>`;
    switch (status) {
      case 400:
        responseXML = `${responseXML} <id>badRequest</id>`;
        break;
      default:
        responseXML = `${responseXML}`;
        break;
    }
    responseXML = `${responseXML} </response>`;

    // return the xml we just made
    return respond(request, response, status, responseXML, 'text/xml');
  }

  const responseString = JSON.stringify(responseJSON);

  // return response passing json and content type
  return respond(request, response, status, responseString, 'application/json');
};
module.exports.badRequest = badRequest;

const unauthorized = (request, response) => {
  const responseJSON = {
    message: 'This request has the required parameters',
  };
  let status = 200;

  // if the request is not valid, make the response invalid
  if (request.query.loggedIn !== 'yes') {
    responseJSON.message = 'Missing loggedIn query parameter set to yes';
    responseJSON.id = 'unauthorized';
    status = 401;
  }

  // respond block, seeing if they ask for xml, and otherwise returning JSON
  if (request.acceptedTypes[0] === 'text/xml') {
    let responseXML = '<response>';
    responseXML = `${responseXML} <message>${responseJSON.message}</message>`;
    switch (status) {
      case 401:
        responseXML = `${responseXML} <id>unauthorized</id>`;
        break;
      default:
        responseXML = `${responseXML}`;
        break;
    }
    responseXML = `${responseXML} </response>`;

    // return the xml we just made
    return respond(request, response, status, responseXML, 'text/xml');
  }

  const responseString = JSON.stringify(responseJSON);

  // return response passing json and content type
  return respond(request, response, status, responseString, 'application/json');
};
module.exports.unauthorized = unauthorized;

const forbidden = (request, response) => {
  const responseJSON = {
    message: 'Forbidden Page!',
  };

  if (request.acceptedTypes[0] === 'text/xml') {
    let responseXML = '<response>';
    responseXML = `${responseXML} <message>${responseJSON.message}</message>`;
    responseXML = `${responseXML} </response>`;

    // return the xml we just made
    return respond(request, response, 403, responseXML, 'text/xml');
  }

  const responseString = JSON.stringify(responseJSON);

  // return response passing json and content type
  return respond(request, response, 403, responseString, 'application/json');
};
module.exports.forbidden = forbidden;

const internal = (request, response) => {
  const responseJSON = {
    message: 'Internal Page',
  };

  if (request.acceptedTypes[0] === 'text/xml') {
    let responseXML = '<response>';
    responseXML = `${responseXML} <message>${responseJSON.message}</message>`;
    responseXML = `${responseXML} </response>`;

    // return the xml we just made
    return respond(request, response, 500, responseXML, 'text/xml');
  }

  const responseString = JSON.stringify(responseJSON);

  // return response passing json and content type
  return respond(request, response, 500, responseString, 'application/json');
};
module.exports.internal = internal;

const notImplemented = (request, response) => {
  const responseJSON = {
    message: 'Page Not Implemented!',
  };

  if (request.acceptedTypes[0] === 'text/xml') {
    let responseXML = '<response>';
    responseXML = `${responseXML} <message>${responseJSON.message}</message>`;
    responseXML = `${responseXML} </response>`;

    // return the xml we just made
    return respond(request, response, 501, responseXML, 'text/xml');
  }

  const responseString = JSON.stringify(responseJSON);

  // return response passing json and content type
  return respond(request, response, 501, responseString, 'application/json');
};
module.exports.notImplemented = notImplemented;

const notFound = (request, response) => {
  const responseJSON = {
    message: 'Page Not Found!',
  };

  if (request.acceptedTypes[0] === 'text/xml') {
    let responseXML = '<response>';
    responseXML = `${responseXML} <message>${responseJSON.message}</message>`;
    responseXML = `${responseXML} </response>`;

    // return the xml we just made
    return respond(request, response, 404, responseXML, 'text/xml');
  }

  const responseString = JSON.stringify(responseJSON);

  // return response passing json and content type
  return respond(request, response, 404, responseString, 'application/json');
};
module.exports.notFound = notFound;
