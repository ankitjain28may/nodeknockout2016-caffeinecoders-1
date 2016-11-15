 // app/routes.js
 // grab the user model we just created
 var User = require('./models/User');
 module.exports = function(app) {
     // server routes ===========================================================
     // handle things like api calls
     // authentication routes
     // sample api route
     app.get('/users', function(req, res) {
             console.log('Someones calling the users');
             // use mongoose to get all users in the database
             User.find(function(err, users) {
                 // if there is an error retrieving, send the error. 
                 // nothing after res.send(err) will execute
                 if (err) res.send(err);
                 res.json(users); // return all users in JSON format
             });
         })
         .post('/users', function(req, res) {
             User.find({ email: req.body.email }, function(err, user) {
                 if (user.length === 0) {
                     var user = new User();
                     user.name = req.body.name;
                     user.email = req.body.email;
                     user.password = req.body.password;
                     user.save(function(err) {
                         if (err) res.send(err);
                         // console.log(user._id);
                         res.json({ success: true });
                     });
                 } else {
                     res.json({ success: false });
                 }
             });
         })
         .get('/users/:id', function(req, res) {
             console.log('Someones calling a users');
             // use mongoose to get all users in the database
             User.find({ _id: req.params.id }, function(err, user) {
                 // if there is an error retrieving, send the error. 
                 // nothing after res.send(err) will execute
                 if (err) res.send(err);
                 console.log(user);
                 res.json(user); // return all users in JSON format
             });
         })
         .put('/users/:id', function(req, res) {
             User.findById(req.params.id, function(err, user) {
                 if (typeof user != "undefined") {
                     user.name = req.body.name || user.name;
                     user.email = req.body.email || user.email;
                     user.password = req.body.password || user.password;
                     user.posts = req.body.posts || user.posts;
                     user.save(function(err) {
                         if (err) res.send(err);
                         res.json({ success: true });
                     });
                 } else {
                     res.json({ success: false });
                 }
             });
         })
         .delete('/users/:id', function(req, res) {
             var userId = req.params.id;
             User.remove({ _id: userId }, function(err) {
                 if (err) res.send(err);
                 res.json({ success: false });
             });
         })
         // route to handle creating goes here (app.post)
         // route to handle delete goes here (app.delete)
         // frontend routes =========================================================
         // route to handle all angular requests
         .get('*', function(req, res) {
             res.sendfile('./public/index.html'); // load our public/index.html file
         });
 };
