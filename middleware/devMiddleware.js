import devMiddleware from 'webpack-dev-middleware'

export default (compiler, opts) => {
  const expressMiddleware = devMiddleware(compiler, opts)
  return async (ctx, next) => { // eslint-disable-line
    await new Promise((resolve, reject) => {
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
