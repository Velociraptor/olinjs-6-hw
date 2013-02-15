
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , Facebook = require('facebook-node-sdk');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(Facebook.middleware({ appId: '544492402252326', secret: 'ec543217f2401581d99cf6c60fee9d99' }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/login', Facebook.loginRequired({
  scope: ['user_photos', 'friends_photos', 'publish_stream']
}), function(req, res){
  res.redirect('/');
});
app.get('/', facebookGetUser(), user.show);
//app.post('/changeOptions', facebookGetUser(), user.changeOptions);
app.get('/destroy', user.destroy)
app.get('/test', facebookGetUser(), function(req, res){
    res.send("hello there", req.user);
});
app.get('/logout', facebookGetUser(), function(req, res){
  req.user = null;
  req.session.destroy();
  res.redirect('/');
  //res.redirect('/login');
});
app.post('/comment', facebookGetUser(), user.comment);

function facebookGetUser() {
  return function(req, res, next) {
    req.facebook.getUser( function(err, user) {
      if (!user || err){
        res.send("you need to login, please go to login route");
        //res.redirect('/login');
      } else {
        req.user = user;
        next();
      }
    });
  }
}

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

