const dotenv = require('dotenv');
dotenv.config();
var test = process.env.NODE_ENV === 'test';
export const config = {
  scheme: process.env.SCHEME && !test  ? process.env.SCHEME : 'http',
  port: process.env.PORT && !test  ? process.env.PORT : 3000,
  bc_rest_api_user: process.env.BC_REST_API_USERNAME && !test  ? process.env.BC_REST_API_USERNAME : "null",
  bc_rest_api_password: process.env.BC_REST_API_PASSWORD && !test  ? process.env.BC_REST_API_PASSWORD : "null",
  rest_service_host: process.env.REST_SERVICE_HOST && !test  ? process.env.REST_SERVICE_HOST : "external-testnode.ledgit.be",
  rest_service_port: process.env.REST_SERVICE_PORT && !test  ? process.env.REST_SERVICE_PORT : 8081,
  rest_service_path: process.env.REST_SERVICE_PATH && !test  ? process.env.REST_SERVICE_PATH : "/api/channels/common/chaincodes/vil-reference-node-storage",
  user_service_host: process.env.USER_SERVICE_HOST && !test  ? process.env.USER_SERVICE_HOST : "external-testnode.ledgit.be",
  user_service_path: process.env.USER_SERVICE_PATH && !test  ? process.env.USER_SERVICE_PATH : "/users",
  user_service_port: process.env.USER_SERVICE_PORT && !test  ? process.env.USER_SERVICE_PORT : 4000,
  bc_websocket_host: process.env.BC_WEBSOCKET_HOST && !test  ? process.env.BC_WEBSOCKET_HOST : "external-testnode.ledgit.be",
  bc_websocket_port: process.env.BC_WEBSOCKET_PORT && !test  ? process.env.BC_WEBSOCKET_PORT : "8081",
};