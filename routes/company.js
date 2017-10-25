var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var async = require('async');

var Company = require('../models/company');
var User = require('../models/user');

var {arrayAverage} = require('../myFunctions');


module.exports = (app) => {
    
    app.get('/company/create', (req, res) => {
        var success = req.flash('success');
        res.render('company/company', {title: 'Company Registration', user: req.user, success:success, noErrors: success.length > 0});
    });
    
    app.post('/company/create', (req, res) => {
        
        var newCompany = new Company();
        newCompany.name = req.body.name;
        newCompany.address = req.body.address;
        newCompany.city = req.body.city;
        newCompany.country = req.body.country;
        newCompany.sector = req.body.sector;
        newCompany.website = req.body.website;
        newCompany.image = req.body.upload;
        
        newCompany.save((err) => {
            if(err){
                console.log(err);
            }
            
            console.log(newCompany);
            
            req.flash('success', 'Company data has been added.');
            res.redirect('/company/create');
        })
    });
    
    app.post('/upload', (req, res) => {
        var form = new formidable.IncomingForm();
        
        form.uploadDir = path.join(__dirname, '../public/uploads');
        
        form.on('file', (field, file) => {
           fs.rename(file.path, path.join(form.uploadDir, file.name), (err) => {
               if(err){
                   throw err
               }
               
               console.log('File has been renamed');
           }); 
        });
        
        form.on('error', (err) => {
            console.log('An error occured', err);
        });
        
        form.on('end', () => {
            console.log('File upload was successful');
        });
        
        form.parse(req);
        
    });
    
    app.get('/companies', (req, res) => {
        Company.find({}, (err, result) => {
            res.render('company/companies', {title: 'All Companies || RateMe', user: req.user, data: result});
        });
    });
    
    app.get('/company-profile/:id', (req, res) => {
        Company.findOne({'_id':req.params.id}, (err, data) => {
            var avg = arrayAverage(data.ratingNumber);
            
            res.render('company/company-profile', {title: 'Company Name', user:req.user, id: req.params.id, data:data, average: avg});
        });
    });
    
    app.get('/company/register-employee/:id', (req, res) => {
        Company.findOne({'_id':req.params.id}, (err, data) => {
            res.render('company/register-employee', {title: 'Register Employee', user:req.user, data: data});
        });
    });
    
    app.post('/company/register-employee/:id', (req, res, next) => {
        async.parallel([
            function(callback){
               Company.update({
                   '_id': req.params.id,
                   'employees.employeeId': {$ne: req.user._id}
               },
               {
                    $push: {employees: {employeeId: req.user._id, employeeFullname:req.user.fullname, employeeRole:req.body.role}}
               }, (err, count) => {
                   if(err){
                       return next(err);
                   }
                   callback(err, count);
               });
            },
            
            function(callback){
                async.waterfall([
                    function(callback){
                        Company.findOne({'_id': req.params.id}, (err, data) => {
                            callback(err, data);
                        })
                    },
                    
                    function(data, callback){
                        User.findOne({'_id': req.user._id}, (err, result) => {
                            result.role = req.body.role;
                            result.company.name = data.name;
                            result.company.image = data.image;
                            
                            result.save((err) => {
                                res.redirect('/home');
                            });
                        })
                    }
                ]);
            }
        ]);
    });
    
    app.get('/:name/employees', (req, res) => {
        Company.findOne({'name':req.params.name}, (err, data) => {
            res.render('company/employees', {title: 'Company EMployees', user: req.user, data: data});
        });
    });
    
    app.get('/companies/leaderboard', (req, res) => {
        Company.find({}, (err, result) => {
            res.render('company/leaderboard', {title: 'Companies Leadebaord || RateMe', user: req.user, data: result});
        }).sort({'ratingSum': -1});
    });
    
    app.get('/company/search', (req, res) => {
        res.render('company/search', {title: 'Find a Company', user:req.user});
    });
    
    app.post('/company/search', (req, res) => {
        var name = req.body.search;
        var regex = new RegExp(name, 'i');
        
        Company.find({'$or': [{'name':regex}]}, (err, data) => {
            if(err){
                console.log(err);
            }
            
            res.redirect('/company-profile/'+data[0]._id);
        });
    });
    
}

















