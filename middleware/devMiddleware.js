const devMiddleware = require('webpack-dev-middleware');

module.exports = (compiler, opts) => {
  const expressMiddleware = devMiddleware(compiler, opts)
  return (ctx, next) => {
    return new Promise((resolve, reject) => {
      const nextShim = function(err) {
        if (err) {
          reject(err)
          return
        }

        resolve(next())
      }

      expressMiddleware(ctx.req, {
        end: (content) => {
          ctx.body = content
          resolve();
        },
        setHeader: ctx.set.bind(ctx)
      }, nextShim)
    });
  }
}
