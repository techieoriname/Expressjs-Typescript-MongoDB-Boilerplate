import express from "express";
import auth from "./authRoutes";
const router = express.Router();

router.use(auth)

router.get('/', (req, res) => {
    return res.json({
        msg: "Boooom!!! we're live"
    });
})

router.get('/*', (req, res) => {
    return res.status(404).json({
        404: "Page not found"
    });
})

export default router
