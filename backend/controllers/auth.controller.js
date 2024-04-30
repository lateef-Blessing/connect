import bcrypt from "bcryptjs";

import prismadb from "../lib/prismadb.js";
import generateTokenAndSetCookie from "../lib/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { name, username, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match." });
        }

        const user = await prismadb.user.findFirst({
            where: {
                username
            }
        });

        if (user) {
            return res.status(400).json({ error: "Username already exists." });
        }

        // Hash password here 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await prismadb.user.create({
            data: {
                name,
                username,
                email,
                password: hashedPassword
            }
        })

        if (newUser) {
            generateTokenAndSetCookie(newUser.id, res);

            return res.status(201).json({
                id: newUser.id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email
            });
        } else {
            return res.status(400).json({ error: "Invalid user data." });
        }

    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await prismadb.user.findFirst({
            where: {
                username
            }
        });

        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        generateTokenAndSetCookie(user.id, res);

        return res.status(201).json({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: "Logged out successfully" })
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
