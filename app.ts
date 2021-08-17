import express from 'express';
import morganMiddleware from "./middlewares/morgan";
import * as dotenv from "dotenv";
import * as path from "path"
import Logger from "./libs/logger";
import connectDB from './config/db';
import {json} from "body-parser"
// import {default as authRouter} from "./routes/authRoutes"
import router from "./routes";

dotenv.config({ path: path.join(__dirname, '../.env') })

connectDB()

const app = express();

app.use(json())

app.use(morganMiddleware)

app.use(router);

const env = process.env
const PORT = env.PORT || 3000
app.listen(PORT, () => {
    Logger.http(`The application is listening on port ${PORT}`)
    Logger.http(`${process.env.appProtocol}://${env.appDomain}${env.NODE_ENV === 'development' ? `:${PORT}` : ''}`)
})
