// models/ReviewState.ts
import mongoose from 'mongoose';

interface IReviewState {
  hostaway_review_id: number;
  is_hidden: boolean;
  reason?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const reviewStateSchema = new mongoose.Schema<IReviewState>({
  hostaway_review_id: { 
    type: Number, 
    required: true, 
    unique: true,
    index: true // For fast lookups
  },
  is_hidden: { 
    type: Boolean, 
    default: false,
    index: true // For filtering queries
  },
  reason: String, // Optional reason for hiding
  notes: String, // Internal admin notes
}, {
  timestamps: true // Automatically manage createdAt/updatedAt
});

// Indexes for performance
reviewStateSchema.index({ hostaway_review_id: 1, is_hidden: 1 });

export const Review = (mongoose.models.ReviewState || mongoose.model<IReviewState>('ReviewState', reviewStateSchema)) as mongoose.Model<IReviewState>;


export async function connectMongo() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGODB_URI || '', { dbName: 'flex' });
}