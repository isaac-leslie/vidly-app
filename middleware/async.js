// Factory function for try/catch blocks
module.exports = function asyncMiddleware(handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res);
        }
        catch(ex) {
            next(ex);
        }
    }
}