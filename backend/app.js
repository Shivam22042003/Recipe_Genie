
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Razorpay = require('razorpay');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/tourismPlatform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB!'));

// Schemas
const hotelSchema = new mongoose.Schema({
  name: String,
  location: String,
  price: Number,
  rating: Number,
  availability: Boolean,
});
const guideSchema = new mongoose.Schema({
  name: String,
  license: String,
  languages: [String],
  availability: Boolean,
});
const bookingSchema = new mongoose.Schema({
  type: String,
  itemId: mongoose.Schema.Types.ObjectId,
  user: String,
  date: Date,
  paymentStatus: String,
});

const Hotel = mongoose.model('Hotel', hotelSchema);
const Guide = mongoose.model('Guide', guideSchema);
const Booking = mongoose.model('Booking', bookingSchema);

// Razorpay Integration
const razorpay = new Razorpay({
  key_id: 'YOUR_RAZORPAY_KEY_ID',
  key_secret: 'YOUR_RAZORPAY_SECRET',
});

// API Routes

// Fetch hotels
app.get('/api/hotels', async (req, res) => {
  const hotels = await Hotel.find();
  res.json(hotels);
});

// Fetch guides
app.get('/api/guides', async (req, res) => {
  const guides = await Guide.find();
  res.json(guides);
});

// Book hotel or guide
app.post('/api/book', async (req, res) => {
  const { type, itemId, user, date } = req.body;
  const booking = new Booking({ type, itemId, user, date, paymentStatus: 'Pending' });
  await booking.save();

  // Create Razorpay order
  const order = await razorpay.orders.create({
    amount: 50000, // Example amount in paise (₹500)
    currency: 'INR',
    receipt: booking._id.toString(),
  });

  res.json({ orderId: order.id, bookingId: booking._id });
});

// Confirm payment
app.post('/api/payment/confirm', async (req, res) => {
  const { bookingId, paymentId } = req.body;

  // Update payment status in the booking
  await Booking.findByIdAndUpdate(bookingId, { paymentStatus: 'Paid' });

  res.json({ message: 'Payment successful', paymentId });
});

// Start the server
app.listen(5000, () => console.log('Server running on http://localhost:5000'));
