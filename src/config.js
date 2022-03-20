import { access, mkdir } from 'fs'
import { join } from 'path'
export const createFolder = (folders) => {
  for (const folder of folders) {
    const path = `./${folder}`
    access(path, (error) => {
      if (error) {
        const newPath = join(__dirname, `.${path}`)
        mkdir(newPath, { recursive: true }, (e) => {
          if (e) {
            return console.error(e)
          }
          console.log(`${folder} Path Created`)
        })
      }
    })
  }
}
