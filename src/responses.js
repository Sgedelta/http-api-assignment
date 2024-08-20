const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);

//generic response, not JSON specifically. 
const respond = (request, response, status, content, type) => {
    response.writeHead(status, {
        'Content-Type': type,
        'Content-Length': Buffer.byteLength(content, 'utf8'),
      });

      if(request.method !== 'HEAD' && status !== 204) {
        response.write(content);
      }
      
      response.end();  
};

//gets the index page
const getIndex = (request, response) => {
    respond(request, response, 200, index, 'text/html');
}
module.exports.getIndex = getIndex;

//loads and returns the css for the page
const getStyle = (request, response) => {
    respond(request, response, 200, fs.readFileSync(`${__dirname}/../client/style.css`), 'text/css');
}
module.exports.getStyle = getStyle;

//returns a successful response of the accepted type, defaults to JSON
const successfulRequest = (request, response) => {
    const responseJSON = {
        message: 'Successful Response!',
    }

    if (request.acceptedTypes[0] === 'text/xml') {
        let responseXML = '<response>';
        responseXML = `${responseXML} <name>${responseJSON.name}</name>`;
        responseXML = `${responseXML} <age>${responseJSON.age}</age>`;
        responseXML = `${responseXML} </response>`;
    
        //return the xml we just made
        return respond(request, responseJSON, responseXML, 'text/xml');
      }
      
    const responseString = JSON.stringify(responseJSON);
    
    // return response passing json and content type
    return respond(request, response, 200, responseString, 'application/json');

}
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

    //respond block, seeing if they ask for xml, and otherwise returning JSON
    if (request.acceptedTypes[0] === 'text/xml') {
        let responseXML = '<response>';
        responseXML = `${responseXML} <name>${responseJSON.name}</name>`;
        responseXML = `${responseXML} <age>${responseJSON.age}</age>`;
        responseXML = `${responseXML} </response>`;
    
        //return the xml we just made
        return respond(request, responseJSON, responseXML, 'text/xml');
    }
      
    const responseString = JSON.stringify(responseJSON);
    
    // return response passing json and content type
    return respond(request, response, status, responseString, 'application/json');

  };
module.exports.badRequest = badRequest;
  
  