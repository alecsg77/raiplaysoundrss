// Mock implementation that delegates to the real node-fetch for nock compatibility
const fetch = require('node-fetch');

module.exports = fetch;
module.exports.default = fetch;
