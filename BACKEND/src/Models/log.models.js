import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  action: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  details: String,
  timestamp: Date,
});


export const Log = mongoose.model('Log', logSchema);
