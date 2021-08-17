import jwt from "jsonwebtoken"

const signJWT = (data: any, time = 3600) => {
    const secret = process.env.JWT_SECRET
    return jwt.sign(data, secret, {expiresIn: time})
}

const verifyJWT = (token: string): any => {
    const key = process.env.JWT_SECRET
    return jwt.verify(token, key, (err: any, decoded: any) => {
        if (err) {
            return err
        }
        return decoded
    })
}

export {
    signJWT, verifyJWT
}
