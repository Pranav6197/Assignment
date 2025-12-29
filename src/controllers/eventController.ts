import { Request, Response } from 'express';
import Event from '../models/Event';
import mongoose from 'mongoose';

export const createEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, eventType, metadata } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'Invalid User ID' });
            return;
        }

        const event = new Event({ userId, eventType, metadata });
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getEvents = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, eventType, startTime, endTime } = req.query;
        let query: any = {};

        if (userId) query.userId = userId;
        if (eventType) query.eventType = eventType;
        if (startTime || endTime) {
            query.createdAt = {};
            if (startTime) query.createdAt.$gte = new Date(startTime as string);
            if (endTime) query.createdAt.$lte = new Date(endTime as string);
        }

        const events = await Event.find(query);
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
