require('dotenv').config(); // Load environment variables

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const uri = process.env.MONGO_URI;

const app = express();
const port = 3000;

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));

// Connect to MongoDB
// Connect to MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error);
  });

// Todo model
const Todo = mongoose.model('Todo', {
  title: String,
  completed: Boolean
});

// Render the list of todos
app.get('/', (req, res) => {
  Todo.find({})
    .then((todos) => {
      res.render('index', { todos });
    })
    .catch((error) => {
      console.log('Error retrieving todos:', error);
      res.status(500).send('Internal Server Error');
    });
});

// Create a new todo
app.post('/todos', (req, res) => {
  const { title } = req.body;

  const newTodo = new Todo({
    title: title,
    completed: false
  });

  newTodo.save()
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => {
      console.log('Error creating new todo:', error);
      res.status(500).send('Internal Server Error');
    });
});

// Update the completion status of a todo
app.post('/todos/:id', (req, res) => {
  const id = req.params.id;
  const completed = req.body.completed === 'true';

  Todo.findByIdAndUpdate(id, { completed: completed })
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => {
      console.log('Error updating todo:', error);
      res.status(500).send('Internal Server Error');
    });
});

// Delete a todo
app.post('/todos/:id/delete', (req, res) => {
  const id = req.params.id;

  Todo.findByIdAndRemove(id)
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => {
      console.log('Error deleting todo:', error);
      res.status(500).send('Internal Server Error');
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
