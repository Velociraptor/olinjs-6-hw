var mongoose = require('mongoose');

mongoose.connect(process.env.MONGOLAB_URI||'mongodb://localhost/captionroulette');
//mongoose.connect('mongodb://localhost/captionroulette');

var userSchema = mongoose.Schema({
    username: String
});

var User = mongoose.model('User', userSchema);

exports.User = User;
