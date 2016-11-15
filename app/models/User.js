// app/models/nerd.js
// grab the mongoose module
var mongoose = require('mongoose');

// define our nerd model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('User', {
  name: {
    type: String,
    default: ''
  },
  email : {
    type: String,
    default: ''
  },
  password : {
    type: String,
    default: ''
  },
  posts : {
    type: String,
    default: ''
  }
});
mongoose.connect('mongodb://aditya:aditya12@ds151917.mlab.com:51917/nodeknock');
