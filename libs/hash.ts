import bcrypt from 'bcryptjs'

const hash = (value: string) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(value, salt);
}

const comparePassword = (password: string, hashedPassword: string) => {
    return bcrypt.compare(password, hashedPassword);
}

export {hash, comparePassword}
