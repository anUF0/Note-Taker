const express = require('express');
const path = require('path');
const db = require('./db/db.json');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');


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

//
app.get('api/notes', (req,res)=>{
    fs.readFile('./db/db.json', (data)=>{
        const parsedData = JSON.parse(data);
        res.json(parsedData)
    }
    )
});


app.post('/api/notes', (req,res) =>{
    const newNote = req.body
    newNote.id = uuidv4()

    db.push(newNote)
    
    fs.writeFileSync('./db/db.json', JSON.stringify(db))

    res.json(db)
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);