import User from "../models/User";

class UserService {
    static async findByEmail($email: string) {
        const user = await User.findOne({email: $email}).exec()
        if(user) {
            return user
        }
        return false
    }

    static async findByToken($token: string) {
        const user = await User.findOne({loginToken: $token}).exec()
        if(user) {
            return user
        }
        return false
    }
}

export default UserService
