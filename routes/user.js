var models = require('../models');
var User = models.User;

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.comment = function(req, res){
  //console.log(req.body)
  //res.send("your comment is "+req.body.comment);
  req.facebook.api('/me', function(err, person) {
  	//console.log(person.id);
    req.facebook.api('/'+person.id+'/feed', 'POST', {'message': '@'+req.body.friend+': '+req.body.comment}, function(err, stuff) {
  //req.facebook.api('/'+req.body.friend+'/feed', 'POST', {'message': req.body.comment}, function(err, stuff) {
  	console.log(err);
  	console.log(stuff);
  });
  //req.facebook.api('/https://graph.facebook.com/'+friend.userid+'/feed?message='+req.body.comment)
  res.send('You just posted the comment: '+req.body.comment);
});
};

exports.destroy = function(req, res) {
  console.log(req.session);
  req.session.destroy();
  console.log(req.session);
  res.redirect('/');
};

exports.show = function (req, res) {
  req.facebook.api('/me', function(err, person) {
  //req.facebook.api('/me/picture?type=large&redirect=false', function(err, data) {
  req.facebook.api('/me/friends', function(err, data) {
  //var friendPics = ???
  //console.log(data);
  existingUser = User.find({'username':person.name}).exec(function(err, existingUser) {
  	if (existingUser.length == 0) {
		var newUser = new User({'username':person.name, bgdColor:'blue', textColor:'red', boxColor:'green'});
	    newUser.save(function (err) {
	      if (err) {
	        return console.log("error we couldn't create your user");
	      };
	      req.session.user = newUser;
	      res.render("roulette", {title:"Hello " + person.name + '!', friends: data.data, user: newUser});
	    });
	}
    else {
    	req.session.user = existingUser[0];
    	res.render("roulette", {title:"Hello " + person.name + '!', friends: data.data, user: existingUser[0]});
    }
  });
  });
});
};