const mongoose = require('mongoose')

const url = 'mongodb://fullstack:salasana@ds127888.mlab.com:27888/puhelinluettelo-db'

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String,
  id: String
})

module.exports = Person