const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const url = 
`mongodb+srv://erikki:${password}@cluster0.s9inu.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=Cluster0`





mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model("Person", personSchema)
//auYWUhyf1ewUZOun
if (process.argv.length==5) {
	const person = new Person({
		name: process.argv[3],
		number: process.argv[4],
	})
	
	person.save().then(result => {
		console.log(`added ${person.name} number ${person.number} to phonebook`)
		mongoose.connection.close()
	})

	
} else {
	console.log("phonebook:")
	Person.find({}).then(result => {
		result.forEach(person => {
			console.log(person.name, person.number)
		})
		mongoose.connection.close()
	})
}


