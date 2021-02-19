const { json } = require('express');
let express = require('express');
let fs = require('fs');
let path = require('path');
//either use the enviroments port number or default to Port number 7000
var PORT = process.env.PORT || 8080;
//set the express function
var app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

//store the database variable so we can set the id to length of database later
const dataBaseNotes = JSON.parse(
    fs.readFileSync(path.join(__dirname, "./db/db.json"), (err, data) => {
        if (err) throw err;
    })
    );

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
app.get("/api/notes/", function(req, res) {
    res.sendFile(path.join(__dirname, "./db/db.json"));
  });
//delete logic
app.delete("/api/notes:id", function(req, res) {
    let id = req.params.id;
    console.log(id)
    fs.readFile("./db/db.json", 'utf-8',(err,data)=> {
        if(err) {
            throw err
        }
      let notesArr = JSON.parse(data)
      console.log(52);
      for (let i = 0; i < notesArr.length; i++) {
        
        if (notesArr[i].id == id){
          notesArr.splice(i, 1)
          console.log(55)
          }
        }
        fs.writeFile("./db/db.json", JSON.stringify(notesArr), ()=>{})
        res.json(notesArr)
      });
})

//post logic
app.post("/api/notes", function(req, res) {
    let newNote = req.body;
    newNote.id = dataBaseNotes.length;
    fs.readFile("./db/db.json", 'utf-8',(err,data)=> {
      if(err) throw err;
      let dataBase = JSON.parse(data)
      dataBase.push(newNote)
      fs.writeFile("./db/db.json", JSON.stringify(dataBase), ()=>{})
      res.json(newNote);
    })

  });

//show what Port is being listened for 
app.listen(PORT, function() {
console.log(`Listening on: ${PORT}`);
});