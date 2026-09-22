import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema(
  {
    PLY_id: { type: Number, required: true, unique: true, index: true },
    PLY_name: { type: String, required: true },
    Team_id: { type: Number, default: null, index: true },
    Position: { type: String, default: null },
  },
  { versionKey: false, timestamps: true }
);

export const Player = mongoose.models.Player || mongoose.model('Player', PlayerSchema);
export default Player;
