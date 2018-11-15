const express = require('express')
const app = express()
const port = process.env.port || 7600
const root = __dirname

const fallback = (...pathOptions) => (req, res, next) => {
  if ((req.method === 'GET' || req.method === 'HEAD') && req.accepts('html')) {
    res.sendFile.call(res, ...pathOptions, error => error && next())
  } else next()
}

app.use(express.static(root))
app.use(fallback('index.html', { root }))

let httpInstance = app.listen(port)

process.on('SIGINT', () => {
  console.log('gracefully shutting down')
  httpInstance.close()
  process.exit(0)
})
