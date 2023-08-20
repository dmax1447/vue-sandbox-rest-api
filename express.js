// импортируем express
const express = require('express');
const { v4 } = require('uuid');

// импортируем моки
const mockUsers = require('./mock/users.js')

// моки и настройки
const PORT = 3000;

let CONTACTS = [...mockUsers];

// создаем сервер
const app = express();

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// разрешаем CORS
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('content-type', 'application/json');
    next();
});


/**
 * enpoints
 */

// создание нового контакта
app.post('/api/contacts', (req, res) => {
    // local
    const newContactData = req.body;
    const id = v4();
    const newContact = {...newContactData, id}
    CONTACTS.push(newContact);
    res.status(201);
    res.send(JSON.stringify(newContact));
});

// чтение всех контактов
app.get('/api/contacts', (req, res) => {
    console.log(req)
    res.send(JSON.stringify(CONTACTS));
});

//удаление контакта
app.delete('/api/contacts/:id', (req, res) => {
    console.log('DELETE api/contacts ', req.params.id);
    CONTACTS = CONTACTS.filter(contact => contact.id !== req.params.id)
    res.send()
});

//обновление контакта
app.put('/api/contacts/:id', (req, res) => {
    const id = req.params.id;
    const newData = req.body;
    const idx = CONTACTS.findIndex(contact => contact.id === id);
    CONTACTS[idx] = newData;
    res.send()
});


// запускаем сервер на порту
app.listen(PORT, () => {
    console.log(`app listen on port: ${PORT}`)
})
