import Role from '../models/roles'
export const createRoles = async () => {
  try {
    const countRoles = await Role.estimatedDocumentCount()
    if (countRoles > 0) return
    const values = await Promise.all([
      new Role({ name: 'Admin' }).save(),
      new Role({ name: 'Moderator' }).save(),
      new Role({ name: 'Seller' }).save(),
      new Role({ name: 'User' }).save()
    ])
    console.log(values)
  } catch (error) {
    console.error(error)
  }
}
