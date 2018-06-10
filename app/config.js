'use strict'

const env = require('sugar-env')

module.exports = {
  nickname: env.get('GS2W_NICKNAME'),
  server: env.get('GS2W_SERVER'),
  credentials: env.get('GS2W_CREDENTIALS')
}
