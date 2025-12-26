require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const auctionRoutes = require('./routes/auctions');

const PORT = process.env.PORT || 8000;

connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/auction');

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auctions', auctionRoutes);

app.get('/', (req, res) => res.send('Auction backend running'));

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
