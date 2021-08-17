import {NextFunction, Request, Response} from "express";
import {verifyJWT} from "../libs/authToken";
import UserService from "../services/UserService";

async function loggedIn(req: Request, res: Response, next: NextFunction) {
    const bearerHeader = req.headers['authorization']
    if (bearerHeader) {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        const decoded = verifyJWT(bearerToken)
        if (decoded) {
            if (Date.now() <= decoded.exp + Date.now() + 60 * 60) {
                res.locals.user = decoded.user;
                const checkToken = await UserService.findByToken(decoded.token)

                if (checkToken) {
                    return next()
                }
                return res.status(400).send({
                    status: 'failed',
                    msg: 'Invalid token supplied'
                })
            } else {
                return res.status(401).send({
                    status: 'failed',
                    msg: 'Token expired'
                })
            }
        } else {
            return res.status(403).send({
                status: 'failed',
                msg: 'Invalid token supplied'
            })
        }
    }
}

export default loggedIn
