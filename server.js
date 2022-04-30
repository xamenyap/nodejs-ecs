'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// Mongodb
var mongoClient = require('mongodb').MongoClient;
var url = 'mongodb://mongodb:27017/EmployeeDB';

mongoClient.connect(url, function(err, db) {
  if (err) {
      console.log('database is not connected')
    } else {
      console.log('connected!!')
    }
})

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello World');
});

// normally this operation should be accompanied by method POST
// use GET here to make it easier to test in browser
app.get('/create', (req, res) => {
  mongoClient.connect(url, function(err, client) {
    client.db('EmployeeDB').collection('Employee').insertOne({
      EmployeeID: 4,
      EmployeeName: "John Doe"
    }).
    then(result => res.send(result)).
    catch(error => res.send('something went wrong'));
  });
});

app.get('/list', (req, res) => {
  mongoClient.connect(url, function(err, client) {
    client.db('EmployeeDB').
      collection('Employee').
      find().
      toArray().
      then(results => res.send(results)).
      catch(error => res.send('something went wrong'));
  });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);