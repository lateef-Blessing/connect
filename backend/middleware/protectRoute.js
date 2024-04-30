import jwt from "jsonwebtoken";

import prismadb from "../lib/prismadb.js";

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No Token Provided" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized - Invalid Token" })
        }

        const user = await prismadb.user.findUnique({
            where: {
                id: decoded.userId
            },
            select: {
                id: true,
                name: true,
                username: true,
                email: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        req.user = user;

        next();

    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export default protectRoute;