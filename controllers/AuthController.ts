import {NextFunction, Request, Response} from "express"
import Joi from "joi"
import jwt from 'jsonwebtoken'
import User from "../models/User";
import _ from "lodash"
import {comparePassword, hash} from "../libs/hash";
import {signJWT} from "../libs/authToken";
import Logger from "../libs/logger";

class AuthController {
    static async register(req: Request, res: Response): Promise<Response> {
        try {
            const schema = Joi.object({
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                email: Joi.string().email().required(),
                password: Joi.string().min(6).required(),
                confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
                role: Joi.string().valid('Admin', 'User').required()
            });

            const options = {
                abortEarly: false, // include all errors
                allowUnknown: true, // ignore unknown props
                stripUnknown: true // remove unknown props
            };

            // validate request body against schema
            const {error, value} = schema.validate(req.body, options);

            if (error) {
                // on fail return comma separated errors
                return res.status(422).json({
                    status: 'failed',
                    msg: 'An error occurred with records',
                    errors: error
                })
            } else {
                const {firstName, lastName, email, password, role} = req.body
                const user = await User.findOne({email})
                if (user)
                    return res.status(401).json({
                        status: 'unauthorized',
                        msg: 'Email already exist'
                    })

                const create = await User.create({firstName, lastName, email, password: hash(password), role});

                const convert = create.toObject()

                return res.status(201).json({
                    status: 'success',
                    msg: 'User registered successfully',
                    data: _.omit(convert, ["password"])
                })
            }
        } catch (e) {
            return res.status(500).json({
                status: 'failed',
                msg: 'An internal error occurred'
            })
        }
    }

    static async login(req: Request, res: Response): Promise<Response> {
        try {
            const schema = Joi.object({
                email: Joi.string().email().required(),
                password: Joi.string().min(6).required(),
            });

            const options = {
                abortEarly: false, // include all errors
                allowUnknown: true, // ignore unknown props
                stripUnknown: true // remove unknown props
            };

            // validate request body against schema
            const {error, value} = schema.validate(req.body, options);

            if (error) {
                return res.status(422).json({
                    status: 'failed',
                    msg: 'An error occurred with records',
                    errors: error
                })
            } else {
                const { email, password } = req.body

                const userExist = await User.findOne({ email }).exec()

                if (!userExist) {
                    return res.status(403).send({
                        status: 'error',
                        msg: 'Invalid email or password'
                    })
                }

                const passwordCheck = await comparePassword(password, userExist.password);
                if (!passwordCheck) {
                    return res.status(403).send({
                        status: 'error',
                        msg: 'Invalid email or password'
                    })
                }

                if (!passwordCheck) {
                    return res.status(403).send({
                        status: 'error',
                        msg: 'Invalid email or password'
                    })
                }

                const token = signJWT({
                    user: userExist._id,
                }, process.env.TOKEN_LIFETIME)

                const timeObject = new Date()
                const expiresIn = new Date(timeObject.getTime() + process.env.TOKEN_LIFETIME * 1000)


                return res.send({
                    status: 'success',
                    msg: 'Successfully Logged In!',
                    token,
                    user: _.omit(userExist.toObject(), ['password', '_id']),
                    expiresIn,
                })
            }
        } catch (e) {
            Logger.error(e)
            return res.status(500).json({
                status: 'failed',
                msg: 'An internal error occurred',
            })
        }
    }
}

export default AuthController
