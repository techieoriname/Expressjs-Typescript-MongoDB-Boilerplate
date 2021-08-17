import mongoose from 'mongoose';
import Logger from "../libs/logger";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MongoServer, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
        })

        Logger.http(`MongoDB Connected: ${conn.connection.host}`)

    } catch (error) {
        Logger.error(`ERROR: ${error.message}`)
        process.exit(1);
    }
};

export default connectDB
