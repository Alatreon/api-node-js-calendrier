var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var ObjectId = require('mongodb').ObjectId;
var passport  	= require('passport');
var config      = require('./config/database');
var User        = require('./app/models/user');
var Task        = require('./app/models/task');
var port        = process.env.PORT || 8000;
var jwt         = require('jwt-simple');
var check      = require('./check/check');

// obtention de parametres de la requete
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// log pour la console
app.use(morgan('dev'));
 
// initialisation de passport
app.use(passport.initialize());

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
 
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
  if (!req.body.name || !req.body.lastname || !req.body.password || !req.body.email || !check.checkEmail(req.body.email))
  {
    res.json({success: false, msg: 'Formulaire non valide.'});
  }
  else 
  {
    var newUser = new User({
      email: req.body.email,
      name: req.body.name,
      lastname: req.body.lastname,
      password: req.body.password,
      ressource: req.body.ressource
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
          return res.json({success: false, msg: "Erreur"});
        }
      }
      else
      {
        return res.json({success: true, msg: 'Utilisateur crée.'});

      }
    });
  }
});
 

// autentification d'un utilisateur (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) 
{
  User.findOne({
    email: req.body.email
  }, function(err, user) 
  {
    if (err){ throw err; }
 
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

// route pour   un menbre (GET http://localhost:8080/api/memberinfo)

  apiRoutes.get('/memberinfo', function(req, res, next) {

    if(getToken(req.headers)==null)
    {
      res.status(403).send({success: false, msg: 'Aucun token fournie.'});
    }
    else
    {
      passport.authenticate('jwt', function(err, user, info) {
      var token = getToken(req.headers);

        try
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
                res.json(
                  {
                    success: true,
                    info: {
                      id:user._id,
                      name:user.name,
                      email:user.email,
                      lastname:user.lastname,
                      role:"Assistant Qualité"
                    }
                  });
              };
          });
        }
        catch(err)
        {
          res.status(403).send({success: false, msg: "Le token fourni ne correspond pas à la structure d'un token"})
        }

      })(req, res, next);
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

apiRoutes.post('/addtask', function(req, res) 
{

  var NewTask = new Task({
    user: req.body.user,
    ressource_id: req.body.ressource_id,
    name: req.body.name,
    start: req.body.start,
    end: req.body.end,   
    day: req.body.day,   
    week: req.body.week,   
    month: req.body.month,   
    year: req.body.year,   
    state: req.body.state,   
    text: req.body.text
  });

  NewTask.save(function(err)
  {
    if (err)
    {
      res.json({success: false, msg: 'Erreur'});
    }
    else
    {
      res.json({success: true, msg: 'Tache ajoutée'});
    }
  });
});

// apiRoutes.get('/user/:username', function(req, res) 
// {
//   if(req.params.username!=null)
//   {
//     User.findOne({
//       name: req.params.username
//     },
//     function(err, user)
//     {
//       user={
//         name:user.name,
//         email:user.email,
//         address:user.address,
//         books:user.books
//       };
//       res.json({user});
//     });
//   }
//   else
//   {
//     res.json({success: false, msg: 'Erreur'});
//   }
// });

apiRoutes.get('/usertask/:userid', function(req, res) 
{
  if(req.params.userid!=null)
  {
    try
    {
      Task.find({"user": new ObjectId(req.params.userid)},
      function(err, user)
      {
        var userReturn = [];
        for(var i=0; i<Object.keys(user).length; i++)
        {
          var item = {
            "user":user[i].user,
            "name":user[i].name,
            "start":user[i].start,
            "end":user[i].end,
            "day":user[i].day,
            "week":user[i].week,
            "month":user[i].month,
            "year":user[i].year,
            "state":user[i].state,
            "text":user[i].text 
          };
          userReturn.push(item);
        }
        res.json({success: true, msg:userReturn});      
      });
    }
    catch(err)
    {
        res.json({success: false, msg:"Id incorrect."});      
    }
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