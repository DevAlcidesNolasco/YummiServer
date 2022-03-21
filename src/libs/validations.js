export const isValidObjectId = (id) => id.match(/^[0-9a-fA-F]{24}$/)
export const roleAssign = ({ req, res, next, role }) => {
  req.body.roleRequire = role
  next()
}
