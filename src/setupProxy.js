var proxy = require('http-proxy-middleware');
const LOG_LEVEL = 'debug';

module.exports = function(app) {
    // PartKeepr APIs
    app.use('/api',
            proxy({
                target : 'http://192.168.1.85',
                changeOrigin : true,
                logLevel : LOG_LEVEL
            }));
    // barcode generator
    app.use('/pdf',
            proxy({
                target : 'http://localhost:8081',
                changeOrigin : true,
                logLevel : LOG_LEVEL
            }));
    // internal part number generator
    app.use('/ipn',
            proxy({
                target : 'http://localhost:8082',
                changeOrigin : true,
                logLevel : LOG_LEVEL
            }));
    app.listen(3000);
}
