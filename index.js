const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(bodyParser.json())
app.use(morgan('tiny')) // HUOM!! 3.8 puuttuu!
app.use(cors())
app.use(express.static('build'))

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Martti Tienari",
    "number": "040-123456",
    "id": 2
  },
  {
    "name": "Arto Järvinen",
    "number": "040-123456",
    "id": 3
  },
  {
    "name": "Lea Kutvonen",
    "number": "040-123456",
    "id": 4
  }  
]

const generateId = () => {
  return Math.floor(Math.random() * Math.floor(10000));
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({error: 'name missing'})
  } else if (body.number === undefined) {
    return response.status(400).json({error: 'number missing'})
  } else if (persons.filter(p => p.name === body.name).length > 0) {
    return response.status(400).json({error: 'name must be unique'})
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    id: generateId()
  })

  person
   .save()
   .then(person => {
     response.json(formatPerson(person))
     mongoose.connection.close()
    })

})

//TÄMÄ STAATTISEKSI 3.14
const formatPerson = (person) => {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })

app.get('/info', (req, res) => {
    const date = new Date()
    res.send('<p>puhelinluettelossa on ' + persons.length + ' henkilön tiedot</p><p>' + date + '</p>')
  })
  
app.get('/api/persons', (req, res) => {
    Person
     .find({})
     .then(persons => {
       res.json(persons.map(formatPerson))
       mongoose.connection.close()
      })
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

app.get('/api/persons/:id', (request, response) => {
    Person
     .findById(request.params.id)
     .then(person => {
       response.json(formatPerson(person))
     })
  })

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })