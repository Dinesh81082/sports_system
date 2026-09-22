import mongoose from 'mongoose';

const CoachSchema = new mongoose.Schema(
  {
    Coach_id: { type: Number, required: true, unique: true, index: true },
    Coach_name: { type: String, required: true },
    Team_id: { type: Number, default: null, index: true },
    Age: { type: Number, default: null },
    Experience: { type: Number, default: null },
  },
  { versionKey: false, timestamps: true }
);

export const Coach = mongoose.models.Coach || mongoose.model('Coach', CoachSchema);
export default Coach;
