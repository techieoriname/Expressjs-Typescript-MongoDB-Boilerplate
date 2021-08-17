import {Response} from "express"
import User from "../models/User";
import _ from "lodash";
import { UserRequest } from "../types";

class UsersController {
    static async getUserInfo(req: UserRequest, res: Response): Promise<Response> {
        try {
            const user = await User.findById(req.user).exec()
            if (user) {
                return res.json({
                    status: 'success',
                    msg: 'User fetched successfully',
                    user: _.omit(user.toObject(), ['password'])
                })
            }
            return res.status(404).json({
                status: 'error',
                msg: 'User not found'
            })
        } catch (e) {
            return res.status(500).json({
                status: 'error',
                msg: 'An internal server error occurred!'
            })
        }
    }
}
