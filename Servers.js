require('dotenv').config(); // Make sure to install dotenv package

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const path = require('path');

try {
    app.options('*', cors()); 
    app.use(bodyParser.json());
    app.use(cors({
        origin: ['https://ayomifrosh-portfolio-building.vercel.app/'],
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type,Authorization',
        optionsSuccessStatus: 200
    }));
} catch (error) {
    console.error('Error setting up CORS and body parser:', error);
}

try {
    app.get('/', (req, res) => {
        res.send('Welcome to my server!');
    });
} catch (error) {
    console.error('Error on GET / route:', error);
}

try {
    app.use(express.static(path.join(__dirname, '..', 'building', 'build')));
} catch (error) {
    console.error('Error setting up static directory:', error);
}

try {
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'building', 'build', 'index.html'));
    });
} catch (error) {
    console.error('Error on wildcard GET route:', error);
}

// Configure nodemailer transport
let transporter;
try {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
} catch (error) {
    console.error('Error configuring nodemailer:', error);
}

try {
    app.post('/submit-form', (req, res) => {
        const { name, email, occupation, address, phone, message } = req.body;
        const mailOptions = {
            from: email,
            to: process.env.RECIPIENT_EMAIL,
            subject: 'New Message From Portfolio Site',
            text: JSON.stringify({ name, email, occupation, address, phone, message }, null, 2)
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                res.status(500).send('Error sending email');
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).send('Form submitted successfully');
            }
        });
    });
} catch (error) {
    console.error('Error on POST / route:', error);
}

const port = process.env.PORT || 3001;

try {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
} catch (error) {
    console.error(`Error starting server on port ${port}:`, error);
}
