const express = require("express")
const morgan = require("morgan")
const app = express()
const cors = require("cors")

app.use(cors())
app.use(express.json())
app.use(express.static("dist"))


let persons = [
  {
    id: "1",
    name: "Kirsikka Tuulikki",
    number: "040-1234567"
  },
  {
    id: "2",
    name: "Marjatta Tuulikki",
    number: "040-8910111"
  },
  {
    id: "3",
    name: "Toivo Markus",
    number: "040-2131415"
  }
]

app.get("/api/persons", (request, response) => {
  response.json(persons)
})

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

const generateId = () => {  
  return String(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))
}

app.post("/api/persons", (request, response) => {
  const body = request.body

  morgan.token("body", request => {
    return JSON.stringify(request.body)
  })
  app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

  var notUnique = false

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: "content missing" 
    })
  }
  persons.map(person => {
    if (person.name == body.name) {
      notUnique = true
      return response.status(400).json({
      error: "name must be unique"})
    }})
  
  if (!notUnique) {
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }

    persons = persons.concat(person)

    response.json(person)
  }
})

app.get("/info", (request, response) => {
  const phoneAmount = `<p>Phonebook has info for ${persons.length} people</p>`
  const date = `<p>${new Date()} </p>`
  console.log(date)
  response.send(phoneAmount + date)
})

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})