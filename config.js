const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  rest_service_host: process.env.REST_SERVICE_HOST ? process.env.REST_SERVICE_HOST : "external-testnode.ledgit.be",
  rest_service_port: process.env.REST_SERVICE_PORT ? process.env.REST_SERVICE_PORT : 8081,
  rest_service_path: process.env.REST_SERVICE_PATH ? process.env.REST_SERVICE_PATH : "/api/channels/common/chaincodes/vil-reference-node-storage",
  user_service_host: process.env.USER_SERVICE_HOST ? process.env.USER_SERVICE_HOST : "external-testnode.ledgit.be",
  user_service_path: process.env.USER_SERVICE_PATH ? process.env.USER_SERVICE_PATH : "/users",
  user_service_port: process.env.USER_SERVICE_PORT ? process.env.USER_SERVICE_PORT : 4000,
  bc_websocket_host: process.env.BC_WEBSOCKET_HOST ? process.env.BC_WEBSOCKET_HOST : "external-testnode.ledgit.be",
  bc_websocket_port: process.env.BC_WEBSOCKET_PORT ? process.env.BC_WEBSOCKET_PORT : "8081",
};