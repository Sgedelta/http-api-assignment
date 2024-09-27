const http = require('http');
const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': responseHandler.getIndex,
  '/style.css': responseHandler.getStyle,
  '/success': responseHandler.successfulRequest,
  '/badRequest': responseHandler.badRequest,
  '/unauthorized': responseHandler.getIndex,
  '/forbidden': responseHandler.getIndex,
  '/internal': responseHandler.getIndex,
  '/notImplemented': responseHandler.getIndex,
  404: responseHandler.getIndex,
};

const onRequest = (request, response) => {
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

  request.acceptedTypes = request.headers.accept.split(',');
  request.query = Object.fromEntries(parsedUrl.searchParams);

  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response);
  } else {
    urlStruct[404](request, response);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});
