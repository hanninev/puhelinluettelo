const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(bodyParser.json())
app.use(morgan('tiny'))
morgan.token('data', (req, res) => JSON.stringify(req.body))
app.use(morgan(':data'))
app.use(cors())
app.use(express.static('build'))

const generateId = () => {
  return Math.floor(Math.random() * Math.floor(10000));
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({error: 'name missing'})
  } else if (body.number === undefined) {
    return response.status(400).json({error: 'number missing'})
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
    })
    .catch(error => {
      console.log(error)
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

app.get('/info', (req, res) => {
  const date = new Date()
  const persons = Person.find({});
  persons.count(function(err, count){
    res.send('<p>puhelinluettelossa on ' + count + ' henkilön tiedot</p><p>' + date + '</p>')
  })
  })
  
app.get('/api/persons', (req, res) => {
    Person
     .find({})
     .then(persons => {
       res.json(persons.map(formatPerson))
      })
      .catch(error => {
        console.log(error)
        response.status(404).end()
      })
  })

  app.put('/api/persons/:id', (request, response) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number
    }
  
    Person
      .findByIdAndUpdate(request.params.id, person, { new: true } )
      .then(person => {
        response.json(formatPerson(person))
      })
      .catch(error => {
        console.log(error)
        response.status(400).send({ error: 'malformatted id' })
      })
  })

  app.delete('/api/persons/:id', (request, response) => {
    Person
     .findByIdAndRemove(request.params.id)
     .then(result => {
       response.status(204).end()
     })
     .catch(error => {
       response.status(400).send({ error: 'malformatted id' })
     })
  })

app.get('/api/persons/:id', (request, response) => {
    Person
     .findById(request.params.id)
     .then(person => {
       if (person) {
        response.json(formatPerson(person))
       } else {
         response.status(404).end()
       }
     })
     .catch(error => {
      console.log(error)
      response.status(404).send({ error: 'malformatted id' })
    })
  })

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })