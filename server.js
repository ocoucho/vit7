const express = require('express');
const app = express();
const mysql = require('mysql2');
const mongoose = require('mongoose');

// MYSQL CONNECTION
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'My$qL$eRv3r',
    database: 'company_db'
});

function verifyMySQLConnection() {
    connection.connect(function(err) {
        if (err) {
            console.error('Error connecting to MySQL: ' + err.stack);
            return;
        }
        console.log('MySQL connected as id ' + connection.threadId);
    });
}

// MONGOOSE CONNECTION
mongoose.connect('mongodb://127.0.0.1:27017/companyDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// MONGOOSE SCHEMA + MODEL
const ProjectSchema = new mongoose.Schema({
    name: String,
    budget: Number
});

const ProjectModel = mongoose.model('Project', ProjectSchema);

// MongoDB connection status logs
mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully');
});
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

// ROUTES
app.get('/employees', function (req, res) {
    connection.query('SELECT * FROM employees', function (error, results) {
        if (error) throw error;
        res.json(results);
    });
});

app.get('/projects', async (req, res) => {
    try {
        const projects = await ProjectModel.find({});
        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// START SERVER
app.listen(3000, function () {
    console.log('Server is running on port 3000!');
    verifyMySQLConnection();
});
