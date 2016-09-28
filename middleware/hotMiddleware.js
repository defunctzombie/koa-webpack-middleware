import hotMiddleware from 'webpack-hot-middleware'
import { PassThrough } from 'stream'

export default (compiler, opts) => {
  const expressMiddleware = hotMiddleware(compiler, opts)
  return async (ctx, next) => { // eslint-disable-line
    const stream = new PassThrough()
    await expressMiddleware(ctx.req, {
      write: stream.write.bind(stream),
      writeHead: (state, headers) => {
        ctx.body = stream
        ctx.state = state
        ctx.set(headers)
      }
    }, next)
  }
}
