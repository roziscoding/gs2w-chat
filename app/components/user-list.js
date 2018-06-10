'use strict'

const blessed = require('blessed')

class UserList {
  constructor (screen) {
    this.$screen = screen
    this.$people = []
    this.$list = blessed.list({
      parent: screen.element,
      label: '{bold}{cyan-fg} User List {/cyan-fg}{/bold}',
      interactive: false,
      tags: true,
      width: '20%',
      border: 'line',
      keys: true,
      style: {
        bg: 'black',
        item: {
          bg: 'black',
          fg: 'cyan'
        },
        border: {
          fg: 'white'
        }
      }
    })

    this.$screen.on('user-joined', (data) => { this.addPerson(data) })
    this.$screen.on('user-left', (data) => { this.removePerson(data) })
  }

  get element () {
    return this.$list
  }

  setPeople (people) {
    this.$people = people
    this.$list.setItems(people.map(person => person.nickname))
    this.$screen.render()
    return this
  }

  addPerson (person) {
    this.$people.push(person)
    this.$list.pushItem(person.nickname)
    this.$screen.render()
    return this
  }

  removePerson (person) {
    return this.$people.map(x => x.nickname).includes(person.nickname)
      ? this.setPeople(this.$people.filter(item => item.nickname !== person.nickname))
      : this
  }
}

module.exports = UserList
