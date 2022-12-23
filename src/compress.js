const sharp = require('sharp')
const redirect = require('./redirect')

function compress(quality, req, res, input) {
  const format = req.params.webp ? 'webp' : 'jpeg'
  const compressionQuality = req.params.quality * 0.1;
  
  quality = Math.ceil(compressionQuality);
  
  sharp(input)
    .grayscale(req.params.grayscale)
    .toFormat(format, {
      quality: quality,
      effort: 2
    })
    .toBuffer((err, output, info) => {
      if (err || !info || res.headersSent) return redirect(req, res)

      res.setHeader('content-type', `image/${format}`)
      res.setHeader('content-length', info.size)
      res.setHeader('x-original-size', req.params.originSize)
      res.setHeader('x-bytes-saved', req.params.originSize - info.size)
      res.status(200)
      res.write(output)
      res.end()
    })
}

module.exports = compress
