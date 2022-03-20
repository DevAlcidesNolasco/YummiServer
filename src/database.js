import mongoose from 'mongoose'
const mongooseOptions = {
  dbName: 'WTE',
  useNewUrlParser: true,
  useUnifiedTopology: true
  // useCreateIndex: true
}

mongoose.connect('mongodb://localhost:27017', mongooseOptions)
  .then(() => { console.info('DB connected') })
  .catch((err) => { console.error(err) })
