const express = require('express');
const path = require('path');
const db = require('./db/db.json');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

//Defaults to route 3001 if being run locally, else will use generated PORT
const PORT = process.env.PORT || 3001;
const app = express();

//Link to public assests
app.use(express.static('public'));
app.use(express.json());


//Get function for Index
app.get('/', (req, res) => 
  res.sendFile(path.join(__dirname, '/public/index.html'))
);


//Get function for the notes page
app.get('/notes', (req, res)=>
res.sendFile(path.join(__dirname, '/public/notes.html'))
);

//WIP Reads database of Notes
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        if (err) throw err;
        const parseData = JSON.parse(data);
        res.json(parseData)
    });   
})


//Post note fucntion
app.post('/api/notes', (req,res) =>{
    const newNote ={
    title: req.body.title,
    text: req.body.text,
    id: uuidv4()
    }

    db.push(newNote)
    fs.writeFileSync('./db/db.json', JSON.stringify(db))
    res.json(db)
});

//Delete function
app.delete('/api/notes/:id', (req, res) => {
    const updateDb = db.filter((note) =>
        note.id !== req.params.id)

    fs.writeFileSync('./db/db.json', JSON.stringify(updateDb))

    res.json(updateDb)
})

//Wildcard path to return to index
app.get('*', (req, res) => 
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);