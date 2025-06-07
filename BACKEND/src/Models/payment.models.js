import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  amount: Number,
  paymentMethod: String,
  transactionId: String,
  paymentDate: Date,
  status: String,
});

export const Payment = mongoose.model('Payment', paymentSchema);
