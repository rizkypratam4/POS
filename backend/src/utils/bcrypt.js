import bcrypt from "bcrypt"

const saltRounds = 10

export const encrypt = (password) => {
    return bcrypt.hashSync(password, saltRounds)
}

export const compare = (password, hash) => {
    return bcrypt.compareSync(password, hash)
}