const express = require('express');
const db = require('./models');
const PORT = process.env.PORT;
const routes = require('./routes');
const session = require('express-session');
const helper = require('./helpers/formatHelper');

const app = express();
const cors = require('cors');

const corsOptions = {
    origin: 'http://localhost:4000',  // Front-end URL to allow requests from
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
};

app.use(cors(corsOptions));
app.use(session({
  secret: process.env.JWT_SECRET,  // Change to a strong secret
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 }   // Set `true` if using HTTPS
}));
app.use((req, res, next) => {
  res.locals.session = req.session;  // Make session available globally in all views
  res.locals.formatDate  = helper.formatDate;
  next();
});
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
