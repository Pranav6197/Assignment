import { Request, Response } from 'express';
import Event from '../models/Event';
import User from '../models/User';

export const getEventsSummary = async (req: Request, res: Response): Promise<void> => {
    try {
        const summary = await Event.aggregate([
            {
                $group: {
                    _id: '$eventType',
                    count: { $sum: 1 }
                }
            }
        ]);

        const formattedSummary: Record<string, number> = {};
        summary.forEach((item: any) => {
            formattedSummary[item._id] = item.count;
        });

        res.status(200).json(formattedSummary);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getUserActivity = async (req: Request, res: Response): Promise<void> => {
    try {
        const activity = await Event.aggregate([
            {
                $group: {
                    _id: '$userId',
                    totalEvents: { $sum: 1 },
                    lastEventAt: { $max: '$createdAt' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    _id: 0,
                    userId: '$_id',
                    userName: '$user.name',
                    totalEvents: 1,
                    lastEventAt: 1
                }
            }
        ]);

        res.status(200).json(activity);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
