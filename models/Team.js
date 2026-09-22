import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema(
  {
    Team_id: { type: Number, required: true, unique: true, index: true },
    Team_name: { type: String, required: true },
    Coach_name: { type: String, default: null },
    Home_ground: { type: String, default: null },
  },
  { versionKey: false, timestamps: true }
);

export const Team = mongoose.models.Team || mongoose.model('Team', TeamSchema);
export default Team;
