var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var routes = require('./routes/index');
var users = require('./routes/users');
var states = require('./routes/states');
var reps = require('./routes/reps');
var orgs = require('./routes/orgs');
var about = require('./routes/about');
var seedMongo = require('./routes/seedMongo');
var heatMaps = require('./routes/heatMaps');

var app = express();


var marked = require('marked');
var markedFilter = function (body) {
  return marked(body);
};
markedFilter.safe = true;
swig.setFilter('marked', markedFilter);



app.engine('html', swig.renderFile);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/state', states);
app.use('/reps', reps);
app.use('/orgs', orgs);
app.use('/about', about);
app.use('/seedMongo', seedMongo);
app.use('/heatMaps', heatMaps);

app.use('/d3', express.static(__dirname + '/d3'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        swig.setDefaults({cache:false});
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
