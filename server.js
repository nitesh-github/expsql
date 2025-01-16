const express = require('express');
const db = require('./models');
const PORT = process.env.PORT;
const routes = require('./routes');

const app = express();
//app.use(express.json());
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
