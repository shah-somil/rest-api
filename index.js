// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const userRoutes = require('./routes/userRoutes');

// const app = express();
// const PORT = process.env.PORT || 3000;

// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error(err));

// app.use(express.json());
// app.use('/api/users', userRoutes);

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);
    });

// Test Route
app.get('/', (req, res) => {
    res.send('User Management API');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


const userRoutes = require('./routes/userRoutes');

// Use the user routes
app.use(userRoutes);