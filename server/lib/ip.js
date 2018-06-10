'use strict'

const interfaces = require('os').networkInterfaces()

const destructInterface = (addressess, ifaceName) => {
  addressess.push(...interfaces[ifaceName])
  return addressess
}

const address = () => {
  const { address } = Object.keys(interfaces)
                            .reduce(destructInterface, [])
                            .filter(addr => addr.family === 'IPv4' && !addr.internal)
                            .pop()

  return address
}

module.exports = { address }
