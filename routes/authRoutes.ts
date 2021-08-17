import express from "express";
const auth = express.Router();

import AuthController from "../controllers/AuthController";

auth.post('/register', AuthController.register)
auth.post('/login', AuthController.login)

export default auth
