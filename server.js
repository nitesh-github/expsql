const express = require('express');
const db = require('./models');
const PORT = process.env.PORT;
const routes = require('./routes');

const app = express();
const cors = require('cors');

const corsOptions = {
    origin: 'http://localhost:4000',  // Front-end URL to allow requests from
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
// Routes
app.use('/', routes);

// Sync Database 
db.sequelize.sync().then(() => {
  console.log('Database synced');
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
