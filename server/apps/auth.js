import { Router } from "express";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import { db } from "../utils/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


const authRouter = Router();
const usersCollection = db.collection("Users");

authRouter.post(
    "/register",
    [
        body("username").notEmpty().withMessage("Username is required"),
        body("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters long"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        try {
            const existingUser = await usersCollection.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = { username, password: hashedPassword };
            await usersCollection.insertOne(newUser);

            res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
);

authRouter.post(
    "/login",
    [
        body("username").notEmpty().withMessage("Username is required"),
        body("password").notEmpty().withMessage("Password is required"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        try {
            const user = await usersCollection.findOne({ username });
            if (!user) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

    
            const token = jwt.sign(
                { id: user._id, firstName: user.firstName, lastName: user.lastName },
                process.env.SECRET_KEY, 
                { expiresIn: "1h" } 
            );

            res.status(200).json({ message: "Login successful", token });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
);

export default authRouter;
