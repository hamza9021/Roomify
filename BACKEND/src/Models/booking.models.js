import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
  checkInDate: Date,
  checkOutDate: Date,
  totalPrice: Number,
  status: String,
}, { timestamps: true });

export const Booking = mongoose.model('Booking', bookingSchema);