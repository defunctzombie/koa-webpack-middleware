const hotMiddleware = require('webpack-hot-middleware');
const PassThrough = require('stream').PassThrough;

module.exports = (compiler, opts) => {
  const expressMiddleware = hotMiddleware(compiler, opts)
  return function(ctx, next) {
    const stream = new PassThrough()
    return expressMiddleware(ctx.req, {
      write: stream.write.bind(stream),
      writeHead: (state, headers) => {
        ctx.body = stream
        ctx.state = state
        ctx.set(headers)
      }
    }, next)
  }
}
