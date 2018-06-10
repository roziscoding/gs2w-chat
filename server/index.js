'use strict'

const argv = require('argv')
const ip = require('./lib/ip')
const merge = require('lodash.merge')

const http = require('http').Server((req, res) => { })
const io = require('socket.io')(http)

argv.option({
  name: 'username',
  short: 'u',
  type: 'string'
})

argv.option({
  name: 'password',
  short: 'p',
  type: 'string'
})

argv.option({
  name: 'port',
  short: 'o',
  type: 'number'
})

const options = merge(require('./config'), argv.run().options)

let users = []
const messages = []

io.set('authorization', (handshake, callback) => {
  const { credentials } = handshake._query

  const allow = () => {
    console.log(`Allowing connection`)
    callback(null, true)
  }

  const deny = (reason) => {
    console.log(`Denying connection due to ${reason}`)
    callback(reason, false)
  }

  if (!credentials) {
    return deny('No credentials provided')
  }

  const [ username, password ] = `${credentials}`.split(':')

  if (!username || username !== options.username) {
    return deny('Invalid username')
  }

  if (!password || password !== options.password) {
    return deny('Invalid password')
  }

  allow()
})

io.on('connection', (socket) => {
  const { nickname } = socket.handshake.query

  users.push({ nickname })
  socket.broadcast.emit('user-joined', { nickname })
  socket.emit('user-list', users)
  socket.emit('message-history', messages)

  socket.on('disconnect', () => {
    users = users.filter(user => user.nickname !== nickname)
    io.emit('user-left', { nickname })
  })

  socket.on('new-message', (data) => {
    messages.push(data)
    socket.broadcast.emit('new-message', data)
  })
})

http.listen(options.port, () => {
  const ipAddr = ip.address()
  console.log(`Listening on ${ipAddr}:${options.port}`)
})
