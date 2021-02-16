const express = require('express');
const fs = require('fs');
const path = require('path');
//either use the enviroments port number or default to Port number 7000
const PORT = process.env.PORT || 7000;
//set the express function
let app = express();
//require the dataBase path
const dataBase = require('./db/db.json');

app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))

//read the db.json
const dataBaseNotes = JSON.parse(
fs.readFileSync(path.join(__dirname, '/db/db.json'), 
    (err, data) => {
    if (err) throw err;
})
);

//write the new database notes to the database
const dataBaseUpdate = dataBaseNotes => {
fs.writeFileSync(path.join(__dirname, './db/db.json'),JSON.stringify(dataBaseNotes),
    err => {
    if (err) throw err;
    }
);
};

//logic for the assets 
//styles.css
app.get('/assets/css/styles.css', function(req, res) {
    res.sendFile(path.join(__dirname, './public/assets/css/styles.css'));
});
//index.js
app.get('/assets/js/index.js', function(req, res) {
    res.sendFile(path.join(__dirname, './public/assets/js/index.js'));
});

//when '/notes' is in the path name return the notes page
app.get('/notes', function (req, res) {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});
//when '/' is in the path name return the main page
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './index.html'));
}); 
app.get('/api/notes', function (req, res) {
    return res.json(dataBaseNotes);
});
//delete logic
app.delete("/api/notes/:id", function(req, res){
    let id = req.params.id;
    fs.readFile('/db/db.json', 'utf-8', (err, data) => {
        let notesArr = JSON.parse(data);

        for(let i = 0; i < notesArr.length; i++){
            if(notesArr[i].id === id) {
                notesArr.splice(i, 1);
            }
        }
        fs.writeFile('/db/db.json', JSON.stringify(notesArr), () => {})
        res.json(notesArr);
    })
});

//post logic
app.post("/api/notes", function(req, res) {
    let newNote = req.body;
    let id = dataBaseNotes.length;
    newNote.id = id;
    dataBaseNotes.push(newNote);
    dataBaseUpdate(dataBaseNotes);
    return res.json(dataBaseNotes);
    });

//show what Port is being listened for 
app.listen(PORT, function() {
console.log(`Listening on: ${PORT}`);
});