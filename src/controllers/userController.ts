import { Request, Response } from 'express';
import User from '../models/User';

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const user = new User({ name, email, role });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
