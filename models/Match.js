import mongoose from 'mongoose';

const MatchSchema = new mongoose.Schema(
  {
    Match_id: { type: Number, required: true, unique: true, index: true },
    Ground: { type: String, default: null },
    date: { type: String, default: null },
    Home_team_id: { type: Number, default: null, index: true },
    Away_team_id: { type: Number, default: null, index: true },
  },
  { versionKey: false, timestamps: true }
);

export const Match = mongoose.models.Match || mongoose.model('Match', MatchSchema);
export default Match;
