import config from './config'
import app from './express'
import mongoose from 'mongoose'

mongoose.Promise = global.Promise
mongoose.set('useCreateIndex', true)
mongoose.set('useNewUrlParser', true)
// mongoose.connect(config.mongo)
mongoose.connect(config.mongoLab)
// mongoose.connect(mongodb://myDBReader:D1fficultP%40ssw0rd@mongodb0.example.com:27017/admin
mongoose.connection.on('error', () => { throw new Error(`unable to connect to database: ${config.mongo}`) })

app.listen(config.port, (err) => { console.log(`Server started on port ${config.port}`) })

export default app
