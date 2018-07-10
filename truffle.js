// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*', // Match any network id
      from:'0xe6e0a47a0af55919e95b42f232156e0f6fe1410e',
      gas:4712901
    }
  }
}
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*', // Match any network id
      from:'0xe6e0a47a0af55919e95b42f232156e0f6fe1410e',
      gas:4712901
    }
  }
}
