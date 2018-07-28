'use strict'

const blessed = require('blessed')
const { format } = require('util')
const { EventEmitter } = require('events')

const NEW_MESSAGE = '<%s>: %s'
const SYSTEM_MESSAGE = '{center}{cyan-fg}%s{/cyan-fg}{/center}'
const SYSTEM_ERROR = '{center}{red-fg}%s{/red-fg}{/center}'

class Chat extends EventEmitter {
  constructor (screen) {
    super()
    this.$screen = screen
    this.$box = blessed.box({
      parent: this.$screen.element,
      width: '80%',
      height: '95%',
      right: 0,
      top: 0,
      label: ' {bold}{cyan-fg}GS2W{/cyan-fg}{/bold} Chat ',
      tags: true,
      border: {
        type: 'line',
        fg: 'white'
      },
      style: {
        bg: 'black'
      }
    })

    this.$input = blessed.textbox({
      parent: this.$screen.element,
      width: '80%',
      height: '5%',
      right: 0,
      bottom: 0,
      inputOnFocus: true,
      keys: true,
      border: {
        type: 'line',
        fg: 'white'
      },
      style: {
        bg: 'black'
      }
    })

    this.$input.key('C-c', () => { process.exit(0) })
    this.$input.on('cancel', () => { this.$input.focus() })
    this.$input.on('submit', (value) => this.onSubmit(value))
    this.$screen.on('new-message', (data) => { this.onNewMessage(data) })
    this.$screen.on('new-system-message', (data) => { this.onSystemMessage(data) })
    this.$screen.on('new-system-error', (data) => { this.onSystemError(data) })

    this.$input.focus()
  }

  addMessage (message) {
    this.$box.pushLine(message)
    this.$input.clearValue()

    if (!this.$input.focused) {
      this.$input.focus()
    }

    this.$screen.render()
  }

  onNewMessage ({ user, message }) {
    this.addMessage(format(NEW_MESSAGE, user.nickname, message))
  }

  onSystemMessage (message) {
    this.addMessage(format(SYSTEM_MESSAGE, message))
  }

  onSystemError (message) {
    this.addMessage(format(SYSTEM_ERROR, message))
  }

  onSubmit (value) {
    const me = this.$screen.me
    this.emit('new-message', { user: me, message: value })
  }

  setMessages (messages) {
    const lines = messages.map(message => format(NEW_MESSAGE, message.user.nickname, message.message))
    for (const line of lines) {
      this.addMessage(line)
    }
  }
}

module.exports = Chat
