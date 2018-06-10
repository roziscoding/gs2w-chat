'use strict'

const env = require('sugar-env')

module.exports = {
  username: env.get('GS2W_USER', 'hack'),
  password: env.get('GS2W_PASS', 'theplannet'),
  port: parseInt(env.get('GS2W_PORT', 3000))
}
