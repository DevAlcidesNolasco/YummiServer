import express from 'express'
// import morgan from 'morgan'
import pkg from '../package.json'
import placesRoutes from './routes/places'
import authenticationRoutes from './routes/authentication'
import usersRoutes from './routes/users'
import { createRoles } from './libs/initSetup'
import { createFolder } from './config'
import helmet from 'helmet'
// import { randomBytes } from 'crypto'
const app = express()
app.disable('x-powered-by')
app.use(helmet())
app.set('pkg', pkg)
app.use(express.json())

createFolder(['uploads/profile'])
createRoles()
// console.info(randomBytes(64).toString('hex'))
app.use('/gallery/profile', express.static('./uploads/profile'))
app.get('/', (req, res) => {
  const { name, author, description, version } = app.get('pkg')
  return res.json({ author, name, description, version })
})
app.use('/api/places', placesRoutes)
app.use('/api/auth', authenticationRoutes)
app.use('/api/users', usersRoutes)
export default app
