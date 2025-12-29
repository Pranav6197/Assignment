import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
    userId: mongoose.Types.ObjectId;
    eventType: 'login' | 'logout' | 'file_upload' | 'file_download';
    metadata?: Record<string, any>;
    createdAt: Date;
}

const EventSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    eventType: {
        type: String,
        required: true,
        enum: ['login', 'logout', 'file_upload', 'file_download']
    },
    metadata: { type: Object },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IEvent>('Event', EventSchema);
