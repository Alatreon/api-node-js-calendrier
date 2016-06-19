var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var passport  	= require('passport');
var config      = require('./config/database');
var User        = require('./app/models/user');
var Task        = require('./app/models/task');
var port        = process.env.PORT || 8000;
var jwt         = require('jwt-simple');

// obtention de parametres de la requete
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
 
// log pour la console
app.use(morgan('dev'));
 
// initialisation de passport
app.use(passport.initialize());
 
// route par default
app.get('/', function(req, res) 
{
  res.send("Documentation : https://github.com/Alatreon/api-node-js");
});

// connection a la base de donnée
mongoose.connect(config.database);
 
require('./config/passport')(passport);

// creation de la variable qui va contenir les routes
var apiRoutes = express.Router();

// place les routes contenues dans "apiRoutes" avant /api/*
app.use('/v1/api', apiRoutes);

// creer un nouveau compte (POST http://localhost:8080/api/signup
apiRoutes.post('/signup', function(req, res) 
{

  res.header("Access-Control-Allow-Origin", "*");
  
  //res.header("Access-Control-Allow-Headers", "X-Requested-With");

  if (!req.body.name || !req.body.password || !req.body.email)
  {
    res.json({success: false, msg: 'Formulaire non valide.'});
  }
  else 
  {
    var newUser = new User({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email

    });
    // sauvegarde de l'utilisateur
    newUser.save(function(err)
    {
      if (err)
      {
        if(err.code==11000)
        {
          return res.json({success: false, msg: "L'utilisateur existe déjà. "});
        }
        else
        {
          return res.json({success: false, msg: err});
        }
      }
      else
      {
        res.json({success: true, msg: 'Utilisateur créer.'});
      }
    });
  }
});
 

// autentification d'un utilisateur a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) 
{
  res.header("Access-Control-Allow-Origin", "*");

  User.findOne({
    email: req.body.email
  }, function(err, user) 
  {
    if (err) throw err;
 
    if (!user)
    {
      res.send({success: false, msg: "L'utilisateur n'existe pas."});
    } 
    else 
    {
      // si les pass correspondent
      user.comparePassword(req.body.password, function (err, isMatch) 
      {
        if (isMatch && !err) 
        {
          // if user is found and password is right create a token
          var token = jwt.encode(user, config.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token, msg: "Connecté"});
        }
        else 
        {
          res.send({success: false, msg: 'Mauvais mot de passe.'});
        }
      });
    }
  });
});

// route pour un menbre (GET http://localhost:8080/api/memberinfo)
apiRoutes.get('/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) 
{
  var token = getToken(req.headers);
  if (token)
  {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
        name: decoded.name
      }, 
      function(err, user) 
      {
          if (err) throw err;
   
          if (!user) 
          {
            return res.status(403).send({success: false, msg: "L'utilisateur n'existe pas."});
          }
          else 
          {
            res.json({success: true, msg: 'Bienvenue dans la zone de ' + user.name + '!'});
          }
      }
    );
  } 
  else 
  {
    return res.status(403).send({success: false, msg: 'Aucun token fournie.'});
  }
});

apiRoutes.get('/users', function(req, res)
{
   User.find(
      function(err, user) 
      {
        var users=[];
        for(var i=0;i<user.length;i++)
        {
          users[i]={
            id:user[i].id,
            name:user[i].name,
            email:user[i].email,
            address:user[i].address,
            ressources:user[i].ressources,
            tasks:user[i].tasks 
          };
        }
        res.json({users});
      }
    );
});

apiRoutes.get('/ressources', function(req, res) 
{
   User.find(
      function(err, user) 
      {
        var ressources=[];
        var y=0;
        for(var i=0;i<user.length;i++)
        {
          if(user[i].ressource)
          {
            ressources[y]={
              id:user[i].id,
              name:user[i].name,
              address:user[i].address
            };
            y++;
          }
        }
        res.json({ressources});
      }
    );
});
apiRoutes.post('/addtask', function(req, res) 
{
    var NewTask = new Task({
      user: req.body.user,
      startdate: req.body.startdate,
      enddate: req.body.enddate,
      task: req.body.task,   
      type: req.body.type  
    });
    NewTask.save(function(err)
    {
      res.json({success: true, msg: 'Tache ajoutée'});
    });
});

apiRoutes.get('/user/:username', function(req, res) 
{
  if(req.params.username!=null)
  {
    User.findOne({
      name: req.params.username
    },
    function(err, user)
    {
      user={
        name:user.name,
        email:user.email,
        address:user.address,
        books:user.books
      };
      res.json({user});
    });
  }
  else
  {
    res.json({success: false, msg: 'Erreur'});
  }
});


getToken = function (headers) 
{
  if (headers && headers.authorization) 
  {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) 
    {
      return parted[1];
    } 
    else 
    {
      return null;
    }
  } 
  else 
  {
    return null;
  }
};

// demarage du serveur
app.listen(port);
console.log("test d'un console.log: http://localhost:" + port);