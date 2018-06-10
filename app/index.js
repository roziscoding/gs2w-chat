'use strict'

const argv = require('argv')
const blessed = require('blessed')
const merge = require('lodash.merge')
const io = require('socket.io-client')
const Chat = require('./components/chat')
const { EventEmitter } = require('events')
const UserList = require('./components/user-list')

argv.option({
  name: 'nickname',
  short: 'n',
  type: 'string'
})

argv.option({
  name: 'server',
  short: 's',
  type: 'string'
})

argv.option({
  name: 'credentials',
  short: 'c',
  type: 'string'
})

const config = merge(
  require('./config'),
  argv.run().options
)

if (!config.nickname || !config.server) {
  console.error('You must provide nickname and server through the `MY_NICKNAME` and `SERVER` env variables, or through command line arguments')
  console.error('Loaded config:')
  console.error(JSON.stringify(config, null, 2))
  process.exit(1)
}

class Screen extends EventEmitter {
  constructor () {
    super()

    this.$currentUser = {
      nickname: config.nickname
    }

    this.$screen = blessed.screen({
      smartCSR: true
    })

    this.$screen.key(['C-c', 'q'], () => {
      process.exit(0)
    })

    this.$chat = new Chat(this)
    this.$userList = new UserList(this)

    this.$socket = io(`http://${config.server}`, { query: `nickname=${config.nickname}&credentials=${config.credentials}` })

    this.$socket.on('connect_error', (err) => {
      this.emit('new-system-error', `Connection error: ${err.message}`)
    })

    this.$socket.on('connect', () => {
      this.emit('new-system-message', 'Connected to server')
    })

    this.$socket.on('disconnect', () => {
      this.emit('new-system-message', 'Disconnected from server')
    })

    this.$chat.on('new-message', (data) => {
      this.$socket.emit('new-message', data)
    })

    this.$socket.on('new-message', (data) => {
      this.emit('new-message', data)
    })

    this.$socket.on('user-joined', (data) => {
      this.emit('user-joined', data)
    })

    this.$socket.on('user-left', (data) => {
      this.emit('user-left', data)
    })

    this.$socket.on('user-list', (users) => {
      this.$userList.setPeople(users)
    })

    this.$socket.on('message-history', (messages) => {
      this.$chat.setMessages(messages)
    })
  }

  get me () {
    return this.$currentUser
  }

  get element () {
    return this.$screen
  }

  render () {
    this.$screen.render()
  }
}

const screen = new Screen()

screen.render()
