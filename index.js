const express         = require('express')
    , app             = express()
    , http            = require('http')
    , path            = require('path')
    , { Server }      = require('socket.io')
    , RadioStation    = require('radio-station')

const server = http.createServer(app)
    , io = new Server(server)

const port = 8080

;(async () => {
  const radio = await RadioStation.create({
    pathWorkDir: path.join(__dirname, 'tracks-data-folder'),
    isLauncher: true,
    mainPort: port,
    login: 'localhost', // this optional, if you not define value, server generate auto 
    password: 'hackme' // this optional, if you not define value, server generate auto
  })

  app.get('/radio', (req, res) => {
    radio.addListener(req, res)
  })

  io.on('connection', async socket => {
    radio.onUse(info => {
      socket.emit('onUse', info)
    })
  })

  app.get('/picture', async (req, res) => {
    radio.picture(req, res)
  })

  app.get('/info', async (req, res) => {
    radio.info(req, res)
  })
})()

app.use('/', express.static(__dirname+'/public'))

server.listen(port, () => {
  console.log(`open: http://localhost:${port}`)
})
