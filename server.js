/*
* this should load a configuration file about the project
* the configuration file contains a default port for the server
*
* if another port is received as argument, it will override the default port.
* */

const createServer = require('http-server').createServer;


// const getting the port from parameters
const PORT = 8085;
const server = createServer();
server.listen(PORT);