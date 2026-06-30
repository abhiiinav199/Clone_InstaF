import bcryptjs from 'bcryptjs'

// hash password
export const hashingPassword = async (password) => {
    const salt = await bcryptjs.genSalt(10)
    const hashPassword = await bcryptjs.hash(password, salt)
    return hashPassword
}