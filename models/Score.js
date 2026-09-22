import mongoose from 'mongoose';

const ScoreSchema = new mongoose.Schema(
  {
    Score_id: { type: Number, required: true, unique: true, index: true },
    Match_id: { type: Number, required: true, index: true },
    Win_team: { type: Number, default: null, index: true },
    Home_Score: { type: Number, default: 0 },
    Away_Score: { type: Number, default: 0 },
  },
  { versionKey: false, timestamps: true }
);

export const Score = mongoose.models.Score || mongoose.model('Score', ScoreSchema);
export default Score;
