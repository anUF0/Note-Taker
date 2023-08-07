const express = require('express');
const path = require('path');
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

//Reads database of Notes
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        if (err) throw new Error;
        else{
        const parseData = JSON.parse(data);
        res.json(parseData)
        }
    });   
})


//Post note fucntion
app.post('/api/notes', (req,res) =>{
    
    const {title, text} = req.body;
    
    if (req.body){
    const newNote ={
    title,
    text,
    id: uuidv4(),
    };
    fs.readFile('./db/db.json', 'utf8',(err, data) =>{
    if(err){
        throw new Error
    }else{
        const parsedNotes = JSON.parse(data);
        parsedNotes.push(newNote);

        fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4), (err) =>
        err ? console.error(err) : console.info(`Notes has been updated`)
        );

        return
    }});}
    else {
        res.error('Error posting note');
      }
    });


//Delete function
app.delete('/api/notes/:id', (req, res) => {
    const db = JSON.parse(fs.readFileSync('db/db.json'))
    const deleteNotes = db.filter(note => note.id !== req.params.id);

    fs.writeFileSync('db/db.json', JSON.stringify(deleteNotes, null, 4)), (err)=>
    err ? console.error(err): console.info(`Note Deleted`);
    res.json(deleteNotes);
});

//Wildcard path to return to index
app.get('*', (req, res) => 
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);