const express = require("express");
const fs = require("fs");

const port = process.env.PORT || 3001

const app = express();
const jsonParser = express.json();

app.use(express.static(__dirname + "/public1"));

const filePath = "readers.json";

app.get("/api/readers", function(req, res){

    const content = fs.readFileSync(filePath,"utf8");
    const readers = JSON.parse(content);
    //console.log(typeof readers);
    //console.log(readers[1].id);
    res.send(readers);
});

// получение одного пользователя по id
app.get("/api/readers/:id", function(req, res){

    const id = req.params.id; // получаем id
    const content = fs.readFileSync(filePath, "utf8");
    const readers = JSON.parse(content);
    let reader = null;
    // находим в массиве пользователя по id
    for(var i=0; i<readers.length; i++){
        if(readers[i].id==id){
            reader = readers[i];
            break;
        }
    }
    // отправляем пользователя
    if(reader){
        res.send(reader);
    }
    else{
        res.status(404).send();
    }
});

// получение отправленных данных
app.post("/api/readers", jsonParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const age = req.body.age;
    const isFree = req.body.isFree;
    const createdAt = req.body.createdAt;
    const updatedAt = req.body.updatedAt;
    
    let reader = {
        firstName: firstName,
        lastName: lastName,
        age: age,
        isFree: isFree,
        createdAt: createdAt,
        updatedAt: updatedAt
    };

    let data = fs.readFileSync(filePath, "utf8");
    let readers = JSON.parse(data);

    // находим максимальный id
    const id = Math.max.apply(Math,readers.map(function(o){return o.id;}))
    // увеличиваем его на единицу
    //reader.id = id+1;
    if (id == -Infinity) {
        reader.id = 1;
        //console.log(id);
    } else {
        reader.id = id+1;
        //console.log(id);
    }
    // добавляем пользователя в массив
    readers.push(reader);
    data = JSON.stringify(readers);
    // перезаписываем файл с новыми данными
    fs.writeFileSync("readers.json", data);
    res.send(reader);
});

// удаление пользователя по id
app.delete("/api/readers/:id", function(req, res){

    const id = req.params.id;
    let data = fs.readFileSync(filePath, "utf8");
    let readers = JSON.parse(data);
    let index = -1;
    // находим индекс пользователя в массиве
    for(var i=0; i < readers.length; i++){
        if(readers[i].id==id){
            index=i;
            break;
        }
    }
    if(index > -1){
        // удаляем пользователя из массива по индексу
        const reader = readers.splice(index, 1)[0];
        data = JSON.stringify(readers);
        fs.writeFileSync("readers.json", data);
        // отправляем удаленного пользователя
        res.send(reader);
    }
    else{
        res.status(404).send();
    }
});

// изменение пользователя
app.put("/api/readers", jsonParser, function(req, res){

    if(!req.body) return res.sendStatus(400);

    /* const userId = req.body.id;
    const userName = req.body.name;
    const userAge = req.body.age; */
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const age = req.body.age;
    const isFree = req.body.isFree;
    const createdAt = req.body.createdAt;
    const updatedAt = req.body.updatedAt;

    let data = fs.readFileSync(filePath, "utf8");
    const readers = JSON.parse(data);
    let reader;
    for(var i=0; i<readers.length; i++){
        if(readers[i].id==readerId){
            reader = readers[i];
            break;
        }
    }
    // изменяем данные у пользователя
    if(reader){
        reader.firstName = firstName;
        reader.lastName = lastName;
        reader.age = age;
        reader.isFree = isFree;
        reader.createdAt = createdAt;
        reader.updatedAt = updatedAt;
        data = JSON.stringify(readers);
        fs.writeFileSync("readers.json", data);
        res.send(reader);
    }
    else{
        res.status(404).send(reader);
    }
});

app.listen(port, () => {
    console.log('Server started on port:', port);
});