const express = require('express')
const next = require('next')
const SettingsControllers = require('./controller/settings');
const bodyParser = require('body-parser');

//ENV variables
const dotenv = require('dotenv');
dotenv.config();

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
//const handle = app.getRequestHandler()
const port = parseInt(process.env.PORT, 10) || 3000;

//NEXT ROUTES
const routes = require('./routes')
const handle = routes.getRequestHandler(app)

//Mongoose
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true
});
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function(){
});
mongoose.set('useCreateIndex', true);

app
  .prepare()
  .then(() => {
    const server = express()
    //server.use(express.urlencoded());
    //server.use(express.json());

    // Tell the bodyparser middleware to accept more data
    server.use(bodyParser.json({limit: '5mb'}));
    server.use(bodyParser.urlencoded({limit: '5mb', extended: true}));

    // GET SETTINGS
    server.get('/api/coupons/:shop', SettingsControllers.findCoupons);
    server.get('/api/settings/:shop', SettingsControllers.find);
    server.post('/api/sendemail', SettingsControllers.sendEmail)
    server.put('/api/saveuser', SettingsControllers.saveUser)
    server.put('/api/updatecoupons', SettingsControllers.updateCoupons)

    server.use(async (req, res) => {
      await handle(req, res);
      res.statusCode = 200;
      return
    });


    server.listen(port, err => {
      if (err) throw err
      console.log(`> Ready on port ${port}`)
    })
  })
  .catch(ex => {
    console.error(ex.stack)
    process.exit(1)
  })