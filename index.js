// импортируем express
const express = require('express');
const { v4 } = require('uuid');


// импортируем драйвер MongoDb
const MongoClient = require("mongodb").MongoClient;

// создаем клиент для локальной БД
const mongoClient = new MongoClient("mongodb://localhost:27017/", { useUnifiedTopology: true });

// создаем клиент для облачной БД
// const mongoClient = new MongoClient("mongodb+srv://dmax1447:Mistral147@cluster0-gknug.mongodb.net/test?retryWrites=true&w=majority", { useUnifiedTopology: true });

// моки и настройки
const PORT = 3000;

// создаем сервер
const app = express();

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// разрешаем CORS
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


/**
 * enpoints
 */

// создание нового контакта
app.post('/api/contacts', (req, res) => {
    const newContactData = req.body;
    const id = v4();
    const newContact = {...newContactData, id}
    mongoClient.connect( (err, client) => {
        const db = client.db("MyData");
        db.collection("users").insertOne({ ...newContactData, _id: id});
    });
    res.status(201);
    res.send(JSON.stringify(newContact));

});

// чтение всех контактов
app.get('/api/contacts', (req, res) => {
    mongoClient.connect( (err, client) => {
        const db = client.db("MyData");
        db.collection("users").find().toArray((err, results) => {
            if (!err) {
                console.log(results);
                res.send(JSON.stringify(results));
            }
        })
    });
});

//удаление контакта
app.delete('/api/contacts/:id', (req, res) => {
    console.log('DELETE api/contacts ', req.params.id);
    mongoClient.connect( (err, client) => {
        const db = client.db("MyData");
        if (!err) {
            db.collection("users").remove({ _id: req.params.id});
        }
    });
    res.send()
});

//обновление контакта
app.put('/api/contacts/:id', (req, res) => {
    const id = req.params.id;
    const newData = req.body;
    mongoClient.connect( (err, client) => {
        const db = client.db("MyData");
        if (!err) {
            db.collection("users").save({ _id: id, ...newData });
        }
    });
    res.send()
});


// поиск контакта по параметрам
app.get('/api/contacts/find', (req, res) => {
    console.log('GET api/contacts/find ', req.body);
});


// запускаем сервер на порту
app.listen(PORT, () => {
    console.log(`app listen on port: ${PORT}`)
})
