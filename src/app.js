import express from 'express'
// import morgan from 'morgan'
import pkg from '../package.json'
import placesRoutes from './routes/places'
import authenticationRoutes from './routes/authentication'
import usersRoutes from './routes/users'
import { createRoles } from './libs/initSetup'
import { createFolder } from './config'
// import { randomBytes } from 'crypto'
const app = express()
createFolder(['uploads/profile'])
createRoles()
// console.info(randomBytes(64).toString('hex'))
app.set('pkg', pkg)
// app.use(morgan('dev'))
app.use(express.json())
app.use('/gallery/profile', express.static('./uploads/profile'))
app.get('/', (req, res) => {
  const { name, author, description, version } = app.get('pkg')
  res.json({ author, name, description, version })
})
app.use('/api/places', placesRoutes)
app.use('/api/auth', authenticationRoutes)
app.use('/api/users', usersRoutes)
export default app
