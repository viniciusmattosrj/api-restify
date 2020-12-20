const restify = require('restify');
const mongoose = require('mongoose');
require('dotenv').config()
const config = require('./config/enviroment.js');

mongoose.connect(`${config.dbConnection}://${config.dbHost}:${config.dbPort}/${config.dbDatabase}`, { useNewUrlParser:true})
    .then(_=> {
        const server = restify.createServer({
            name: 'Api Rest Restify',
            version: '1.0.0',
            ignoreTrailingSlash: true
        });
        
        server.use(restify.plugins.bodyParser());
        
        const studentSchema = new mongoose.Schema({
            name: {
                type: String,
                required: true
            }
        });
        
        const Student = mongoose.model('Student', studentSchema)

        server.get('/students', (req, res, next) => {
            Student.find().then(students => {
                res.json(students)
                return next()
            });
        });
        
        server.get('/students/:id', (req, res, next) => {
            Student.findById(req.params.id).then(student => {
                if(!student) {
                    res.status(404)
                    res.json({ message: ' Not found'});
                    return next();
                } 
                res.json(student)
                return next();
            });
        });

        server.post('/students', (req, res, next) => {
            let student = new Student(req.body)
            student.save().then(student => {
                res.json(student)
            }).catch(error => {
                res.status(400)
                res.json({message: error.message})
            });
        });

        const { PORT_LISTEN } = process.env;
    
        server.listen(PORT_LISTEN || 3000, () => {
            console.log('Api listening on 3000');
        });
    }).catch(console.error())