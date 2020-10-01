const common = require("./config/webpack.config.dev.js")(); // Pay attention to the invocation.

module.exports = merge(common, {
    mode: 'production'
});