import 'dotenv/config'
import app from './app'
import './database'
// import 'regenerator-runtime/runtime'
// import 'core-js/stable'
const PORT = process.env.NODE_PORT
app.listen(PORT)
console.info('Server listen on port', PORT)
